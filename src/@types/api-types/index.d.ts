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
}
