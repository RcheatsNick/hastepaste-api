import { Injectable, HttpStatus, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    APIRes,
    CreatedPaste,
    ForkPaste,
    GetPaste,
    IUser,
    PersonalPaste,
} from "api-types";
import { RandomString } from "@randomstring";
import { MongoRepository } from "typeorm";
import { CreatePasteDTO } from "@routers/paste/dto/create-paste.dto";
import { GetPasteDTO } from "@routers/paste/dto/get-paste.dto";
import { PasteEntity } from "@routers/paste/paste.entity";
import { DeletePasteDTO } from "@routers/paste/dto/delete-paste.dto";
import { ForkPasteDTO } from "./dto/fork-paste.dto";

@Injectable()
export class PasteService {
    constructor(
        @InjectRepository(PasteEntity)
        private readonly pasteRepository: MongoRepository<PasteEntity>,
        private readonly randomStringService: RandomString,
    ) {}
    private async getPasteById(id: string): Promise<PasteEntity> {
        const pasteData = await this.pasteRepository.findOne({ id });
        if (!pasteData)
            throw new BadRequestException(`Paste with id "${id}" not found`);
        return pasteData;
    }
    public returnPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }
    public async createPaste(
        { paste, title }: CreatePasteDTO,
        user?: IUser,
    ): Promise<APIRes<CreatedPaste>> {
        const id = this.randomStringService.generate();
        const pasteData = this.pasteRepository.create({
            id,
            title,
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
        const pasteData = await this.getPasteById(id);
        return {
            statusCode: HttpStatus.OK,
            message: "Paste found",
            data: {
                title: pasteData.title,
                paste: pasteData.content,
                owner: pasteData.owner_id,
                fork_id: pasteData.fork_id,
                createdAt: pasteData.createdAt,
            },
        };
    }
    public async getPersonalPasteData({
        id,
    }: IUser): Promise<APIRes<PersonalPaste>> {
        const pasteData = (
            await this.pasteRepository.find({ owner_id: id })
        ).map(paste => {
            return {
                id: paste.id,
                title: paste.title,
                fork_id: paste.fork_id,
                createdAt: paste.createdAt,
            };
        });
        return {
            statusCode: HttpStatus.OK,
            message: "Get personal paste data",
            data: pasteData,
        };
    }
    public async deletePaste(
        { id }: DeletePasteDTO,
        { id: owner_id }: IUser,
    ): Promise<APIRes<boolean>> {
        const isExists = this.pasteRepository.findOne({ id, owner_id });
        if (!isExists)
            throw new BadRequestException(
                `Paste with id ${id} not found on ${owner_id}'s account`,
            );
        await this.pasteRepository.deleteOne({ id, owner_id });
        return {
            statusCode: HttpStatus.OK,
            message: "Paste deleted successfully",
            data: true,
        };
    }
    public async forkPaste(
        { id: fork_id }: ForkPasteDTO,
        { id: owner_id }: IUser,
    ): Promise<APIRes<ForkPaste>> {
        const forkData = await this.getPasteById(fork_id);
        const id = this.randomStringService.generate();
        const pasteData = this.pasteRepository.create({
            id,
            owner_id,
            title: forkData.title,
            content: forkData.content,
            fork_id: forkData.id,
        });
        await this.pasteRepository.save(pasteData);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Paste forked",
            data: {
                id,
                fork_id: forkData.id,
            },
        };
    }
}
