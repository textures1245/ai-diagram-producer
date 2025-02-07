export const ok = (msg: string, data: any) => {
  return {
    message: msg || "SUCCESS",
    status: "200",
    data,
  };
};
