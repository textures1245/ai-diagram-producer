<script lang="ts">
  export const props = {
    className:
      "flex flex-col items-center gap-4 w-full max-w-md max-md:px-5 max-md:py-0 max-md:mt-8",
  };

  export const contents = {
    title: ["Your ideas,", "can tells many stories"],
    subtitle: "Privacy-first AI that helps you create in confidence.",
  };
</script>

<section class={props.className}>
  <h1 class=" text-2xl tracking-tighter text-center text-stone-800 leading-7">
    {#each contents.title as t}
      <span>{t}</span><br />
    {/each}
  </h1>

  <p class=" text-sm tracking-tight leading-7 text-center text-stone-800">
    {contents.subtitle}
  </p>

  <slot name="content">
    <p class="text-center">content goes here...</p>
  </slot>
</section>
