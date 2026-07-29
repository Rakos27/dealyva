import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/test-01/",
  plugins: [react()],
  define: {
    "import.meta.env.VITE_ROUTER_MODE": JSON.stringify("hash"),
  },
  build: {
    outDir: "dist-static",
    emptyOutDir: true,
  },
});
