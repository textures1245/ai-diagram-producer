<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  import { Label } from "$lib/components/ui/label";

  // Removed unused imports from $lib

  let formData = { email: "", password: "" };

  function handleSubmit(e: Event) {
    e.preventDefault();
    // ...existing code for submission...
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
      />
      <small class="text-muted-foreground">Include one special character</small>
    </div>
  </div>
  <Button size="sm" class="w-full cursor-pointer text-xs" type="submit"
    >Continue with email</Button
  >
  <!-- ...existing code if any... -->
</form>
