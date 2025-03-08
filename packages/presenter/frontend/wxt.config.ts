import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  alias: {
    $lib: resolve(__dirname, "./src/lib"),
    $service: resolve(__dirname, "./src/service"),
    $entrypoints: resolve(__dirname, "./src/entrypoints"),
    $style: resolve(__dirname, "./src/style"),
    $config: resolve(__dirname, "./src/config"),
    $domain: resolve(__dirname, "./src/domain"),
    $assets: resolve(__dirname, "./src/assets"),
  },

  experimental: {
    inspect: true,
    emitDecoratorMetadata: true,
  },

  manifest: () => ({ 
    name: "LLM Diagram Producer",
    version: "0.0.1",
    description: "LLM Diagram Producer",
    permissions: ["storage", "identity"],
    oauth2: {
      client_id:
        import.meta.env.WXT_GOOGLE_TOKEN,
      scopes: ["openid", "email", "profile"],
    },
    hooks: {
      'route:changed': (wxt, manifest) => {
        if (wxt.config.mode === 'development') {
          manifest.title += ' (DEV)';
        }
      },
    },
    // content_security_policy: {
    //   extension_pages: "script-src 'self' 'wasm-unsafe-eval' http://localhost:* http://127.0.0.1:*; object-src 'self';",
    //   sandbox: "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:*; sandbox allow-scripts allow-forms allow-popups allow-modals; child-src 'self';"
    // }
    // host_permissions: ["<all_urls>"],
    // background: {
    //   service_worker: "service_worker.js",
    // },
    // contentScripts: [
    //   {
    //     matches: ["<all_urls>"],
    //     // js: ["content.js"],
    //   },
    // ],
  }),

  vite: () => ({
    plugins: [
      tailwindcss(),
      tsconfigPaths(), // Add this plugin
      nodePolyfills({
        include: ["util", "stream", "tty", "fs", "os"],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],

    resolve: {
      alias: {
        $lib: resolve(__dirname, "./src/lib"),
        $service: resolve(__dirname, "./src/service"),
        $entrypoints: resolve(__dirname, "./src/entrypoints"),
        $style: resolve(__dirname, "./src/style"),
        $config: resolve(__dirname, "./src/config"),
        $domain: resolve(__dirname, "./src/domain"),
        $assets: resolve(__dirname, "./src/assets"),
      },
    },

    build: {
      rollupOptions: {
        external: ["util", "stream", "tty", "fs", "os"],
        output: {
          globals: {
            util: "null",
            stream: "null",
            tty: "{ isatty: () => false }",
            fs: "null",
            os: "null",
          },
        },
      },
    },

    // optimizeDeps: {
    //   exclude: ['mongodb', 'bcrypt', 'cassandra-driver'] // Node-only packages
    // }
  }),
});
