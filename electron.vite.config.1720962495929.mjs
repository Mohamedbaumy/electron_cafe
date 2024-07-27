// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@components": resolve("src/renderer/src/components"),
        "@hooks": resolve("src/renderer/src/hooks"),
        "@features": resolve("src/renderer/src/features"),
        "@": resolve("src/renderer/src"),
        "/assets": resolve("src/renderer/src/assets")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
