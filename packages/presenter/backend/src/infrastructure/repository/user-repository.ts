import { EventSourcedRepository, type IEventStore } from "@ai-ctx/core";
import { User } from "../../domain/user";
import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../domain/user-repository.interface";
import { TYPES } from "../../types";

@injectable()
export class UserRepository
  extends EventSourcedRepository<User>
  implements IUserRepository
{
  constructor(
    @inject(TYPES.UserEventStore) private readonly eventStore: IEventStore
  ) {
    super(eventStore, User);
  }
  async findUserByEmail(email: string): Promise<User> {
    const [user] = await this.getManyByDynamicQuery("email", email);
    return user;
  }
}
