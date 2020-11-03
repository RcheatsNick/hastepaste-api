import * as dotenv from "dotenv";
dotenv.config();

const CONFIG = {
    API_VERSION: (process.env.API_VERSION as string) || "/v1",
    PORT: (process.env.PORT as unknown) as number,
    MONGODB_URI: process.env.MONGODB_URI as string,
    SECRET: process.env.SECRET as string,
};

export default CONFIG;
