import { Injectable, HttpStatus, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIRes, CreatedPaste, GetPaste, IUser } from "api-types";
import { RandomString } from "@randomstring";
import { MongoRepository } from "typeorm";
import { CreatePasteDTO } from "./dto/create-paste.dto";
import { GetPasteDTO } from "./dto/get-paste.dto";
import { PasteEntity } from "./paste.entity";

@Injectable()
export class PasteService {
    constructor(
        @InjectRepository(PasteEntity)
        private readonly pasteRepository: MongoRepository<PasteEntity>,
        private readonly randomStringService: RandomString,
    ) {}
    public returnPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }
    public async createPaste(
        { paste }: CreatePasteDTO,
        user?: IUser,
    ): Promise<APIRes<CreatedPaste>> {
        const id = this.randomStringService.generate();
        const pasteData = this.pasteRepository.create({
            id,
            content: paste,
            owner_id: user && user.id ? user.id : null,
        });
        await this.pasteRepository.save(pasteData);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Paste created",
            data: {
                id,
                owner: user && user.id ? user.id : null,
            },
        };
    }
    public async getPaste({ id }: GetPasteDTO): Promise<APIRes<GetPaste>> {
        const pasteData = await this.pasteRepository.findOne({
            id,
        });
        if (!pasteData)
            throw new BadRequestException(`Paste with id "${id}" not found`);
        return {
            statusCode: HttpStatus.OK,
            message: "Paste found",
            data: {
                paste: pasteData.content,
                owner: pasteData.owner_id,
                createdAt: pasteData.createdAt,
            },
        };
    }
}
