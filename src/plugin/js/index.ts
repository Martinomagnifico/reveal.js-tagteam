// Basic imports
import type { RevealApi } from "reveal.js";
// Helper imports
import { pluginDebug as debug, PluginBase } from "reveal.js-plugintoolkit";
import type { Config } from "./config";
import { defaultConfig, PLUGIN_ID } from "./config";
// Function imports
import { Tagteam } from "./main";

// No `pluginCSS` call and no `cssautoload`/`csspath` options: Tagteam ships no
// stylesheet. It only sets `data-visibility`, and hiding those sections is
// Reveal's own job.
const init = (_plugin: PluginBase<Config>, deck: RevealApi, config: Config): void => {
	if (debug && config.debug) {
		debug.initialize(true, PLUGIN_ID);
		debug.log("Tagteam debugging enabled.");
	}

	Tagteam.create(deck, config);
};

export default () => {
	const plugin = new PluginBase(PLUGIN_ID, init, defaultConfig);
	return plugin.createInterface();
};
