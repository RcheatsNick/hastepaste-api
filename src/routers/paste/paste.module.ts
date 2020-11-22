import { Module } from "@nestjs/common";
import { PasteController } from "@routers/paste/paste.controller";
import { PasteService } from "@routers/paste/paste.service";

@Module({
    controllers: [PasteController],
    providers: [PasteService],
})
export class PasteModule {}
