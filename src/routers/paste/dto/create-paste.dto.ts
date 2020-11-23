import { IsDefined } from "class-validator";

export abstract class CreatePasteDTO {
    @IsDefined()
    public paste: string;
}
