import type { TagTerm } from "../config";
import type { SelectionKind } from "../types";
import { matchesTerms } from "./matches-terms";
import { sectionTerms } from "./section-terms";
import { hideSection, showSection } from "./set-visibility";

/**
 * Run one pass over a set of sections, hiding the ones that do not match.
 *
 * Called once per kind of filter, and once more with an empty `wanted` whenever
 * a whole set has to disappear — nothing can match no terms.
 *
 * @param sections The sections this pass judges.
 * @param wanted The terms asked for. Empty hides the entire set.
 * @param kind Which attribute to match on.
 * @param nameFilterActive Whether a name filter decides stack visibility.
 */
export const applySelection = (
	sections: Iterable<HTMLElement>,
	wanted: TagTerm[],
	kind: SelectionKind,
	nameFilterActive: boolean
): void => {
	for (const section of sections) {
		if (matchesTerms(wanted, sectionTerms(section, kind))) {
			showSection(section, nameFilterActive);
		} else {
			hideSection(section);
		}
	}
};
