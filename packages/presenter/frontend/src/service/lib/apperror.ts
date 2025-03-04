export type AppError<T = unknown> = {
  message: string;
  success: boolean;
};

export const createAppError = <T = unknown>(message: string): AppError<T> => ({
  message,
  success: false,
});
