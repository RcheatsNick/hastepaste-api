import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { PasteService } from "@routers/paste/paste.service";
import {
    APIRes,
    CreatedPaste,
    ForkPaste,
    GetPaste,
    IUser,
    PersonalPaste,
} from "api-types";
import { PasteGuard } from "@routers/paste/paste.guard";
import { User } from "@routers/auth/user.decorator";
import { CreatePasteDTO } from "@routers/paste/dto/create-paste.dto";
import { GetPasteDTO } from "@routers/paste/dto/get-paste.dto";
import { AuthGuard } from "@routers/auth/auth.guard";
import { DeletePasteDTO } from "@routers/paste/dto/delete-paste.dto";
import { ForkPasteDTO } from "./dto/fork-paste.dto";

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
    public async getPaste(
        @Query() getPasteDTO: GetPasteDTO,
    ): Promise<APIRes<GetPaste>> {
        return this.pasteService.getPaste(getPasteDTO);
    }

    @Get("fork")
    @UseGuards(AuthGuard)
    public async forkPaste(
        @Query() forkPasteDTO: ForkPasteDTO,
        @User() user: IUser,
    ): Promise<APIRes<ForkPaste>> {
        return this.pasteService.forkPaste(forkPasteDTO, user);
    }

    @Get("@me")
    @UseGuards(AuthGuard)
    public async getPersonalPasteData(
        @User() user: IUser,
    ): Promise<APIRes<PersonalPaste>> {
        return this.pasteService.getPersonalPasteData(user);
    }

    @Delete()
    @UseGuards(AuthGuard)
    public async deletePaste(
        @Body() deletePasteDTO: DeletePasteDTO,
        @User() user: IUser,
    ): Promise<APIRes<boolean>> {
        return this.pasteService.deletePaste(deletePasteDTO, user);
    }
}
