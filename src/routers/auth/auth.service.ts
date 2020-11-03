import {
    Injectable,
    ConflictException,
    BadRequestException,
    NotFoundException,
    HttpStatus,
} from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { AccessTokenData, APIRes, PatchResult } from "api-types";
import * as Jwt from "jsonwebtoken";
import { LoginSignupDTO } from "./dto/login-signup.dto";
import { PatchDTO } from "./dto/patch.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Crypto } from "../../libs/crypto";
import { Snowflake } from "../../libs/snowflake";
import CONFIG from "../../config";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: MongoRepository<UserEntity>,
        private readonly snowflakeService: Snowflake,
        private readonly cryptoService: Crypto,
    ) {}

    replyPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }

    async signup({
        mail,
        password,
    }: LoginSignupDTO): Promise<APIRes<AccessTokenData>> {
        const isUnique = await this.isUnique(mail);
        if (!isUnique)
            throw new ConflictException("This mail is already registered");
        const id = this.snowflakeService.generate();
        const user = await this.userRepository.create({
            mail,
            password: this.cryptoService.encrypt(CONFIG.SECRET, password),
            id,
        });
        await this.userRepository.save(user);
        const { access_token, expiresIn } = this.generateToken({
            id,
            mail,
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

    async login({
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

    async isUnique(mail: string): Promise<boolean> {
        const matchUsers = await this.userRepository.find({ mail });
        return matchUsers.length == 0;
    }

    async isExists(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ id });
        return !!user;
    }

    generateToken(
        payload: { id: string; mail: string },
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

    async getUser({ mail, password }: LoginSignupDTO): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ mail });
        if (
            !user ||
            this.cryptoService.decrypt(CONFIG.SECRET, user.password) != password
        )
            throw new BadRequestException("Invalid mail or password");
        return user;
    }

    async getToken({
        mail,
        password,
    }: LoginSignupDTO): Promise<{ access_token: string; expiresIn: number }> {
        const user = await this.getUser({ mail, password });
        const { access_token, expiresIn } = this.generateToken({
            id: user.id,
            mail,
        });
        return { access_token, expiresIn };
    }

    async delete(id: string): Promise<APIRes<null>> {
        await this.userRepository.findOneAndDelete({ id });
        return {
            statusCode: HttpStatus.OK,
            message: "Account deleted",
            data: null,
        };
    }

    async patchUser(
        { mail, password }: PatchDTO,
        user: { mail: string; id: string },
    ): Promise<APIRes<PatchResult>> {
        const exist = this.isExists(user.id);
        if (!exist) throw new NotFoundException("User not found");
        if (!mail && !password)
            throw new BadRequestException("Mail or password required");
        const updateData = {};
        if (mail) updateData["mail"] = mail;
        if (password)
            updateData["password"] = this.cryptoService.encrypt(
                CONFIG.SECRET,
                password,
            );
        await this.userRepository.updateOne({ id: user.id }, updateData);
        return {
            statusCode: HttpStatus.OK,
            message: "User updated",
            data: {
                id: user.id,
                ...updateData,
            },
        };
    }
}
