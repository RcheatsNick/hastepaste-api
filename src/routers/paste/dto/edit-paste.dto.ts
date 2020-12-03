import { IsDefined, IsOptional } from "class-validator";

export abstract class EditPasteDTO {
    @IsDefined()
    public id: string;

    @IsOptional()
    public paste?: string;

    @IsOptional()
    public title?: string;

    @IsOptional()
    public description?: string;
}
