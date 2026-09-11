import type { TagTerm } from "../config";
import { normalizeTerm } from "./normalize-term";

export interface SplitTerms<T extends TagTerm> {
	/** Terms that filter the deck, the way `?t=` and `?n=` always have. */
	filter: T[];
	/** Terms that ask for a hidden section back. */
	include: T[];
}

/**
 * Separate the terms that ask for hidden material from the ones that filter.
 *
 * This is what keeps the two jobs from colliding in `select` mode. Tagteam only
 * filters when it was given something to filter by — no `?t=` has always meant no
 * tag filtering — and a term naming a hidden section is not something to filter
 * by. So `?t=business` asks for nothing to be filtered and only switches business
 * on, while `?t=advanced` filters as it always did, and `?t=advanced,business`
 * does both.
 *
 * An AND-term counts as an include as soon as one of its words is hidden:
 * `?t=business+2024` is still asking for the business material.
 *
 * @param wanted The terms asked for, by URL parameter or by group.
 * @param hidden The deck's hidden terms for this attribute, already normalized.
 */
export const splitTerms = <T extends TagTerm>(wanted: T[], hidden: string[]): SplitTerms<T> => {
	const filter: T[] = [];
	const include: T[] = [];

	for (const term of wanted) {
		// Widened before the check: a generic parameter does not narrow through
		// `Array.isArray`, but the union it is constrained to does.
		const value: TagTerm = term;
		const words = (Array.isArray(value) ? value : [value]).map(normalizeTerm);

		if (words.some((word) => hidden.includes(word))) {
			include.push(term);
		} else {
			filter.push(term);
		}
	}

	return { filter, include };
};
