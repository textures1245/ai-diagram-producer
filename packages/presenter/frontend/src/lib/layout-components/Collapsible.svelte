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
        <Icon class="text-base" icon="mdi-light:home" />
        <span class="sr-only">Toggle</span>
      </Button>
    </Collapsible.Trigger>
  </div>
  <div class="rounded-md border px-3 py-2 font-mono text-xs">
    {contents.workspaceHistories[0].getWorkspaceName()}
  </div>
  <Collapsible.Content class="space-y-1  overflow-auto h-32">
    {#each contents.workspaceHistories.slice(1) as ws}
      <div class="rounded-md border px-3 py-2 font-mono text-xs">
        {ws.getWorkspaceName()}
      </div>
    {/each}
  </Collapsible.Content>
</Collapsible.Root>
