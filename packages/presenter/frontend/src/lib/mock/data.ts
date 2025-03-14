import { Chat } from "@/domain/chat";
import { Workspace } from "@/domain/workspace";

// Updated: more mock data using numeric IDs converted to strings.
export const workspacesHistories: Workspace[] = [
  new Workspace("1", "1", [
    new Chat("11", "1", "1", "Hello from workspace 1, chat 1", "USER", -1),
    new Chat("12", "1", "1", "Assistant response in workspace 1", "ASSISTANT", -1),
  ]),
  // ...existing mock data for workspaces 2-10...
  new Workspace("10", "10", [
    new Chat("101", "10", "10", "Hello from workspace 10, chat 1", "USER", -1),
    new Chat("102", "10", "10", "Assistant response in workspace 10", "ASSISTANT", -1),
  ]),
  // Additional mock data:
  new Workspace("11", "11", [
    new Chat("111", "11", "11", "Hello from workspace 11, chat 1", "USER", -1),
    new Chat("112", "11", "11", "Assistant response in workspace 11", "ASSISTANT", -1),
  ]),
  new Workspace("12", "12", [
    new Chat("121", "12", "12", "Hello from workspace 12, chat 1", "USER", -1),
    new Chat("122", "12", "12", "Assistant response in workspace 12", "ASSISTANT", -1),
  ]),
  new Workspace("13", "13", [
    new Chat("131", "13", "13", "Hello from workspace 13, chat 1", "USER", -1),
    new Chat("132", "13", "13", "Assistant response in workspace 13", "ASSISTANT", -1),
  ]),
  new Workspace("14", "14", [
    new Chat("141", "14", "14", "Hello from workspace 14, chat 1", "USER", -1),
    new Chat("142", "14", "14", "Assistant response in workspace 14", "ASSISTANT", -1),
  ]),
  new Workspace("15", "15", [
    new Chat("151", "15", "15", "Hello from workspace 15, chat 1", "USER", -1),
    new Chat("152", "15", "15", "Assistant response in workspace 15", "ASSISTANT", -1),
  ]),
  // ...add more if needed...
];
