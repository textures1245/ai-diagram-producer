<script lang="ts">
  import Collapsible from "./Collapsible.svelte";
  import { Workspace } from "@/domain/workspace";

  export let contents: {
    username: string;
    workspaceHistories: Workspace[];
  };
</script>

<div class="flex w-full items-center justify-between gap-4 px-4 py-4">
  <div id="avatar-container">
    <img
      class="rounded-full w-6 h-6"
      src="https://t3.ftcdn.net/jpg/03/22/30/46/360_F_322304683_7ysRarFkmy2osfPKTOYQv7qTPofKelfb.jpg"
      alt="@shadcn"
    />
  </div>
  <div class="" id="menu-container">
    <Collapsible {contents} />
  </div>
</div>
