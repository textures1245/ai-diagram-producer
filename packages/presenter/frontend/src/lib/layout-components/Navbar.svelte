<script lang="ts">
  import Collapsible from "./Collapsible.svelte";
  import type { Workspace } from "@/domain/workspace";

  let {
    contents,
  }: { contents: { username: string; workspaceHistories: Workspace[] } } =
    $props();
</script>

<div class="grid grid-cols-6 w-full place-items-center items-center gap-4 px-4 py-4">
  <div id="avatar-container" class="col-span-1">
    <img
      class="rounded-full w-6 h-6"
      src="https://t3.ftcdn.net/jpg/03/22/30/46/360_F_322304683_7ysRarFkmy2osfPKTOYQv7qTPofKelfb.jpg"
      alt="@shadcn"
    />
  </div>
  <div class="col-span-5" id="menu-container">
    <Collapsible {contents} />
  </div>
</div>
