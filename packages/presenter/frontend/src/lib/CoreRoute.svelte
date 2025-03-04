<script lang="ts">
  import { workspacesHistories } from "./mock/data";
  import Navbar from "$lib/layout-components/Navbar.svelte";
  import Chatbox from "$lib/route-components/core/Chatbox.svelte";

  let contents = {
    username: "textures1245",
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
