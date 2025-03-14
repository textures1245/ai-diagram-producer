import { get } from "svelte/store";
import { Chat, IChat } from "./chat";
import { UserSession } from "./userSession";

interface IWorkspace {
  id: string;
  title: string;
  created_at: string;
  chats: Chat[];
}

export type WorkspaceDTO = IWorkspace & {
  userId: string;
};

export class Workspace extends UserSession implements IWorkspace {
  private readonly _wksId: string;
  public readonly created_at: string;
  public title: string;
  public chats: Chat[];

  constructor(userId: string, id: string, title: string, created_at: string, chats: Chat[] = []) {
    super(userId);
    this._wksId = id;
    this.title = title;
    this.chats = chats;
    this.created_at = created_at;
  }

  get id(): string {
    return this._wksId;
  }

  static fromWorkspaceJSON(data: WorkspaceDTO): Workspace {
    return new Workspace(data.userId, data.id, data.title, data.created_at, []);
  }
}
