import { Chat } from "./chat";
import { UserSession } from "./userSession";

export class Workspace extends UserSession {
  protected _id: string;
  public chats: Chat[];

  constructor(userId: string, id: string, chats: Chat[] = []) {
    super(userId);
    this._id = id;
    this.chats = chats;
  }

  public getWorkspaceName = (): string => {
    return `Workspace ${
      this.chats[0].message.length > 15
        ? this.chats[0].message.slice(0, 15) + "..."
        : this.chats[0].message
    }`;
  };
}
