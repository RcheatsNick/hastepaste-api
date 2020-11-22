import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { MailService } from "@routers/mail/mail.service";
import { APIRes, IUser, VerificationResult } from "api-types";
import { AuthGuard } from "@routers/auth/auth.guard";
import { VerifyEMailDTO } from "@routers/mail/dto/verify-email.dto";
import { User } from "@routers/auth/user.decorator";

@Controller("mail")
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Get("ping")
    public returnPing(): APIRes<null> {
        return this.mailService.returnPing();
    }

    @Get("verify")
    @UseGuards(AuthGuard)
    public async sendVerificationMail(
        @User() user: IUser,
    ): Promise<APIRes<null>> {
        return this.mailService.generateEMailVerificationKey(user);
    }

    @Post("verify")
    public async verifyEmail(
        @Body() verifyEMailDTO: VerifyEMailDTO,
    ): Promise<APIRes<VerificationResult>> {
        return this.mailService.verifyEmail(verifyEMailDTO);
    }
}
