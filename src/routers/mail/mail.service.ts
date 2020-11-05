import {
    Injectable,
    HttpStatus,
    BadRequestException,
    ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIRes, IUser, VerificationResult } from "api-types";
import { MongoRepository } from "typeorm";
import { UserEntity } from "../auth/user.entity";
import { VerifyEMailDTO } from "./dto/verify-email.dto";
import { AuthService } from "../auth/auth.service";
import * as Jwt from "jsonwebtoken";
import CONFIG from "../../config";
import { verificationTemplate } from "../../templates";

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: MongoRepository<UserEntity>,
        private readonly authService: AuthService,
    ) {}

    public returnPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }

    private async isVerified(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ id });
        if (!user || !user.mail_verified) return false;
        return true;
    }

    private async sendVerificationMail(
        mail: string,
        verification_key: string,
    ): Promise<boolean> {
        return new Promise(resolve => {
            CONFIG.MAIL.SYSTEM.TRANSPORT.sendMail(
                {
                    from: `HastePaste System <${CONFIG.MAIL.SYSTEM.MAIL}>`,
                    to: mail,
                    subject: "HastePaste E-Mail Verification",
                    text: "Please Verify Your HastePaste E-Mail",
                    html: verificationTemplate.replace(
                        "{{{verification_key}}}",
                        verification_key,
                    ),
                },
                err => {
                    if (err) resolve(false);
                    resolve(true);
                },
            );
        });
    }

    public async generateEMailVerificationKey(
        user: IUser,
    ): Promise<APIRes<null>> {
        const isExists = await this.authService.isExists(user.id);
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
        const isEmailSent = await this.sendVerificationMail(
            user.mail,
            verification_key,
        );
        if (!isEmailSent)
            throw new BadRequestException(
                "Can not send e-mail to this mail address",
            );
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
                const isExists = await this.authService.isExists(decoded.id);
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
