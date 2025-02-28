import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "wxt";
import tsconfigPaths from "vite-tsconfig-paths";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  alias: {
    $lib: resolve(__dirname, "./src/lib"),
    "@backend": resolve(__dirname, "./src/backend"),
    "@ai-ctx/core": resolve(__dirname, "../core/src/index.ts"),
  },

  vite: () => ({
    plugins: [
      tailwindcss(),
      tsconfigPaths(), // Add this plugin
    ],
    resolve: {
      alias: {
        $lib: resolve(__dirname, "./src/lib"),
        "@backend": resolve(__dirname, "./src/backend"),
        "@ai-ctx/core": resolve(__dirname, "../core/src/index.ts"),
      },
    },
    optimizeDeps: {
      include: ["@ai-ctx/core"],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  }),
});
