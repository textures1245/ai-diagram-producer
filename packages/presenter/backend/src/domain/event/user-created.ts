import { Event } from "@ai-ctx/core";

export class UserCreated extends Event {
  type = UserCreated.name;
  aggregateName: string = "user";

  constructor(
    public guid: string,
    public email: string,
    public password: string,
    public created_at: Date,
    public updated_at: Date,
  ) {
    super(guid);
  }
}
