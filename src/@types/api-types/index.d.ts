declare module "api-types" {
    export interface APIRes<T> {
        statusCode: number;
        message: string | string[];
        data: T;
        error?: string;
    }
    export interface AccessTokenData {
        access_token: string;
        expiresIn: number;
    }
    export interface PatchResult {
        id: string;
        mail?: string;
        password?: string;
    }
    export interface IUser {
        mail: string;
        id: string;
        is_admin: boolean;
        is_banned: boolean;
        mail_verified: boolean;
    }
    export interface VerificationResult {
        verified: boolean;
    }
    export type BanListResult = { id: string; reason: string; mail: string }[];
}
