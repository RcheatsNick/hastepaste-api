import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Delete,
    Patch,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AccessTokenData, APIRes, PatchResult } from "api-types";
import { LoginSignupDTO } from "./dto/login-signup.dto";
import { PatchDTO } from "./dto/patch.dto";
import { AuthGuard } from "./auth.guard";
import { User } from "./user.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("ping")
    returnPing(): APIRes<null> {
        return this.authService.replyPing();
    }

    @Post("signup")
    async signup(
        @Body() body: LoginSignupDTO,
    ): Promise<APIRes<AccessTokenData>> {
        return await this.authService.signup(body);
    }

    @Post("login")
    async login(
        @Body() body: LoginSignupDTO,
    ): Promise<APIRes<AccessTokenData>> {
        return await this.authService.login(body);
    }

    @Delete()
    @UseGuards(AuthGuard)
    async deleteAccount(
        @User() user: { mail: string; id: string },
    ): Promise<APIRes<null>> {
        return await this.authService.delete(user.id);
    }

    @Patch()
    @UseGuards(AuthGuard)
    async patchAccount(
        @User() user: { mail: string; id: string },
        @Body() patchDTO: PatchDTO,
    ): Promise<APIRes<PatchResult>> {
        return await this.authService.patchUser(patchDTO, user);
    }

    @Get("access_token_test")
    @UseGuards(AuthGuard)
    testAccessToken(): APIRes<null> {
        return this.authService.replyPing();
    }
}
