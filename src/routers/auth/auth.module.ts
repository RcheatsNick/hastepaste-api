import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Crypto } from "../../libs/crypto";
import { Snowflake } from "../../libs/snowflake";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [AuthController],
    providers: [AuthService, Crypto, Snowflake],
    exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
