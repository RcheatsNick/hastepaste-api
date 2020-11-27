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
    export interface CreatedPaste {
        id: string;
        owner?: string;
    }
    export interface GetPaste {
        paste: string;
        owner?: string;
        title: string;
        createdAt: number;
        fork_id?: string;
        is_reported?: boolean;
    }
    export interface ForkPaste {
        id: string;
        fork_id: string;
    }
    export type PersonalPaste = {
        id: string;
        title: string;
        fork_id?: string;
        createdAt: number;
        is_reported?: boolean;
    }[];
    export type BanListResult = { id: string; reason: string; mail: string }[];
    export type ReportListResult = {
        id: string;
        owner?: string;
        content: string;
        fork_id?: string;
        title: string;
    }[];
}
