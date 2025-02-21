<script module lang="ts">
  import { z } from "zod";
  export const formSchema = z.object({
    email: z.string().min(2).max(50).email(),
    password: z.string().min(8).max(50).includes("!@#$"),
  });

  export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
  import Banner from "./route-components/auth/Banner.svelte";
  import AuthForm from "./route-components/auth/AuthForm.svelte";
  import GoogleAuthButton from "./route-components/auth/GoogleAuthButton.svelte";

  function handleGoogleLogin() {
    // Handle Google login
    console.log("Google login clicked");
  }
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<main
  class="flex flex-col items-center min-h-screen  bg-muted/30 font-['Inter']"
>
  <header class="mx-0 my-4 text-xl text-slate">Diagram Generator</header>
  <hr class="bg-black text-black w-full" />

  <Banner>
    <div slot="content">
      <div
        class="p-8 w-full bg-background border border-solid border-opacity-30 rounded-md shadow-sm max-md:p-6 max-sm:p-5"
      >
        <GoogleAuthButton on:click={handleGoogleLogin} />

        <div class="mx-0 mt-2 -mb-2 text-[0.85em] text-center uppercase text-stone-600">
          or
        </div>
        <hr>

        <AuthForm />
      </div>
    </div>
  </Banner>

  <footer class="my-4">
    <p class="text-[0.90em] text-center text-stone-500">
      &copy; 2025 textures1245. All rights reserved.
    </p>
  </footer>
</main>
