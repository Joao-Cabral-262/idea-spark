import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 1. Adicionamos a importação aqui
import path from "path";

export default defineConfig({
  base: '/idea-spark/', 
  plugins: [
    react(),
    tailwindcss(), // 2. Ligamos o motor do Tailwind aqui!
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
