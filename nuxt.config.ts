import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon"],
  css: ["~/assets/app.css"],
  srcDir: "app/",
  nitro: {
    preset: "static",
    output: {
      dir: "dist",
    },
  },
});
