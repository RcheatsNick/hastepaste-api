import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "@routers/admin/admin.service";
import { APIRes, BanListResult } from "api-types";
import { BanUserDTO } from "@routers/admin/dto/ban-user.dto";
import { UnBanUserDTO } from "@routers/admin/dto/unban-user.dto";
import { AdminGuard } from "@routers/admin/admin.guard";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("ping")
    @UseGuards(AdminGuard)
    public returnPing(): APIRes<null> {
        return this.adminService.returnPing();
    }

    @Get("ban")
    @UseGuards(AdminGuard)
    public async banUser(
        @Query() banUserDTO: BanUserDTO,
    ): Promise<APIRes<null>> {
        return this.adminService.banUser(banUserDTO);
    }

    @Get("unban")
    @UseGuards(AdminGuard)
    public async unBanUser(
        @Query() unBanUserDTO: UnBanUserDTO,
    ): Promise<APIRes<null>> {
        return this.adminService.unBanUser(unBanUserDTO);
    }

    @Get("banlist")
    @UseGuards(AdminGuard)
    public async getBanList(): Promise<APIRes<BanListResult>> {
        return this.adminService.getBanList();
    }
}
