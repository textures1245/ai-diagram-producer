<script lang="ts">
  import { Button } from "../../components/ui/button";
  import { Input } from "../../components/ui/input";
  import { Label } from "../../components/ui/label";
  
  let formData = { email: "", password: "" };
  let isLoading = false;
  let errorMessage = "";

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;
    errorMessage = "";

    // try {
    //   const result = await messaging.authenticateUser({
    //     email: formData.email,
    //     password: formData.password
    //   });

    //   if (!result.success) {
    //     errorMessage = result.error || "Authentication failed";
    //     return;
    //   }

    //   // Handle successful authentication
    //   // For example, store the user data and token in a store
    //   // and redirect to another page
    // } catch (error) {
    //   errorMessage = error.message || "An unexpected error occurred";
    // } finally {
    //   isLoading = false;
    // }
  }
</script>

<form method="POST" on:submit={handleSubmit}>
  <!-- Email Field -->
  <div class="grid text-sm w-full max-w-sm items-center gap-1.5 my-2 gap-y-2">
    <div>
      <Label class="text-sm" for="email"
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
    {isLoading ? 'Authenticating...' : 'Continue with email'}
  </Button>
</form>
