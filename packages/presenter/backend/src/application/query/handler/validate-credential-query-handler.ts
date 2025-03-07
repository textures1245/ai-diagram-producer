import { NotFoundException, type IQueryHandler } from "@ai-ctx/core";
import { ValidateCredentialQuery } from "../definition/validate-credential-query";
import { TYPES } from "../../../types";
import { inject } from "inversify";
import type { Client } from "cassandra-driver";
import bcrypt from "bcryptjs";
import type { UserResponse } from "../definition/user-response";

export class ValidateCredentialQueryHandler
  implements IQueryHandler<ValidateCredentialQuery, UserResponse>
{
  queryToHandler = ValidateCredentialQuery.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client
  ) {}

  async execute(query: ValidateCredentialQuery): Promise<UserResponse> {
    const csql = `SELECT guid, password FROM users WHERE email = ?`;

    const [result] = await this._cassandraCli.execute(csql, [query.email]);
    if (!result) {
      throw new NotFoundException("User not found");
    }
    const user = {
      email: query.email,
      id: result["guid"] as string,
    };

    const ok = await bcrypt.compare(query.password, result["password"]);
    if (!ok) {
      throw new Error("User found, but invalid password");
    }
    return user;
  }
}
