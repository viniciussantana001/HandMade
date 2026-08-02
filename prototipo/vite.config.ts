import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    // `dist` dentro do próprio projeto. Antes era `../build`: ao descompactar a
    // entrega e rodar o build, a saída caía FORA da pasta do protótipo, num
    // diretório irmão — comportamento inesperado para quem recebe o pacote.
    outDir: "dist",
    emptyOutDir: true,
  },
}));
