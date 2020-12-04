import { Module } from "@nestjs/common";
import { AuthController } from "@routers/auth/auth.controller";
import { AuthService } from "@routers/auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@routers/auth/user.entity";
import { Crypto } from "@crypto";
import { Snowflake } from "@snowflake";
import { PasteService } from "@routers/paste/paste.service";
import { PasteEntity } from "@routers/paste/paste.entity";
import { RandomString } from "@randomstring";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, PasteEntity])],
    controllers: [AuthController],
    providers: [AuthService, Crypto, Snowflake, PasteService, RandomString],
    exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
