import { Controller, Get, HttpStatus } from "@nestjs/common";
import { APIRes } from "api-types";

@Controller()
export class AppController {
    @Get()
    public returnPing(): APIRes<null> {
        return {
            statusCode: HttpStatus.OK,
            message: "Pong!",
            data: null,
        };
    }
}
