import { IsDefined } from "class-validator";

export abstract class ReportPasteDTO {
    @IsDefined()
    public id: string;
}
