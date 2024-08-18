import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import fs from "fs";

// Kiểm tra nếu đang chạy trong môi trường development
const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  server: isDev
    ? {
        port: 3000,
        https: {
          key: fs.readFileSync(path.resolve(__dirname, "./localhost-key.pem")),
          cert: fs.readFileSync(path.resolve(__dirname, "./localhost.pem")),
        },
      }
    : undefined, // Không cấu hình server cho production
});
