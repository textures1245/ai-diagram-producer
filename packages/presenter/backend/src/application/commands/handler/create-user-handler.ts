import type { ICommandHandler } from "@ai-ctx/core";
import { CreateUserCommand } from "../definition/create-user";
import { TYPES } from "../../../types";
import type { UserRepository } from "../../../infrastructure/repository/user-repository";
import { inject } from "inversify";
import { User } from "../../../domain/user";
import bcrypt from "bcryptjs";

export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  cmdToHandler = CreateUserCommand.name;

  constructor(
    @inject(TYPES.UserRepository) private readonly _repo: UserRepository
  ) {}

  async handle(cmd: CreateUserCommand): Promise<{ guid: string }> {
    const hashedPassword = bcrypt.hashSync(cmd.password, 10);

    const user: User = new User(cmd.guid, cmd.email, hashedPassword);
    await this._repo.save(user, -1);
    return { guid: cmd.guid };
  }
}
