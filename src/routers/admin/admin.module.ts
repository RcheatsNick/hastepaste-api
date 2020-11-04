import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../auth/user.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AuthModule } from "../auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AdminGuard } from "./admin.guard";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
    controllers: [AdminController],
    providers: [{ provide: APP_GUARD, useClass: AdminGuard }, AdminService],
    exports: [TypeOrmModule, AdminService],
})
export class AdminModule {}
