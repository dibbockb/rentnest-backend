export const appError = (message: string, statusCode: number) => {
    const error: any = new Error(message);
    error.statusCode = statusCode;
    return error;
};