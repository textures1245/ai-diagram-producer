import type { IQuery } from "@ai-ctx/core";
export class ValidateCredentialQuery implements IQuery {
  constructor(public email: string, public password: string) {
    this.password = password;
    this.email = email;
  }
}
