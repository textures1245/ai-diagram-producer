<script lang="ts">
  import Chatbox from "./../../../../node_modules/@ai-ctx/presenter/src/lib/route-components/core/Chatbox.svelte";
  import Navbar from "./layout-components/Navbar.svelte";
  import { workspacesHistories } from "./mock/data";

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
