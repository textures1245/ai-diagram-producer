<script lang="ts">
  import { Router } from "svelte-router-spa";
  import { routes } from "./router";
</script>

<main class="w-90 h-full">
  <Router {routes} />
</main>

<style>
</style>
