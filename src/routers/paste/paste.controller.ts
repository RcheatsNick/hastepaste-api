import { Controller, Get, UseGuards } from "@nestjs/common";
import { PasteService } from "@routers/paste/paste.service";
import { APIRes, IUser } from "api-types";
import { PasteGuard } from "@routers/paste/paste.guard";
import { User } from "@routers/auth/user.decorator";

@Controller("paste")
export class PasteController {
    constructor(private readonly pasteService: PasteService) {}

    @Get("ping")
    @UseGuards(PasteGuard)
    public returnPing(@User() user?: IUser): APIRes<null> {
        console.log(user);
        return this.pasteService.returnPing();
    }
}
