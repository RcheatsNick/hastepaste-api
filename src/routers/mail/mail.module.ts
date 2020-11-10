import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@routers/auth/user.entity";
import { MailController } from "@routers/mail/mail.controller";
import { MailService } from "@routers/mail/mail.service";
import { AuthModule } from "@routers/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
    controllers: [MailController],
    providers: [MailService],
    exports: [TypeOrmModule, MailModule],
})
export class MailModule {}
