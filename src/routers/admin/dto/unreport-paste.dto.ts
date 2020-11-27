import { IsDefined } from "class-validator";

export abstract class UnReportPasteDTO {
    @IsDefined()
    id: string;
}
