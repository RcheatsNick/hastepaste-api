import {
    Injectable,
    ConflictException,
    BadRequestException,
    NotFoundException,
    HttpStatus,
} from "@nestjs/common";
import { MongoRepository } from "typeorm";
import {
    AccessTokenData,
    APIRes,
    IUser,
    PatchResult,
    VerificationResult,
} from "api-types";
import * as Jwt from "jsonwebtoken";
import { LoginSignupDTO } from "./dto/login-signup.dto";
import { PatchDTO } from "./dto/patch.dto";
import { VerifyEMailDTO } from "./dto/verify-email.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Crypto } from "../../libs/crypto";
import { Snowflake } from "../../libs/snowflake";
import { readFileSync } from "fs";
import { resolve } from "path";
import CONFIG from "../../config";

@Injectable()
export class AuthService {
    private readonly verificationTemplate = readFileSync(`${resolve("src")}/templates/verification.html`, "utf-8");
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: MongoRepository<UserEntity>,
        private readonly snowflakeService: Snowflake,
        private readonly cryptoService: Crypto,
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
        const user = await this.userRepository.create({
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
            mail_verified: user.mail_verified
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
            mail_verified: user.mail_verified
        });
        return { access_token, expiresIn };
    }

    public async delete(id: string): Promise<APIRes<null>> {
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

    private async isVerified(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ id });
        if (!user || !user.mail_verified) return false;
        return true;
    }

    private async sendVerificationMail(mail: string, verification_key: string): Promise<boolean> {
        return new Promise((resolve) => {
            CONFIG.MAIL.SYSTEM.sendMail({
                from: `HastePaste System`,
                to : mail,
                subject : "HastePaste E-Mail Verification",
                text: "Please Verify Your HastePaste E-Mail",
                html : this.verificationTemplate.replace("{{{verification_key}}}", verification_key) 
            }, (err) => {
                if (err) resolve(false);
                resolve(true)
            })
        });
    }

    public async generateEMailVerificationKey(
        user: IUser,
    ): Promise<APIRes<null>> {
        const isExists = await this.isExists(user.id);
        if (!isExists) throw new BadRequestException("Account not found");
        const isVerified = await this.isVerified(user.id);
        if (isVerified) throw new ConflictException("Account already verified");
        const expiresIn = 30 * 24 * 60 * 60 * 1000;
        const verification_key = Jwt.sign(
            {
                id: user.id,
                mail: user.mail,
            },
            CONFIG.SECRET,
            {
                algorithm: "HS512",
                expiresIn,
            },
        );
        const isEmailSent = await this.sendVerificationMail(user.mail, verification_key);
        if (!isEmailSent) throw new BadRequestException("Can not send e-mail to this mail address");
        return {
            statusCode: HttpStatus.OK,
            message: "Verification e-mail successfully sent",
            data: null,
        };
    }

    public async verifyEmail({
        verification_key,
    }: VerifyEMailDTO): Promise<APIRes<VerificationResult>> {
        const res = ((await Jwt.verify(
            verification_key,
            CONFIG.SECRET,
            async (err, decoded: IUser) => {
                if (err)
                    throw new BadRequestException("Invalid verification key");
                const isExists = await this.isExists(decoded.id);
                if (!isExists)
                    throw new BadRequestException("Account not found");
                const isVerified = await this.isVerified(decoded.id);
                if (isVerified)
                    throw new ConflictException("Account already verified");
                await this.userRepository.updateOne(
                    { id: decoded.id },
                    { $set: { mail_verified: true } },
                );
                return {
                    statusCode: HttpStatus.ACCEPTED,
                    message: "Account verified successfully",
                    data: {
                        verified: true,
                    },
                };
            },
        )) as unknown) as APIRes<VerificationResult>;
        return res;
    }
}
