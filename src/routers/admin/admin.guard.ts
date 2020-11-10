import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import { IUser } from "api-types";
import * as Jwt from "jsonwebtoken";
import CONFIG from "src/config";
import { AuthService } from "@routers/auth/auth.service";
import { AdminService } from "@routers/admin/admin.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly adminService: AdminService,
    ) {}
    public async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const token: string =
            req.headers["authorization"] || req.headers["x-access-token"];
        if (!token) throw new BadRequestException("invalid access token");
        await Jwt.verify(token, CONFIG.SECRET, async (err, decoded: IUser) => {
            if (err) throw new BadRequestException("invalid access token");
            const isExist = await this.authService.isExists(decoded.id);
            if (!isExist) throw new UnauthorizedException("user not found");
            const isAdmin = await this.adminService.isAdmin(decoded.id);
            if (!isAdmin)
                throw new UnauthorizedException("this user is not an admin");
            req.user = decoded;
            return true;
        });
        return true;
    }
}
