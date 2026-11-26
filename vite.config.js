import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const resolvedUrl =
    env.VITE_SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.SUPABASE_URL ||
    "";
  const resolvedKey =
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    "";

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __SUPABASE_URL__: JSON.stringify(resolvedUrl),
      __SUPABASE_PUBLISHABLE_KEY__: JSON.stringify(resolvedKey),
    },
    server: {
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
  };
});
