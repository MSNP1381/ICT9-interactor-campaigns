import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This exposes the server to all network interfaces
    port: 3000, // You can specify a port or remove this line to use the default
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  // define: {
  //   "import.meta.env.VITE_DISABLE_AUTH": (process.env.VITE_DISABLE_AUTH),
  // },
});
