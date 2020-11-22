import { IsDefined } from "class-validator";

export abstract class GetPasteDTO {
    @IsDefined()
    public id: string;
}
