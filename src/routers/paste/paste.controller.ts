import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PasteService } from "@routers/paste/paste.service";
import { APIRes, CreatedPaste, GetPaste, IUser } from "api-types";
import { PasteGuard } from "@routers/paste/paste.guard";
import { User } from "@routers/auth/user.decorator";
import { CreatePasteDTO } from "./dto/create-paste.dto";
import { GetPasteDTO } from "./dto/get-paste.dto";

@Controller("paste")
export class PasteController {
    constructor(private readonly pasteService: PasteService) {}

    @Get("ping")
    public returnPing(): APIRes<null> {
        return this.pasteService.returnPing();
    }

    @Post()
    @UseGuards(PasteGuard)
    public async createPaste(
        @Body() createPasteDTO: CreatePasteDTO,
        @User() user?: IUser,
    ): Promise<APIRes<CreatedPaste>> {
        return this.pasteService.createPaste(createPasteDTO, user);
    }

    @Get()
    public getPaste(
        @Query() getPasteDTO: GetPasteDTO,
    ): Promise<APIRes<GetPaste>> {
        return this.pasteService.getPaste(getPasteDTO);
    }

    /*
        TODO:
        Delete and get personal paste
    */
}
