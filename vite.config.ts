import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/kanban-board/",
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
