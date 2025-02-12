import { AggregateRoot } from "@ai-ctx/core";
import { ChatRole } from "./role";
import { ChatCreated } from "./event/chat-created";
import { ChatUpdated } from "./event/chat-updated";

export class Chat extends AggregateRoot {
  private content!: string;
  private role: ChatRole = ChatRole.ASSISTANT;
  private images?: string;
  private tool_calls?: string;

  constructor();

  constructor(
    guid: string,
    content: string,
    role: ChatRole,
    images?: string,
    tool_calls?: string
  );

  constructor(
    guid?: string,
    content?: string,
    role?: ChatRole,
    images?: string,
    tool_calls?: string
  ) {
    super(guid);
    if (guid && content && role) {
      this.applyChange(
        new ChatCreated(guid, content, role, images, tool_calls)
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
