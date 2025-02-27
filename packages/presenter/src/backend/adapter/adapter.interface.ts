export interface IAdapterController {
  validateCredentials<T = any, R = any>(req: T, res?: R): Promise<any>;
  createUser<T = any, R = any>(req: T, res?: R): Promise<any>;
  updateUserPassword<T = any, R = any>(req: T, res?: R): Promise<any>;
}
