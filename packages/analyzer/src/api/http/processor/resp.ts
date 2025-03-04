export const ok = (msg: string, data: any, status: string = "200") => {
  return {
    message: msg || "SUCCESS",
    status,
    data,
  };
};
