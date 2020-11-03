import { Length, IsEmail } from "class-validator";

export abstract class LoginSignupDTO {
    @IsEmail()
    public mail: string;

    @Length(8, 32)
    public password: string;
}
