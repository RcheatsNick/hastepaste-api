import {
    Injectable,
    ConflictException,
    BadRequestException,
    NotFoundException,
    HttpStatus,
    UnauthorizedException,
} from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { AccessTokenData, APIRes, IUser, PatchResult, PersonalInfo } from "api-types";
import * as Jwt from "jsonwebtoken";
import { LoginSignupDTO } from "@routers/auth/dto/login-signup.dto";
import { PatchDTO } from "@routers/auth/dto/patch.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@routers/auth/user.entity";
import { Crypto } from "@crypto";
import { Snowflake } from "@snowflake";
import CONFIG from "src/config";
import { PasteService } from "@routers/paste/paste.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: MongoRepository<UserEntity>,
        private readonly snowflakeService: Snowflake,
        private readonly cryptoService: Crypto,
        private readonly pasteService: PasteService
    ) {}

    public replyPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }

    public async signup({
        mail,
        password,
    }: LoginSignupDTO): Promise<APIRes<AccessTokenData>> {
        const isUnique = await this.isUnique(mail);
        if (!isUnique)
            throw new ConflictException("This mail is already registered");
        const id = this.snowflakeService.generate();
        const user = this.userRepository.create({
            mail,
            password: this.cryptoService.encrypt(CONFIG.SECRET, password),
            id,
        });
        await this.userRepository.save(user);
        const { access_token, expiresIn } = this.generateToken({
            id,
            mail,
            is_admin: user.is_admin,
            is_banned: user.is_banned,
            mail_verified: user.mail_verified,
        });
        return {
            statusCode: HttpStatus.CREATED,
            message: "Successfully created",
            data: {
                access_token,
                expiresIn,
            },
        };
    }

    public async login({
        mail,
        password,
    }: LoginSignupDTO): Promise<APIRes<AccessTokenData>> {
        const { access_token, expiresIn } = await this.getToken({
            password,
            mail,
        });
        return {
            statusCode: HttpStatus.OK,
            message: "Successfully logged in",
            data: {
                access_token,
                expiresIn,
            },
        };
    }

    private async isUnique(mail: string): Promise<boolean> {
        const matchUsers = await this.userRepository.find({ mail });
        return matchUsers.length == 0;
    }

    public async isExists(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ id });
        return !!user;
    }

    public async getUserByID(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ id });
        return user;
    }

    private generateToken(
        payload: IUser,
        expiresIn: number = 30 * 24 * 60 * 60 * 1000,
    ): { access_token: string; expiresIn: number } {
        const access_token = Jwt.sign(payload, CONFIG.SECRET, {
            algorithm: "HS512",
            expiresIn,
        });
        return {
            access_token,
            expiresIn,
        };
    }

    public async getUser({
        mail,
        password,
    }: LoginSignupDTO): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ mail });
        if (
            !user ||
            this.cryptoService.decrypt(CONFIG.SECRET, user.password) != password
        )
            throw new BadRequestException("Invalid mail or password");
        return user;
    }

    public async getToken({
        mail,
        password,
    }: LoginSignupDTO): Promise<AccessTokenData> {
        const user = await this.getUser({ mail, password });
        const { access_token, expiresIn } = this.generateToken({
            id: user.id,
            mail,
            is_admin: user.is_admin,
            is_banned: user.is_banned,
            mail_verified: user.mail_verified,
        });
        return { access_token, expiresIn };
    }

    public async isBanned(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ id });
        return user && user.is_banned;
    }

    public async delete(id: string): Promise<APIRes<null>> {
        const exist = this.isExists(id);
        if (!exist) throw new NotFoundException("User not found");
        const isBanned = await this.isBanned(id);
        if (isBanned)
            throw new UnauthorizedException("This account has been banned");
        await this.userRepository.findOneAndDelete({ id });
        return {
            statusCode: HttpStatus.OK,
            message: "Account deleted",
            data: null,
        };
    }

    public async patchUser(
        { mail, password }: PatchDTO,
        user: IUser,
    ): Promise<APIRes<PatchResult>> {
        const exist = this.isExists(user.id);
        if (!exist) throw new NotFoundException("User not found");
        const isBanned = await this.isBanned(user.id);
        if (isBanned)
            throw new UnauthorizedException("This account has been banned");
        if (!mail && !password)
            throw new BadRequestException("Mail or password required");
        const updateData = {};
        if (mail) updateData["mail"] = mail;
        if (password)
            updateData["password"] = this.cryptoService.encrypt(
                CONFIG.SECRET,
                password,
            );
        await this.userRepository.updateOne(
            { id: user.id },
            { $set: updateData },
        );
        return {
            statusCode: HttpStatus.OK,
            message: "User updated",
            data: {
                id: user.id,
                ...updateData,
            },
        };
    }
    public async getPersonalInfo(user: IUser): Promise<APIRes<PersonalInfo>> {
        const userData = await this.getUserByID(user.id);
        if (!userData) throw new NotFoundException("User not found");
        if (userData.is_banned) throw new UnauthorizedException("This account has been banned");
        const { data: paste } = await this.pasteService.getPersonalPasteData(user);
        return {
            statusCode: 200,
            message: "Personal info",
            data: {
                user,
                paste
            }
        }
    }
}
