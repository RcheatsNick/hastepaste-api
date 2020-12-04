import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PasteController } from "@routers/paste/paste.controller";
import { PasteService } from "@routers/paste/paste.service";
import { PasteEntity } from "@routers/paste/paste.entity";
import { RandomString } from "@randomstring";
import { AuthService } from "@routers/auth/auth.service";
import { UserEntity } from "@routers/auth/user.entity";
import { Snowflake } from "@snowflake";
import { Crypto } from "@crypto";

@Module({
    imports: [TypeOrmModule.forFeature([PasteEntity, UserEntity])],
    controllers: [PasteController],
    providers: [PasteService, RandomString, AuthService, Snowflake, Crypto],
    exports: [TypeOrmModule, PasteModule],
})
export class PasteModule {}
