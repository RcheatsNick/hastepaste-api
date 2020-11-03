import { IsOptional, Length, IsEmail } from "class-validator";

export abstract class PatchDTO {
    @IsOptional()
    @IsEmail()
    public mail?: string;

    @IsOptional()
    @Length(8, 32)
    public password?: string;
}
