import type { Params } from "../types";

/**
 * Read `t`, `n` and `g` off the query string.
 *
 * Read once and passed around, rather than re-read per section, because the
 * whole run happens inside a single `init()` — the URL cannot change underneath
 * it, and `showSection` needs to know whether a name filter is in play.
 *
 * @returns The three parameters, each `null` when absent.
 */
export const readParams = (): Params => {
	const urlparams = new URLSearchParams(new URL(window.location.href).search);

	return {
		t: urlparams.get("t"),
		n: urlparams.get("n"),
		g: urlparams.get("g"),
	};
};
