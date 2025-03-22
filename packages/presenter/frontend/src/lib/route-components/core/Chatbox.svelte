<script lang="ts">
  import { Button } from "../../components/ui/button";
  import * as Card from "../../components/ui/card/index";
  import { Input } from "../../components/ui/input";
  import { Chat } from "../../../domain/chat";
  import msg from "$entrypoints/messaging";
  import { WorkspaceMessagingMethods } from "$service/messaging/workspace-message.interface";
  import { UserSession } from "$domain/userSession";
  import { ChatMessagingMethods } from "$service/messaging/chat-message.interface";
  import { push } from "svelte-spa-router";
  import { workspaceStore } from "$service/store/workspaceStore";
  import { get } from "svelte/store";

  let {
    chats = $bindable(),
    user,
    wksId,
  }: { chats: Chat[]; user: UserSession; wksId: string | undefined } = $props();
  let message = $state("");
  let errMsg = $state("");

  async function sendMessage() {
    console.log(wksId);
    // creating workspace init first chat
    if (!wksId) {
      const res = await msg.sendMessage(
        WorkspaceMessagingMethods.initWksSession,
        {
          userId: user.id,
          wks: {
            title:
              message.trim().length > 20
                ? message.trim().slice(0, 20) + "..."
                : message.trim(),
          },
          chat: {
            content: message.trim(),
            role: "USER",
            images: [],
            toolCalls: [],
          },
        }
      );

      if (!res.error) {
        workspaceStore.addWorkspace(
          {
            id: res.data?.workspaceId,
            title:
              message.trim().length > 20
                ? message.trim().slice(0, 20) + "..."
                : message.trim(),
          },
          {
            id: res.data?.chatId,
            userId: user.id,
            workspaceId: res.data?.workspaceId,
            content: message.trim(),
            role: "USER",
            images: [],
            toolCalls: [],
          }
        );

        console.log("res after init works", res);
        console.log(
          "workspace store all, fetch on id ",
          get(workspaceStore).workspaces,
          get(workspaceStore).workspaces.find((wks) => {
            // console.log("workspace Id:", wks, wks.id, )
            return wks.id === res.data!.workspaceId;
          })?.id
        );
        await push(`/workspace/${res.data?.workspaceId}`);
      } else {
        errMsg = res.error;
      }
    } else {
      const res = await msg.sendMessage(ChatMessagingMethods.addNewChat, {
        userId: user.id,
        wksId: wksId, // Updated from params["workspace_id"] to wksId
        chat: {
          content: message.trim(),
          role: "USER",
          images: [],
          toolCalls: [],
        },
      });
      if (!res.error) {
        workspaceStore.addChatToWorkspaceId(wksId, {
          content: message.trim(),
          role: "USER",
          images: [],
          toolCalls: [],
        });
        chats = [
          ...chats,
          Chat.fromChatDTO({
            content: message.trim(),
            role: "USER",
            images: [],
            toolCalls: [],
          }), // Assuming res.data is a ChatDTO
        ];
      } else {
        errMsg = res.error;
      }
    }
  }
</script>

<Card.Root class="flex flex-col relative h-full  shadow-lg">
  <Card.Content class="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
    {#each chats as msg}
      <div
        class={msg.role === "USER" ? "flex justify-end" : "flex justify-start"}
      >
        <div
          class="px-4 py-1.25 rounded-xl max-w-xs break-words {msg.role ===
          'USER'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-800'}"
        >
          {msg.content}
        </div>
      </div>
    {/each}
  </Card.Content>
  <Card.Footer class="border-t  border-gray-200 p-4 bg-white">
    <form
      on:submit|preventDefault={sendMessage}
      class="flex w-full items-center gap-1"
    >
      <Input
        type="text"
        bind:value={message}
        placeholder="Type your message..."
        class="text-xs"
      />
      <Button type="submit" size="sm">Send</Button>
    </form>
  </Card.Footer>
</Card.Root>
