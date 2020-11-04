import { Injectable, HttpStatus } from "@nestjs/common";
import { APIRes } from "api-types";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../auth/user.entity";
import { MongoRepository } from "typeorm";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: MongoRepository<UserEntity>,
    ) {}
    public returnPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }
    public async isAdmin(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ id });
        return user && user.is_admin;
    }
}
