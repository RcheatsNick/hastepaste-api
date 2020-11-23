import { IsDefined } from "class-validator";

export abstract class DeletePasteDTO {
    @IsDefined()
    public id: string;
}
