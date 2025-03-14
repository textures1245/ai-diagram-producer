import { MessageResponse } from "$service/messaging/response-processor";

export class ServerError extends Error {
  public readonly httpCode: number;
  public readonly statusCode: string;
  constructor(httpCode: number, statusCode: string, message: string) {
    super(message);
    this.httpCode = httpCode;
    this.statusCode = statusCode;
  }
}

export const createMsgError = (msg: string): MessageResponse<void> => ({
  error: msg,
  success: false,
});
