import { BadRequestException } from "@nestjs/common";
import { ValidateIf } from "class-validator";
import { Snowflake } from "../../../libs/snowflake";
const SnowflakeFactory = new Snowflake();

export abstract class UnBanUserDTO {
    /*
        @ValidateIf(body => SnowflakeFactory.isSnowflake(body.id));
        Normally, it will be useful to make a definition as above.
        But in this particular case, we need to do the validation process in this way.
        IDK why but NestJS does not perform strict validation on Query Parameters.
        It's okay to stay like this for now.
    */
    @ValidateIf(body => {
        if (!body.id) throw new BadRequestException("id must be a string");
        const isSnowflake = SnowflakeFactory.isSnowflake(body.id);
        if (!isSnowflake) throw new BadRequestException("specify a valid id");
        return isSnowflake;
    })
    id: string;
}
