import { warnOnce } from "reveal.js-plugintoolkit";
import type { Group, TagTerm } from "../config";
import { PLUGIN_ID } from "../config";

export interface ResolvedGroup {
	tags: TagTerm[] | null;
	names: string[] | null;
}

/**
 * Read a group's requested tags and names.
 *
 * Until 2.0.0 the documented default config spelled these `t` and `n` while the
 * code only ever read `tags` and `names`, so decks copied from the README could
 * define a group that quietly asked for nothing. Both spellings are accepted
 * now, with the short one warned about once.
 *
 * @param group The group definition from the deck's config.
 * @returns The group's terms, each `null` when the group does not set it.
 */
export const resolveGroup = (group: Group): ResolvedGroup => {
	if (group.t || group.n) {
		warnOnce(
			PLUGIN_ID,
			"Groups are spelled `tags` and `names` since 2.0.0. The short `t` and `n` keys still work, but will be dropped."
		);
	}

	return {
		tags: group.tags ?? group.t ?? null,
		names: group.names ?? group.n ?? null,
	};
};
