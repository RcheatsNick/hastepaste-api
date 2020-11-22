import { IsDefined } from "class-validator";

export abstract class VerifyEMailDTO {
    @IsDefined()
    public verification_key: string;
}
