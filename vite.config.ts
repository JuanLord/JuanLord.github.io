import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

function photoArchiveHtml(mode: string): Plugin {
  return {
    name: "photo-archive-html",
    transformIndexHtml(html) {
      if (mode !== "photos") return html;

      return html
        .replaceAll(
          "Juan Varela | Developer & Engineer",
          "Juan Varela Photography",
        )
        .replace(
          "Juan Varela's engineering and software portfolio, with selected projects, experience, and creative field notes.",
          "Juan Varela's photography journal: complete trip folders, a location atlas, and listening companions.",
        )
        .replaceAll(
          "Engineering, software, and creative field notes by Juan Varela.",
          "Travel photography, location stories, and listening companions by Juan Varela.",
        )
        .replace('content="#080b10"', 'content="#161b18"')
        .replace(
          '<link rel="canonical" href="https://juanvarela.dev/" />',
          '<link rel="canonical" href="https://photos.juanvarela.dev/" />',
        )
        .replace(
          '<meta property="og:site_name" content="Juan Varela Portfolio" />',
          '<meta property="og:site_name" content="Juan Varela Photography" />',
        )
        .replace(
          '<meta property="og:url" content="https://juanvarela.dev/" />',
          '<meta property="og:url" content="https://photos.juanvarela.dev/" />',
        )
        .replace(
          '    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />\n',
          "",
        )
        .replace('    <link rel="manifest" href="/site.webmanifest" />\n', "");
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "/",
  build: {
    rolldownOptions: {
      input:
        mode === "photos"
          ? fileURLToPath(new URL("./index.html", import.meta.url))
          : {
              main: fileURLToPath(new URL("./index.html", import.meta.url)),
              photos: fileURLToPath(
                new URL("./photos/index.html", import.meta.url),
              ),
            },
    },
  },
  plugins: [react(), tailwindcss(), photoArchiveHtml(mode)],
  publicDir: mode === "photos" ? false : "public",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
}));
