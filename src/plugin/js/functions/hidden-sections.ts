import type { HideOption } from "../config";
import { normalizeTerm } from "./normalize-term";
import { sectionTerms } from "./section-terms";

/** The deck's `hide` config, in the form the rest of the run compares against. */
export interface HideList {
	tags: string[];
	names: string[];
}

/**
 * Read the `hide` option into its two lists.
 *
 * A bare array is the shorthand for tags, so a deck that only ever hides by tag
 * never has to write the longer form.
 *
 * @param value The `hide` option as the deck wrote it.
 * @returns Both lists, normalized, each possibly empty.
 */
export const normalizeHide = (value: HideOption | undefined): HideList => {
	const terms = Array.isArray(value) ? { tags: value } : (value ?? {});
	const clean = (list: string[] | undefined): string[] =>
		(list ?? []).map(normalizeTerm).filter((term) => term.length > 0);

	return { tags: clean(terms.tags), names: clean(terms.names) };
};

/** Does the deck hide anything at all? */
export const hasHide = (hide: HideList): boolean => hide.tags.length > 0 || hide.names.length > 0;

/**
 * Is this section named by `hide`?
 *
 * Tags inherited from the stack count, so hiding a stack by tag takes its
 * vertical slides with it — both on the way out and on the way back in. A name is
 * the section's own, which is what makes hiding by name the way to reach a
 * chapter that has no tag.
 *
 * @param section The section to judge.
 * @param hide The deck's hidden terms, already normalized.
 */
export const isHiddenBy = (section: HTMLElement, hide: HideList): boolean => {
	if (hide.tags.length > 0) {
		if (sectionTerms(section, "tags").some((term) => hide.tags.includes(term))) {
			return true;
		}
	}

	if (hide.names.length > 0) {
		if (sectionTerms(section, "names").some((term) => hide.names.includes(term))) {
			return true;
		}
	}

	return false;
};

/**
 * Split sections into the ones a filter judges and the ones held apart.
 *
 * The hidden ones are kept out of every pass. A filter neither shows nor hides
 * them, which is what stops `?t=business` from taking the rest of a tagged deck
 * down with it — see `splitTerms`.
 *
 * @param sections The sections to partition.
 * @param hide The deck's hidden terms, already normalized.
 */
export const partitionHidden = (
	sections: Iterable<HTMLElement>,
	hide: HideList
): { filtered: HTMLElement[]; held: HTMLElement[] } => {
	const filtered: HTMLElement[] = [];
	const held: HTMLElement[] = [];

	for (const section of sections) {
		(isHiddenBy(section, hide) ? held : filtered).push(section);
	}

	return { filtered, held };
};
