import { Workspace, WorkspaceDTO } from "./workspace";

export type ChatRole = "USER" | "ASSISTANT";

export interface IChat {
  id: string;
  version: number;
  content: string;
  role: ChatRole;
  created_at: string;
  updated_at: string;
  images?: string[];
  toolCalls?: string[];
}

export type ChatDTO = IChat & {
  userId: string;
  workspaceId: string;
};

export class Chat implements IChat {
  private readonly _chatId: string;
  private _version: number;
  public readonly created_at: string;
  public updated_at: string;
  public content: string;
  public role: ChatRole;
  public images?: string[];
  public toolCalls?: string[];

  constructor(
    id: string,
    content: string,
    role: ChatRole,
    version: number,
    createdAt: string,
    updatedAt: string,
    images?: string[],
    toolCalls?: string[]
  ) {
    this._chatId = id;
    this._version = version;
    this.content = content;
    this.role = role;
    this.images = images || [];
    this.toolCalls = toolCalls || [];
    this.created_at = createdAt;
    this.updated_at = updatedAt;
  }

  static mockData(role: ChatRole): Chat {
    return new Chat(
      "123",
      "Hello",
      role,
      -1,
      new Date().toISOString(),
      new Date().toISOString()
    );
  }

  static fromChatDTO(data: Partial<ChatDTO>): Chat {
    return new Chat(
      data.id || "default-id",
      data.content || "default content",
      data.role || "USER",
      data.version || 0,
      data.created_at || new Date().toISOString(),
      data.updated_at || new Date().toISOString(),
      data.images || [],
      data.toolCalls || []
    );
  }

  public updateVersion(): number {
    this._version++;
    this.updated_at = new Date().toISOString();
    return this._version;
  }

  get createdAt(): Date {
    return new Date(this.created_at);
  }

  get updatedAt(): Date {
    return new Date(this.updated_at);
  }

  get id(): string {
    return this._chatId;
  }

  get version(): number {
    return this._version;
  }
}
