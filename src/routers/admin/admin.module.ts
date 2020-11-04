import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../auth/user.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AuthService } from "../auth/auth.service";
import { Snowflake } from "../../libs/snowflake";
import { Crypto } from "../../libs/crypto";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [AdminController],
    providers: [AdminService, AuthService, Snowflake, Crypto],
    exports: [TypeOrmModule, AdminService]
})
export class AdminModule {}
