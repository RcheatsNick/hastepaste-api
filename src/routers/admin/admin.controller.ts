import { Controller, Get } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { APIRes } from "api-types";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("ping")
    public returnPing(): APIRes<null> {
        return this.adminService.returnPing();
    }
}
