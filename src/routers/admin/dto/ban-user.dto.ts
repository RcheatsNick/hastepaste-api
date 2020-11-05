import { BadRequestException } from "@nestjs/common";
import { Length, ValidateIf } from "class-validator";
import { Snowflake } from "../../../libs/snowflake";
const SnowflakeFactory = new Snowflake();

export abstract class BanUserDTO {
    /*
        @ValidateIf(body => SnowflakeFactory.isSnowflake(body.id));
        IDK why but this code is not working
    */
    @ValidateIf(body => {
        if (!body.id) throw new BadRequestException("id must be a string");
        const isSnowflake = SnowflakeFactory.isSnowflake(body.id);
        if (!isSnowflake) throw new BadRequestException("specify a valid id");
        return isSnowflake;
    })
    id: string;

    @Length(10)
    reason: string;
}
