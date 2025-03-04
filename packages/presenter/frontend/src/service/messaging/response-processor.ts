export type MessageResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
