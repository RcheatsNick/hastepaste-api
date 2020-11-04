import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../auth/user.entity";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
    controllers: [MailController],
    providers: [MailService],
    exports: [TypeOrmModule, MailModule],
})
export class MailModule {}
