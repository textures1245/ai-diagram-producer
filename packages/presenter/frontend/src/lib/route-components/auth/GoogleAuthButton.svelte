<script lang="ts">
  import { Button } from "../../components/ui/button";

  let { handleGoogleSignIn, isLoading, errorMessage } = $props();
</script>

<Button
  class="text-xs w-full cursor-pointer flex gap-x-2"
  onclick={handleGoogleSignIn}
  disabled={isLoading}
>
  <img
    src="https://img.icons8.com/?size=512&id=17949&format=png"
    alt="google-icon"
    class="w-4"
  />
  {isLoading ? "Signing in..." : "Continue with Google"}
</Button>

{#if errorMessage}
  <p class="text text-xs mt-1 text-red-500">{errorMessage}</p>
{/if}
