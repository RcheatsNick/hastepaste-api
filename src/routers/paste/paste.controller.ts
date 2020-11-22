import { Controller, Get } from "@nestjs/common";
import { PasteService } from "@routers/paste/paste.service";
import { APIRes } from "api-types";

@Controller("paste")
export class PasteController {
    constructor(private readonly pasteService: PasteService) {}
    @Get()
    public returnPing(): APIRes<null> {
        return this.pasteService.returnPing();
    }
}
