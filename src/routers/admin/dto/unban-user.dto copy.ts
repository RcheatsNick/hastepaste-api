import { ValidateIf } from "class-validator";
import { Snowflake } from "../../../libs/snowflake";
const SnowflakeFactory = new Snowflake();

export abstract class UnBanUserDTO {
    @ValidateIf(body => SnowflakeFactory.isSnowflake(body.id))
    id: string;
}
