<svelte:options runes={true} />

<script lang="ts">
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import { AuthMessagingMethods } from "$service/messaging/auth-message.interface";
  import { Button } from "../../components/ui/button";
  import { Input } from "../../components/ui/input";
  import { Label } from "../../components/ui/label";
  import msg from "@/entrypoints/messaging";
  // import { AppError } from "@/service/lib/apperror";

  let errorMessage = $state("");
  let isLoading = $state(false);
  let formData = $state({ email: "", password: "" });
  let mode: "LOGIN" | "REGISTER" = $state("LOGIN");

  $effect(() => {
    console.log("Mode changed to:", mode);
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;
    errorMessage = "";
    try {
      console.log("Form data:", $state.snapshot(formData));
      const result = await msg.sendMessage(
        AuthMessagingMethods.authenticateUser,
        $state.snapshot(formData) // Pass a snapshot of formData to the sendMessage function for immutability
      ); // Pass formData to the sendMessage function
      if (!result.success) {
        console.error("Error:", result.error);
        errorMessage = result.error || "Authentication failed";

        return;
      }
      console.info("User authenticated successfully");
    } catch (error) {
      console.error(error);
      errorMessage = (error as any).message || "An unexpected error occurred";
    } finally {
      isLoading = false;
    }
  }
</script>

<form method="POST" class="space-y-2" onsubmit={handleSubmit}>
  <!-- Email Field -->
  <div class="grid w-full text-sm max-w-sm items-center gap-1.5 my-2 gap-y-2">
    <div>
      <Label class="text-sm " for="email"
        ><span class="text-xs">Email</span></Label
      >
      <Input
        size={4}
        type="email"
        name="email"
        class="text-xs"
        bind:value={formData.email}
        required
        disabled={isLoading}
      />
    </div>
    <!-- Password Field -->
    <div>
      <Label class="text-sm" for="password"
        ><span class="text-xs">Password</span></Label
      >
      <Input
        class="text-xs"
        type="password"
        name="password"
        bind:value={formData.password}
        required
        disabled={isLoading}
      />
      <small class="text-muted-foreground">Include one special character</small>
    </div>
  </div>

  {#if errorMessage}
    <div class="text-red-500 text-xs mb-2">{errorMessage}</div>
  {/if}

  <Button
    size="sm"
    class="w-full cursor-pointer text-xs"
    type="submit"
    disabled={isLoading}
  >
    {isLoading
      ? "Authenticating..."
      : mode === "LOGIN"
        ? "Continue with email"
        : "Register"}
  </Button>

  {#if mode === "LOGIN"}
    <p class=" text-secondary-foreground text-xs">
      Don't have an account?
      <Badge
        class="text-xs text-blue-500 cursor-pointer"
        variant="secondary"
        onclick={() => (mode = "REGISTER")}>Register</Badge
      >
    </p>
  {:else}
    <p class=" text-secondary-foreground text-xs">
      Already have an account?
      <Badge
        class="text-xs text-blue-500  cursor-pointer"
        variant="secondary"
        onclick={() => (mode = "LOGIN")}>Login</Badge
      >
    </p>
  {/if}
</form>
