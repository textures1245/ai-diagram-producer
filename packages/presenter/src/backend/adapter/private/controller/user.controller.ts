import { injectable, inject } from "inversify";
import { TYPES } from "../../../types";
import type { ICommandBus, IQueryBus } from "@ai-ctx/core";
import type { Logger } from "pino";
import type { IAdapterController } from "../../adapter.interface";
import { CreateUserCommand } from "../../../application/commands/definition/create-user";

import { UpdateUserPasswordCommand } from "../../../application/commands/definition/update-user-password";
import { ValidateCredentialQuery } from "../../../application/query/definition/validate-credential-query";
import type { UserResponse } from "../../../application/query/definition/user-response";

@injectable()
export class UserPrivateController implements IAdapterController {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  async validateCredentials<T = { email: string; password: string }>(
    req: T
  ): Promise<UserResponse> {
    const { email, password } = req as { email: string; password: string };

    const ok = await this._queryBus.execute(
      new ValidateCredentialQuery(email, password)
    );
    this._logger.info(`Credentials validated for email: ${email}`);
    return ok;
  }

  async createUser<T = { email: string; password: string }>(
    req: T
  ): Promise<any> {
    const { email, password } = req as { email: string; password: string };

    const cmdRes = await this._commandBus.send(
      new CreateUserCommand(email, password)
    );

    this._logger.info(`User created with email: ${email}`);
    return cmdRes;
  }
  async updateUserPassword<
    T = { email: string; password: string; version: number }
  >(req: T): Promise<any> {
    const { email, password, version } = req as {
      email: string;
      password: string;
      version: number;
    };

    const cmdRes = await this._commandBus.send(
      new UpdateUserPasswordCommand(email, password, version)
    );

    this._logger.info(`Password updated for user with email: ${email}`);
    return cmdRes;
  }
}
