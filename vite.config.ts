import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { applyIndexSeoMetadata } from "./src/config/seo";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        share: resolve(__dirname, "share.html"),
      },
    },
  },
  plugins: [
    react(),
    {
      name: "site-seo-metadata",
      transformIndexHtml(html, context) {
        const target =
          context.filename?.endsWith("share.html") ? "share" : "index";

        return applyIndexSeoMetadata(html, undefined, target);
      },
    },
  ],
});
