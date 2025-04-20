export type ApiResponse<T> = {
    data: {
        success: boolean;
        message: string;
        statusCode: number;
        responseObject: T;
    }
    success: boolean;
}