import { IsDefined, IsOptional } from "class-validator";

export abstract class CreatePasteDTO {
    @IsDefined()
    public paste: string;

    @IsDefined()
    public title: string;

    @IsOptional()
    public description?: string;
}
