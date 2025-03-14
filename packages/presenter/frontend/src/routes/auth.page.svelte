<script module lang="ts">
  import { AuthMessagingMethods } from "$service/messaging/auth-message.interface";
  import {  z } from "zod";
  export const formSchema = z.object({
    email: z.string().min(2).max(50).email(),
    password: z
      .string()
      .min(8)
      .max(50)
      .refine((value) => /[!@#$]/.test(value), {
        message:
          "Password must contain at least one special character: !, @, #, $, etc.",
      }),
  });

  export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
  import Banner from "../lib/route-components/auth/Banner.svelte";
  import AuthForm from "../lib/route-components/auth/AuthForm.svelte";
  import GoogleAuthButton from "../lib/route-components/auth/GoogleAuthButton.svelte";
  import { config } from "$config";
  import msg from "$entrypoints/messaging";
  import { push } from "svelte-spa-router";
  import { guard } from "$lib/guard";

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
      const url = new URL(authResult!);
      const params = new URLSearchParams(url.hash.substring(1));
      const idToken = params.get("id_token") || params.get("access_token");

      if (!idToken) {
        throw new Error("No token received from Google");
      }

      // Send to background script
      const result = await msg.sendMessage(AuthMessagingMethods.googleSignIn, {
        idToken,
      });

      if (!result.success) {
        errorMessage = "Authentication failed, please try again";
      } else {
        await push("/chat");
      }
    } catch (error: unknown) {
      errorMessage = (error as Error).message || "Google authentication failed";
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    let auth = await guard()
    console.log(auth)
    if (auth) push('/workspace')
  })
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<main
  class="flex flex-col items-center min-h-screen bg-muted/30 font-['Inter']"
>
  <header class="mx-0 my-4 text-xl text-slate">Diagram Generator</header>
  <hr class="bg-black text-black w-full" />

  <Banner>
    <div slot="content">
      <div
        class="py-6 px-8 bg-background border border-solid border-opacity-30 rounded-md shadow-sm"
      >
        <GoogleAuthButton {handleGoogleSignIn} {isLoading} {errorMessage} />

        <div
          class="mx-0 mt-2 -mb-2 text-[0.85em] text-center uppercase text-stone-600"
        >
          or
        </div>
        <hr />

        <!-- <AuthForm /> -->
      </div>
    </div>
  </Banner>

  <footer class="my-4">
    <p class="text-[0.90em] text-center text-stone-500">
      &copy; 2025 textures1245. All rights reserved.
    </p>
  </footer>
</main>
