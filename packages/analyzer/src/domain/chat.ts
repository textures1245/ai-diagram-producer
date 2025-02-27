import { AggregateRoot } from "@ai-ctx/core";
import { ChatRole } from "./role";
import { ChatCreated } from "./event/chat-created";
import { ChatUpdated } from "./event/chat-updated";

export class Chat extends AggregateRoot {
  private user_guid!: string;
  private workspace_guid!: string;
  private content!: string;
  private role: ChatRole = ChatRole.ASSISTANT;
  private images?: string;
  private tool_calls?: string;

  constructor();

  constructor(
    guid: string,
    user_guid: string,
    workspace_guid: string,
    content: string,
    role: ChatRole,
    images?: string,
    tool_calls?: string
  );

  constructor(
    guid?: string,
    userGuid?: string,
    workspace_guid?: string,
    content?: string,
    role?: ChatRole,
    images?: string,
    tool_calls?: string
  ) {
    super(guid);
    if (guid && userGuid && workspace_guid && content && role) {
      this.applyChange(
        new ChatCreated(
          guid,
          userGuid,
          workspace_guid,
          content,
          role,
          images,
          tool_calls
        )
      );
    }
  }

  updateInfo(
    content: string,
    role: ChatRole,
    images?: string,
    tool_calls?: string
  ) {
    this.applyChange(
      new ChatUpdated(this.guid, content, role, images, tool_calls)
    );
  }

  applyChatCreated(event: ChatCreated): void {
    this.user_guid = event.user_guid;
    this.workspace_guid = event.workspace_guid;
    this.guid = event.guid;
    this.content = event.content;
    this.role = event.role;
    this.images = event.images;
    this.tool_calls = event.tool_calls;
  }

  applyChatUpdated(event: ChatUpdated): void {
    this.content = event.content;
    this.role = event.role;
    this.images = event.images;
    this.tool_calls = event.tool_calls;
  }
}
