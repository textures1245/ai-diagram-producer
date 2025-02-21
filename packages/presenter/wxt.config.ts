import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  alias: {
    $lib: "./src/lib",
  },

  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $lib: "./src/lib",
      },
    },
    build: {
      target: "esnext",
    },
  }),
});
