// vite.lib.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };
import pluginConfig from "./plugin.config.js";

const pluginName = pkg.name.replace("reveal.js-", "");

// Tagteam ships no stylesheet: it only sets `data-visibility`, and Reveal itself
// removes the slides that carries. So there is no `assetFileNames` CSS branch
// here, and no `cssautoload`/`csspath` in the config.
export default defineConfig({
	build: {
		lib: {
			formats: ["es", "umd"],
			entry: resolve(import.meta.dirname, "src/plugin/js/index.ts"),
			name: pluginConfig.functionname,
			fileName: (format) =>
				`plugin/${pluginName}/${pluginName}.${format === "es" ? "mjs" : "js"}`,
		},
		outDir: "demo",
		emptyOutDir: false,
		rollupOptions: {
			checks: {
				emptyImportMeta: false,
			},
			external: [/^\/node_modules\/reveal\.js\/.*/],
		},
	},
});
