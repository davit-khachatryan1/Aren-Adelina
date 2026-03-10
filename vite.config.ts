import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { applyIndexSeoMetadata } from "./src/config/seo";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "site-seo-metadata",
      transformIndexHtml(html) {
        return applyIndexSeoMetadata(html);
      },
    },
  ],
});
