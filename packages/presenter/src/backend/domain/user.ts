import { AggregateRoot } from "@ai-ctx/core";
import { UserCreated } from "./event/user-created";
import { UserUpdated } from "./event/user-updated";
import { UserPasswordUpdated } from "./event/user-password-updated";
export class User extends AggregateRoot {
  private email!: string;
  private password!: string;
  private updated_at?: Date;
  private created_at?: Date;

  constructor();

  constructor(
    guid: string,
    email: string,
    password: string,
    updated_at?: Date,
    created_at?: Date
  );

  constructor(guid?: string, email?: string, password?: string) {
    super(guid);

    if (guid && email && password) {
      this.created_at = new Date();
      this.updated_at = new Date();
      this.applyChange(
        new UserCreated(guid, email, password, this.created_at, this.updated_at)
      );
    }
  }

  updateInfo(email: string, password: string, updated_at?: Date): void {
    if (!updated_at) {
      updated_at = new Date();
    }
    this.applyChange(new UserUpdated(this.guid, email, password, updated_at));
  }

  updatePassword(password: string, updated_at?: Date): void {
    if (!updated_at) {
      updated_at = new Date();
    }
    this.applyChange(new UserPasswordUpdated(this.guid, password, updated_at));
  }

  applyUserCreated(event: UserCreated): void {
    this.guid = event.guid;
    this.email = event.email;
    this.password = event.password;
    this.created_at = event.created_at;
    this.updated_at = event.updated_at;
  }

  applyUserUpdated(event: UserUpdated): void {
    this.email = event.email;
    this.password = event.password;
    this.updated_at = event.updated_at;
  }

  applyUserPasswordUpdated(event: UserPasswordUpdated): void {
    this.password = event.password;
    this.updated_at = event.updated_at;
  }
}
