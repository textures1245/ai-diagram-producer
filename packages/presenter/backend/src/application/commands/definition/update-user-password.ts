import { Command } from "@ai-ctx/core";

export class UpdateUserPasswordCommand extends Command {
  public email: string;
  public password: string;
  public readonly originalVersion: number;

  constructor(email: string, password: string, originalVersion: number, guid?: string) {
    super(guid);
    this.email = email;
    this.password = password;
    this.originalVersion = originalVersion;
  }
}
