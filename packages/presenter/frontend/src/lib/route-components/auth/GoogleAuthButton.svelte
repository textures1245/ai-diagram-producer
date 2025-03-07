<script lang="ts">
  import { Button } from "../../components/ui/button";
  import msg from "@/entrypoints/messaging";
  import { AuthMessagingMethods } from "$service/messaging/auth-service.interface";
  import { browser } from "wxt/browser";
  import { config } from "$config/index";

  let isLoading = $state(false);
  let errorMessage = $state("");

  async function handleGoogleSignIn() {
    try {
      isLoading = true;
      errorMessage = "";

      // Use Chrome's identity API
      const authResult = await browser.identity.launchWebAuthFlow({
        url: `https://accounts.google.com/o/oauth2/auth?client_id=${config.key.googleToken}&response_type=token&redirect_uri=${encodeURIComponent(browser.identity.getRedirectURL())}&scope=email%20profile`,
        interactive: true,
      });

      // Extract token from redirect URL
      const url = new URL(authResult);
      const params = new URLSearchParams(url.hash.substring(1));
      const idToken = params.get("id_token") || params.get("access_token");

      console.log("idToken:", idToken)

      if (!idToken) {
        throw new Error("No token received from Google");
      }

      // Send to background script
      const result = await msg.sendMessage(AuthMessagingMethods.googleSignIn, {
        idToken,
      });

      if (!result.success) {
        throw new Error(result.error || "Authentication failed");
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      errorMessage = error.message || "Google authentication failed";
    } finally {
      isLoading = false;
    }
  }
</script>

<Button
  class="text-xs w-full cursor-pointer flex gap-x-2"
  on:click={handleGoogleSignIn}
  disabled={isLoading}
>
  <img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="google-icon" class="w-4">
  {isLoading ? "Signing in..." : "Continue with Google"}
</Button>

{#if errorMessage}
  <p class="text text-xs mt-1 text-red-500">{errorMessage}</p>
{/if}
