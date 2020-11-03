import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Crypto } from "src/libs/crypto/src";
import { Snowflake } from "src/libs/snowflake/src";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [AuthController],
    providers: [AuthService, Crypto, Snowflake],
    exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
