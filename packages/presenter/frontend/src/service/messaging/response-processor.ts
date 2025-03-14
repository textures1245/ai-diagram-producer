export type MessageResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const createMsgSuccess = <T>(data?: T): MessageResponse<T> => ({
  data: data,
  success: true,
});
  