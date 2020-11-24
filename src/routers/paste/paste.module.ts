import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PasteController } from "@routers/paste/paste.controller";
import { PasteService } from "@routers/paste/paste.service";
import { PasteEntity } from "@routers/paste/paste.entity";
import { AuthModule } from "@routers/auth/auth.module";
import { RandomString } from "@randomstring";

@Module({
    imports: [TypeOrmModule.forFeature([PasteEntity]), AuthModule],
    controllers: [PasteController],
    providers: [PasteService, RandomString],
    exports: [TypeOrmModule, PasteModule],
})
export class PasteModule {}
