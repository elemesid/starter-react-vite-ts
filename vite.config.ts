/// <reference types="vitest" />

import svgr from "@svgr/rollup";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";
import tsconfigPaths from "vite-tsconfig-paths";

import { createLogger, defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { dependencies } from "./package.json";

const logger = createLogger();
const originalWarning = logger.warn;

logger.warn = (msg, options) => {
  // ignore external library node from svgr/rollup
  if (msg.includes("[plugin:vite:resolve]")) return;
  originalWarning(msg, options);
};

function renderChunks(deps: Record<string, string>) {
  const chunks: Record<string, string[]> = {};

  Object.keys(deps).forEach((key) => {
    if (["react", "react-dom"].includes(key)) return;
    chunks[key] = [key];
  }, {});

  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "./public",
  optimizeDeps: {
    exclude: [],
  },
  plugins: [
    react(),
    tsconfigPaths(),
    viteCompression({ algorithm: "brotliCompress" }),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      includePublic: true,
      jpg: { quality: 80 },
    }),
    legacy({ targets: ["defaults", "not IE 11"] }),
    svgr(),
  ],
  customLogger: logger,
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/__tests__/setup.ts",
  },
});
