<script lang="ts">
  import { guard } from "$lib/guard";
  import Chatbox from "$lib/route-components/core/Chatbox.svelte";
  import Navbar from "$lib/layout-components/Navbar.svelte";
  import { Chat } from "$domain/chat";
  import { get } from "svelte/store";
  import { workspaceStore } from "$service/store/workspaceStore";
  import { UserSession } from "$domain/userSession";
  import { authStore } from "$service/store/authStore";
  import msg from "$entrypoints/messaging";
  import { ChatMessagingMethods } from "$service/messaging/chat-message.interface";
  import { Workspace } from "$domain/workspace";

  let contents = $state({
    username: "textures1246",
    workspaceHistories: [] as Workspace[],
  });

  let { params } = $props();

  let user: UserSession | null = $state<UserSession | null>(null);
  let wks = $state(
    get(workspaceStore).workspaces.find(
      (wksId) => wksId.id === params["workspace_id"]
    )
  );
  let chats: Chat[] = $state<Chat[]>([]);
  let errMsg = $state("");

  const unSubOnWks = workspaceStore.subscribe((state) => {
    contents.workspaceHistories = state.workspaces;
    wks = state.workspaces.find((wksId) => wksId.id === params["workspace_id"]);
    if (wks && wks.chats) {
      chats = wks.chats;
    }
  });

  onMount(async () => {
    await guard("/");
    user = get(authStore).user;

    console.log($state.snapshot(wks));
    console.log(
      "workspace store all, fetch on id ",
      get(workspaceStore).workspaces,
      get(workspaceStore).workspaces.find((wks) => {
        // console.log("workspace Id:", wks);
        return wks.id === params["workspace_id"];
      })?.id
    );

    if (!wks || wks?.chats.length === 0) {
      const res = await msg.sendMessage(ChatMessagingMethods.getChats, {
        userId: user.id,
        wksId: params["workspace_id"],
      });

      if (res.success) {
        workspaceStore.setChatsToWorkspaceId(params["workspace_id"], res.data!);

        wks = get(workspaceStore).workspaces.find(
          (wksId) => wksId.id === params["workspace_id"]
        );

        if (!wks || !wks.chats) {
          errMsg = "No chats found for this workspace.";
          return;
        }
        chats = wks.chats;
      } else {
        errMsg = "Failed to retrieve workspace histories.";
      }
    }
  });

  onDestroy(() => unSubOnWks());

  $effect(() => {
    if (errMsg) {
      setTimeout(() => {
        errMsg = "";
      }, 5000);
    }
  });
</script>

<div id="container" class="bg-muted/30">
  <main class="flex flex-col">
    {#if errMsg}
      <span class="text-center text-xs text-destructive">{errMsg}</span>
    {/if}
    <header>
      <Navbar {contents} />
      <hr class="bg-black text-black w-full" />
    </header>
    <div class="h-96">
      <Chatbox bind:chats user={user!} wksId={params["workspace_id"]} />
    </div>
  </main>
  <footer class=""></footer>
</div>
