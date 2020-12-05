import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
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
import { EditPasteDTO } from "./dto/edit-paste.dto";

@Injectable()
export class PasteService {
    constructor(
        @InjectRepository(PasteEntity)
        private readonly pasteRepository: MongoRepository<PasteEntity>,
        private readonly randomStringService: RandomString,
    ) {}
    public async getPasteById(id: string): Promise<PasteEntity> {
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
        { paste, title, description }: CreatePasteDTO,
        user?: IUser,
    ): Promise<APIRes<CreatedPaste>> {
        const id = this.randomStringService.generate();
        const pasteData = this.pasteRepository.create({
            id,
            title,
            content: paste,
            description,
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
                paste: pasteData.is_reported ? "[REPORTED]" : pasteData.content,
                owner: pasteData.owner_id,
                fork_id: pasteData.fork_id,
                createdAt: pasteData.createdAt,
                is_reported: pasteData.is_reported,
                description: pasteData.description,
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
                is_reported: paste.is_reported,
                description: paste.description,
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
        const isExists = await this.pasteRepository.findOne({ id, owner_id });
        if (!isExists)
            throw new BadRequestException(
                `Paste with id ${id} not found on ${owner_id}'s account`,
            );
        if (isExists.is_reported)
            throw new UnauthorizedException(
                "This paste is reported and only can be deleted by an admin",
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
        if (forkData.is_reported)
            throw new UnauthorizedException(
                "This paste is reported and only can be forked by an admin",
            );
        if (forkData.owner_id === owner_id) 
            throw new BadRequestException(
                "You cannot fork your paste",
            );
        const id = this.randomStringService.generate();
        const pasteData = this.pasteRepository.create({
            id,
            owner_id,
            title: forkData.title + " (fork)",
            content: forkData.content,
            fork_id: forkData.id,
            description: forkData.description
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

    public async editPaste(
        { id, paste, title, description }: EditPasteDTO,
        { id: owner_id }: IUser,
    ): Promise<APIRes<boolean>> {
        const isExists = await this.pasteRepository.findOne({ id, owner_id });
        if (!isExists)
            throw new BadRequestException(
                `Paste with id ${id} not found on ${owner_id}'s account`,
            );
        if (isExists.is_reported)
            throw new UnauthorizedException(
                "This paste is reported and only can be edited by an admin",
            );
        if (!paste && !title)
            throw new BadRequestException("paste or title required");
        const data = {
            paste: paste || isExists.content,
            title: title || isExists.title,
            description: description || isExists.description,
        };
        await this.pasteRepository.updateOne(
            { id, owner_id },
            {
                $set: data,
            },
        );
        return {
            statusCode: HttpStatus.OK,
            message: "Paste edited successfully",
            data: true,
        };
    }
}
