import { Workspace } from "./workspace";

type ChatRole = "USER" | "ASSISTANT";

export class Chat extends Workspace {
  protected _id: string;
  public message: string;
  public role: ChatRole;
  public images?: string;
  public toolCalls?: string;

  constructor(
    userId: string,
    workspaceId: string,
    id: string,
    message: string,
    role: ChatRole,
    images?: string,
    toolCalls?: string
  ) {
    super(workspaceId, userId);
    this._id = id;
    this.message = message;
    this.role = role;
    this.images = images;
    this.toolCalls = toolCalls;
  }

  static mockData(role: ChatRole): Chat {
    return new Chat("123", "workspace-id", "123", "Hello", role, "", "");
  }
}
