import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Delete,
    Patch,
} from "@nestjs/common";
import { AuthService } from "@routers/auth/auth.service";
import { AccessTokenData, APIRes, IUser, PatchResult } from "api-types";
import { LoginSignupDTO } from "@routers/auth/dto/login-signup.dto";
import { PatchDTO } from "@routers/auth/dto/patch.dto";
import { AuthGuard } from "@routers/auth/auth.guard";
import { User } from "@routers/auth/user.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("ping")
    public returnPing(): APIRes<null> {
        return this.authService.replyPing();
    }

    @Post("signup")
    public async signup(
        @Body() body: LoginSignupDTO,
    ): Promise<APIRes<AccessTokenData>> {
        return await this.authService.signup(body);
    }

    @Post("login")
    public async login(
        @Body() body: LoginSignupDTO,
    ): Promise<APIRes<AccessTokenData>> {
        return await this.authService.login(body);
    }

    @Delete()
    @UseGuards(AuthGuard)
    public async deleteAccount(@User() user: IUser): Promise<APIRes<null>> {
        return await this.authService.delete(user.id);
    }

    @Patch()
    @UseGuards(AuthGuard)
    public async patchAccount(
        @User() user: IUser,
        @Body() patchDTO: PatchDTO,
    ): Promise<APIRes<PatchResult>> {
        return await this.authService.patchUser(patchDTO, user);
    }

    @Get("test")
    @UseGuards(AuthGuard)
    public testAccessToken(): APIRes<null> {
        return this.authService.replyPing();
    }
}
