import { Module } from "@nestjs/common";
import { AuthController } from "@routers/auth/auth.controller";
import { AuthService } from "@routers/auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@routers/auth/user.entity";
import { Crypto } from "@crypto";
import { Snowflake } from "@snowflake";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [AuthController],
    providers: [AuthService, Crypto, Snowflake],
    exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
