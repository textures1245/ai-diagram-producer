<script lang="ts">
  import { Button } from "../../components/ui/button";
  import * as Card from "../../components/ui/card/index";
  import { Input } from "../../components/ui/input";
  import { Chat } from "../../../domain/chat";

  let chats: Chat[] = [];
  let message = "";

  function sendMessage() {
    if (message.trim() !== "") {
      chats = [...chats, Chat.mockData("USER")];
      // Simulate API call with a dummy bot response
      chats = [...chats, Chat.mockData("ASSISTANT")];
      message = "";
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
          {msg.message}
        </div>
      </div>
    {/each}
  </Card.Content>
  <Card.Footer class="border-t border-gray-200 p-4 bg-white">
    <form
      on:submit|preventDefault={sendMessage}
      class="flex items-center gap-1"
    >
      <Input
        type="text"
        bind:value={message}
        placeholder="Type your message..."
        class="text-xs min-w-full"
      />
      <Button type="submit" size="sm">Send</Button>
    </form>
  </Card.Footer>
</Card.Root>
