export class ServerError extends Error {
  public readonly httpCode: number;
  public readonly statusCode: string;
  constructor(httpCode: number, statusCode: string, message: string) {
    super(message);
    this.httpCode = httpCode;
    this.statusCode = statusCode;
  }
}

export type AppError = {
  message: string;
  success: boolean;
};

export const createAppError = (message: string): AppError => ({
  message,
  success: false,
});
