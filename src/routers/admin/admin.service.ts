import { Injectable, HttpStatus, NotFoundException } from "@nestjs/common";
import { APIRes, BanListResult, ReportListResult } from "api-types";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@routers/auth/user.entity";
import { MongoRepository } from "typeorm";
import { BanUserDTO } from "@routers/admin/dto/ban-user.dto";
import { AuthService } from "@routers/auth/auth.service";
import { UnBanUserDTO } from "@routers/admin/dto/unban-user.dto";
import CONFIG from "src/config";
import { banTemplate, unBanTemplate } from "@templates";
import { PasteEntity } from "@routers/paste/paste.entity";
import { UnReportPasteDTO } from "./dto/unreport-paste.dto";
import { PasteService } from "@routers/paste/paste.service";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: MongoRepository<UserEntity>,
        @InjectRepository(PasteEntity)
        private readonly pasteRepository: MongoRepository<PasteEntity>,
        private readonly authService: AuthService,
        private readonly pasteService: PasteService,
    ) {}

    public returnPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }

    public async isAdmin(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ id });
        return user && user.is_admin;
    }

    private async sendBanNotificationMail(
        mail: string,
        reason: string,
    ): Promise<boolean> {
        return new Promise(resolve => {
            CONFIG.MAIL.SYSTEM.TRANSPORT.sendMail(
                {
                    from: `HastePaste System <${CONFIG.MAIL.SYSTEM.MAIL}>`,
                    to: mail,
                    subject: "HastePaste Ban Notification",
                    text: "You Have Been Banned From HastePaste",
                    html: banTemplate.replace("{{{reason}}}", reason),
                },
                err => {
                    if (err) resolve(false);
                    resolve(true);
                },
            );
        });
    }

    private async sendUnBanNotificationMail(mail: string): Promise<boolean> {
        return new Promise(resolve => {
            CONFIG.MAIL.SYSTEM.TRANSPORT.sendMail(
                {
                    from: `HastePaste System <${CONFIG.MAIL.SYSTEM.MAIL}>`,
                    to: mail,
                    subject: "HastePaste UnBan Notification",
                    text:
                        "Congratulations, You Have Been UnBanned From HastePaste!",
                    html: unBanTemplate,
                },
                err => {
                    if (err) resolve(false);
                    resolve(true);
                },
            );
        });
    }

    public async banUser({ id, reason }: BanUserDTO): Promise<APIRes<null>> {
        const user = await this.authService.getUserByID(id);
        if (!user) throw new NotFoundException("user not found");
        const isBanned = await this.authService.isBanned(id);
        if (isBanned)
            throw new NotFoundException("This account has been banned");
        await this.userRepository.updateOne(
            { id },
            {
                $set: { is_banned: true, ban_reason: reason },
            },
        );
        await this.pasteRepository.deleteMany({
            owner_id: id,
        });
        if (user.mail_verified)
            await this.sendBanNotificationMail(user.mail, reason);
        return {
            statusCode: HttpStatus.OK,
            message: "account successfully banned",
            data: null,
        };
    }

    public async unBanUser({ id }: UnBanUserDTO): Promise<APIRes<null>> {
        const user = await this.authService.getUserByID(id);
        if (!user) throw new NotFoundException("user not found");
        const isBanned = await this.authService.isBanned(id);
        if (!isBanned)
            throw new NotFoundException("This account is not banned");
        if (user.mail_verified) await this.sendUnBanNotificationMail(user.mail);
        await this.userRepository.updateOne(
            { id },
            {
                $set: {
                    is_banned: false,
                    ban_reason: null,
                    mail_verified: false,
                },
            },
        );
        return {
            statusCode: HttpStatus.OK,
            message: "account successfully unbanned",
            data: null,
        };
    }

    public async unReportPaste({ id }: UnReportPasteDTO): Promise<APIRes<null>> {
        const paste = await this.pasteService.getPasteById(id);
        if (!paste) throw new NotFoundException("Paste not found");
        const isReported = paste.is_reported
        if (!isReported)
            throw new NotFoundException("This paste is not reported");
        await this.pasteRepository.updateOne(
            { id },
            {
                $set: {
                    is_reported: false,
                },
            },
        );
        return {
            statusCode: HttpStatus.OK,
            message: "paste successfully unreported",
            data: null,
        };
    }

    public async getBanList(): Promise<APIRes<BanListResult>> {
        const bannedUsers = await this.userRepository.find({ is_banned: true });
        const data = bannedUsers.map(user => {
            return {
                id: user.id,
                reason: user.ban_reason,
                mail: user.mail,
            };
        });
        return {
            statusCode: HttpStatus.OK,
            message: "Ban list",
            data,
        };
    }

    public async getReportList(): Promise<APIRes<ReportListResult>> {
        const reportedPastes = await this.pasteRepository.find({ is_reported: true });
        const data = reportedPastes.map(paste => {
            return {
                owner: paste.owner_id,
                content: paste.content,
                fork_id: paste.fork_id,
                title: paste.title,
                id: paste.id
            };
        });
        return {
            statusCode: HttpStatus.OK,
            message: "Report list",
            data,
        };
    }
}
