import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { APIRes } from "api-types";
import { AdminGuard } from "./admin.guard";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("ping")
    @UseGuards(AdminGuard)
    public returnPing(): APIRes<null> {
        return this.adminService.returnPing();
    }
}
