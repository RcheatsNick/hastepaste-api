import { IsDefined } from "class-validator";

export abstract class ForkPasteDTO {
    @IsDefined()
    public id: string;
}
