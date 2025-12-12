export class CustomError extends Error {
    statusCode: number;
    data?: unknown;

    constructor(message: string, statusCode = 500, data?: unknown) {
        super(message);
        this.name = "CustomError";
        this.statusCode = statusCode;
        this.data = data;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }
}
