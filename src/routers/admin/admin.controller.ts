import { Controller, Get, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { APIRes, BanListResult } from "api-types";
import { BanUserDTO } from "./dto/ban-user.dto";
import { UnBanUserDTO } from "./dto/unban-user.dto copy";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("ping")
    public returnPing(): APIRes<null> {
        return this.adminService.returnPing();
    }

    @Get("ban")
    public async banUser(
        @Query() banUserDTO: BanUserDTO,
    ): Promise<APIRes<null>> {
        return this.adminService.banUser(banUserDTO);
    }

    @Get("unban")
    public async unBanUser(
        @Query() unBanUserDTO: UnBanUserDTO,
    ): Promise<APIRes<null>> {
        return this.adminService.unBanUser(unBanUserDTO);
    }

    @Get("banlist")
    public async getBanList(): Promise<APIRes<BanListResult>> {
        return this.adminService.getBanList();
    }
}
