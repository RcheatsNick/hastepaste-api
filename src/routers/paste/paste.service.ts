import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIRes } from "api-types";
import { RandomString } from "src/libs/randomstring";
import { MongoRepository } from "typeorm";
import { PasteEntity } from "./paste.entity";

@Injectable()
export class PasteService {
    constructor(
        @InjectRepository(PasteEntity)
        private readonly userRepository: MongoRepository<PasteEntity>,
        private readonly randomStringService: RandomString,
    ) {}
    public returnPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }
}
