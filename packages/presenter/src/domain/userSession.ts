import { nanoid } from "nanoid";

export class UserSession {
  protected _id: string;
  private email: string;
  private username?: string;

  constructor(email: string, id: string = nanoid(), username?: string) {
    this._id = id;
    this.email = email;
    this.username = username;
  }

  get id(): string {
    return this._id;
  }

  get getUsername(): string {
    return this.username ?? this.email?.split("@")[0] ?? "";
  }
}
