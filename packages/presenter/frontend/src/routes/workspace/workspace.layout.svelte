<script lang="ts">
  import Chatbox from "$lib/route-components/core/Chatbox.svelte";
  import Navbar from "$lib/layout-components/Navbar.svelte";
  import { Workspace } from "$domain/workspace";
  import { guard } from "$lib/guard";
  import { Chat } from "$domain/chat";
  import msg from "$entrypoints/messaging";
  import { WorkspaceMessagingMethods } from "$service/messaging/workspace-message.interface";
  import { get } from "svelte/store";
  import { workspaceStore } from "$service/store/workspaceStore";
  import { authStore } from "$service/store/authStore";
  import { UserSession } from "$domain/userSession";

  let contents: {
    username: string;
    workspaceHistories: Workspace[];
  } = $state({
    username: get(authStore).user?.getUsername || "",
    workspaceHistories: get(workspaceStore).workspaces,
  });

  let chats: Chat[] = $state<Chat[]>([]);
  let user: UserSession | null = $state<UserSession | null>(null);
  let errorMsg = $state("");

  const unSubOnWks = workspaceStore.subscribe((state) => {
    contents.workspaceHistories = state.workspaces;
  });

  onMount(async () => {
    await guard("/");

    user = get(authStore).user;

    if (!user) {
      console.error("User not found");
      return;
    }

    if (contents.workspaceHistories.length === 0) {
      const res = await msg.sendMessage(WorkspaceMessagingMethods.getWkses, {
        userId: user.id,
      });
      if (res.success) {
        workspaceStore.setWorkspaces(res.data!);
        contents = {
          ...contents,
          workspaceHistories: get(workspaceStore).workspaces,
        };
        console.log(
          "Workspace histories retrieved successfully:",
          contents.workspaceHistories
        );
      } else {
        errorMsg = "Failed to retrieve workspace histories.";
      }
    }
  });

  onDestroy(() => unSubOnWks());
</script>

<div id="container" class="bg-muted/30">
  <main class="flex flex-col">
    <header>
      <Navbar {contents} />
      <hr class="bg-black text-black w-full" />
    </header>
    <div class="h-96">
      <Chatbox bind:chats user={user!} wksId={undefined} />
    </div>
  </main>
  <footer class=""></footer>
</div>
