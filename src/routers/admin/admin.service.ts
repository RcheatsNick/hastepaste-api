import { Injectable, HttpStatus, NotFoundException } from "@nestjs/common";
import { APIRes, BanListResult } from "api-types";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../auth/user.entity";
import { MongoRepository } from "typeorm";
import { BanUserDTO } from "./dto/ban-user.dto";
import { AuthService } from "../auth/auth.service";
import { UnBanUserDTO } from "./dto/unban-user.dto copy";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: MongoRepository<UserEntity>,
        private readonly authService: AuthService,
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
    public async banUser({ id, reason }: BanUserDTO): Promise<APIRes<null>> {
        const isExists = await this.authService.isExists(id);
        if (!isExists) throw new NotFoundException("user not found");
        const isBanned = await this.authService.isBanned(id);
        if (isBanned)
            throw new NotFoundException("This account has been banned");
        await this.userRepository.updateOne(
            { id },
            {
                $set: { is_banned: true, ban_reason: reason },
            },
        );
        return {
            statusCode: HttpStatus.OK,
            message: "account successfully banned",
            data: null,
        };
    }
    public async unBanUser({ id }: UnBanUserDTO): Promise<APIRes<null>> {
        const isExists = await this.authService.isExists(id);
        if (!isExists) throw new NotFoundException("user not found");
        const isBanned = await this.authService.isBanned(id);
        if (!isBanned)
            throw new NotFoundException("This account is not banned");
        await this.userRepository.updateOne(
            { id },
            {
                $set: { is_banned: false },
            },
        );
        return {
            statusCode: HttpStatus.OK,
            message: "account successfully unbanned",
            data: null,
        };
    }
    public async getBanList(): Promise<APIRes<BanListResult>> {
        const bannedUsers = await this.userRepository.find({ is_banned: true });
        const data = bannedUsers.map(user => {
            return {
                id: user.id,
                reason: user.ban_reason,
            };
        });
        return {
            statusCode: HttpStatus.OK,
            message: "Ban list",
            data,
        };
    }
}
