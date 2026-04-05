import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const port = Number(process.env.VITE_DEV_PORT ?? 5173);

export default defineConfig({
  plugins: [react()],
  server: {
    port,
    strictPort: true,
    host: "127.0.0.1",
  },
  base: "./",
});
