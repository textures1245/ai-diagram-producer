import type { IQueryHandler } from "@ai-ctx/core";
import { ValidateCredentialQuery } from "../definition/validate-credential-query";
import { TYPES } from "../../../types";
import { inject } from "inversify";
import type { Client } from "cassandra-driver";
import bcrypt from "bcrypt";
import type { UserResponse } from "../definition/user-response";

export class GetUserPasswordQueryHandler
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
      throw new Error("User not found");
    }
    const user = {
      email: query.email,
      id: result["guid"] as string,
      password: result["password"] as string,
    };

    try {
      const ok = await bcrypt.compare(query.password, user.password);
      if (!ok) {
        throw new Error("Invalid password");
      }
      return user;
    } catch (e) {
      throw new Error("Error while comparing passwords");
    }
  }
}
