import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@routers/auth/user.entity";
import { AdminController } from "@routers/admin/admin.controller";
import { AdminService } from "@routers/admin/admin.service";
import { AuthModule } from "@routers/auth/auth.module";
import { PasteModule } from "@routers/paste/paste.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, PasteModule],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [TypeOrmModule, AdminService],
})
export class AdminModule {}
