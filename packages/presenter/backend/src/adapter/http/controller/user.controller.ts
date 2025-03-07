import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestBody,
  requestParam,
  response,
} from "inversify-express-utils";
import { TYPES } from "../../../types";
import type { ICommandBus, IQueryBus } from "@ai-ctx/core";
import type { Logger } from "pino";
import type { Response } from "express";
import { CreateUserCommand } from "../../../application/commands/definition/create-user";
import { UpdateUserPasswordCommand } from "../../../application/commands/definition/update-user-password";
import { ValidateCredentialQuery } from "../../../application/query/definition/validate-credential-query";
import { GetUserByIdQuery } from "../../../application/query/definition/get-user-by-id-query";
import { ok } from "../processor/resp";
import { GetAllUsersQuery } from "@src/application/query/definition/get-all-users-query";

interface CreateUserRequest {
  email: string;
  password: string;
}

interface UpdatePasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
  version: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

@controller("/api/v1/user")
export class UserHttpController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly queryBus: IQueryBus,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  @httpGet("/")
  async getAllUsers(@request() _: Request, @response() res: Response) {
    const users = await this.queryBus.execute(new GetAllUsersQuery());

    return res.json(ok("Users fetched successfully", users));
  }

  @httpGet("/:userId")
  async getUser(
    @requestParam("userId") userId: string,
    @response() res: Response
  ) {
    const user = await this.queryBus.execute(new GetUserByIdQuery(userId));

    return res.json(ok("User fetched successfully", user));
  }

  @httpPost("/")
  async createUser(
    @requestBody() req: CreateUserRequest,
    @response() res: Response
  ) {
    const { email, password } = req;

    const user = await this.commandBus.send(
      new CreateUserCommand(email, password)
    );

    this.logger.info(`User created with email: ${email}`);
    return res.json(ok("User created successfully", user, "201"));
  }

  @httpPut("/password")
  async updatePassword(
    @requestBody() req: UpdatePasswordRequest,
    @response() res: Response
  ) {
    const { email, currentPassword, newPassword, version } = req;

    await this.queryBus.execute(
      new ValidateCredentialQuery(email, currentPassword)
    );

    await this.commandBus.send(
      new UpdateUserPasswordCommand(email, newPassword, version)
    );

    this.logger.info(`Password updated for user with email: ${email}`);
    return res.json(ok("Password updated successfully"));
  }

  @httpPost("/validate-credential")
  async validateCredential(
    @requestBody() req: LoginRequest,
    @response() res: Response
  ) {
    const { email, password } = req;

    const user = await this.queryBus.execute(
      new ValidateCredentialQuery(email, password)
    );

    this.logger.info(`User credentials validated for: ${email}`);
    return res.json(ok("Credentials validated successfully", user));
  }
}
