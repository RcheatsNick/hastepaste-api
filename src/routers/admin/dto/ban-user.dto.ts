import { Length, ValidateIf } from "class-validator";
import { Snowflake } from "../../../libs/snowflake";
const SnowflakeFactory = new Snowflake();

export abstract class BanUserDTO {
    @ValidateIf(body => SnowflakeFactory.isSnowflake(body.id))
    id: string;

    @Length(5)
    reason: string;
}
