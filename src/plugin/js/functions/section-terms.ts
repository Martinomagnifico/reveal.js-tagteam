import type { SelectionKind } from "../types";
import { normalizeTerm } from "./normalize-term";

/**
 * Collect the terms a section offers for matching.
 *
 * For `tags`, a section has its own `data-tag` list plus the list on its
 * stack: a vertical slide inside `<section data-name="Brown" data-tag="nice">`
 * counts as "nice" too, which is what makes `?t=nice+horses` work.
 *
 * For `names`, only the section's own `data-name`, lowercased so that `?n=brown`
 * finds `data-name="Brown"`.
 *
 * For `none`, nothing — the caller wants this set hidden outright, and an empty
 * term list can never match.
 *
 * @param section The section to read.
 * @param kind Which attribute this pass matches on.
 * @returns The section's terms, lowercased.
 */
export const sectionTerms = (section: HTMLElement, kind: SelectionKind): string[] => {
	if (kind === "tags") {
		const own = splitList(section.dataset.tag);
		const parent = section.parentElement;
		const inherited = parent instanceof HTMLElement ? splitList(parent.dataset.tag) : [];

		return [...own, ...inherited];
	}

	if (kind === "names") {
		return splitList(section.dataset.name);
	}

	return [];
};

/**
 * Split a comma-separated attribute value into comparable terms.
 */
const splitList = (value: string | undefined): string[] =>
	value
		? value
				.split(",")
				.map(normalizeTerm)
				.filter((term) => term.length > 0)
		: [];
