import type { IRepository } from "@ai-ctx/core";
import type { User } from "./user";

export interface IUserRepository extends IRepository<User> {
  findUserByEmail(email: string): Promise<User | null>;
}
