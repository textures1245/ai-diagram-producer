<script lang="ts">
  import Chatbox from "$lib/route-components/core/Chatbox.svelte";
  import Navbar from "$lib/layout-components/Navbar.svelte";
  import { workspacesHistories } from "$lib/mock/data";

  const contents = {
    username: "textures1246",
    workspaceHistories: workspacesHistories,
  };
</script>

<div id="container" class="bg-muted/30">
  <main class="flex flex-col">
    <header>
      <Navbar {contents} />
      <hr class="bg-black text-black w-full" />
    </header>
    <div class="h-96">
      <Chatbox />
    </div>
  </main>
  <footer class=""></footer>
</div>
