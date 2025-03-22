<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Collapsible from "$lib/components/ui/collapsible";
  import Icon from "@iconify/svelte";

  import type { Workspace } from "@/domain/workspace";

  let {
    contents,
  }: { contents: { username: string; workspaceHistories: Workspace[] } } =
    $props();
</script>

<Collapsible.Root class="w-fit space-y-1">
  <div class="flex items-center justify-between gap-2">
    <slot name="username">
      <h4 class="text-xs font-semibold">{contents.username}'s workspaces</h4>
    </slot>
    <Collapsible.Trigger asChild let:builder>
      <Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
        <Icon class="text-base" icon="mdi-light:menu" />
        <span class="sr-only">Toggle</span>
      </Button>
    </Collapsible.Trigger>
  </div>
  {#if contents.workspaceHistories.length > 0}
    <div class="rounded-md border px-3 py-2 font-mono text-xs">
      {contents.workspaceHistories[0].title}
    </div>
  {/if}
  <Collapsible.Content
    class="space-y-1 break-words transition-all overflow-auto max-h-32"
  >
    {#each contents.workspaceHistories.slice(1) as ws}
      <a href={`#workspace/${ws.id}`}>
        <div class="rounded-md border px-3 py-2 font-mono text-xs">
          {ws.title}
        </div>
      </a>
    {:else}
      <span class="text-secondary-foreground text-xs">
        You have no other workspaces, try creating one!</span
      >
    {/each}
  </Collapsible.Content>
</Collapsible.Root>
