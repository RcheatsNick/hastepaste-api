import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";
dotenv.config();

const CONFIG = {
    API_VERSION: (process.env.API_VERSION as string) || "/v1",
    PORT: (process.env.PORT as unknown) as number,
    MONGODB_URI: process.env.MONGODB_URI as string,
    SECRET: process.env.SECRET as string,
    MAIL: {
        SYSTEM: {
            MAIL: process.env.SYSTEM_MAIL as string,
            PASSWORD: process.env.SYSTEM_PASSWORD as string,
            TRANSPORT: nodemailer.createTransport({
                host: "smtp.yandex.ru",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SYSTEM_MAIL as string,
                    pass: process.env.SYSTEM_PASSWORD as string,
                },
            }),
        },
        CONTACT: {
            MAIL: process.env.CONTACT_MAIL as string,
            PASSWORD: process.env.CONTACT_PASSWORD as string,
            TRANSPORT: nodemailer.createTransport({
                host: "smtp.yandex.ru",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.CONTACT_MAIL as string,
                    pass: process.env.CONTACT_PASSWORD as string,
                },
            }),
        },
        BUG: {
            MAIL: process.env.BUG_MAIL as string,
            PASSWORD: process.env.BUG_PASSWORD as string,
            TRANSPORT: nodemailer.createTransport({
                host: "smtp.yandex.ru",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.BUG_MAIL as string,
                    pass: process.env.BUG_PASSWORD as string,
                },
            }),
        },
        ABUSE: {
            MAIL: process.env.ABUSE_MAIL as string,
            PASSWORD: process.env.ABUSE_PASSWORD as string,
            TRANSPORT: nodemailer.createTransport({
                host: "smtp.yandex.ru",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.ABUSE_MAIL as string,
                    pass: process.env.ABUSE_PASSWORD as string,
                },
            }),
        },
    },
};

export default CONFIG;
