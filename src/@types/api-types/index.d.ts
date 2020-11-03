declare module "api-types" {
    export interface APIRes<T> {
        statusCode: number;
        message: string | string[];
        data: T;
        error?: string;
    }
}