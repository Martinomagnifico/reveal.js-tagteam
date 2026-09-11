import type { TagTerm } from "../config";
import { normalizeTerm } from "./normalize-term";

/**
 * Does a section satisfy any one of the requested terms?
 *
 * The requested terms are alternatives — one match is enough. A term that is
 * itself an array is an AND: every word in it has to be on the section, so
 * `["dogs", "small"]` passes only for a section that is both.
 *
 * An empty `wanted` matches nothing, which is how a "hide this whole set" pass
 * is expressed.
 *
 * @param wanted The terms asked for, by URL parameter or by group.
 * @param own The terms the section has, already normalized.
 * @returns True when the section should stay visible.
 */
export const matchesTerms = (wanted: TagTerm[], own: string[]): boolean =>
	wanted.some((term) =>
		Array.isArray(term)
			? term.every((word) => own.includes(normalizeTerm(word)))
			: own.includes(normalizeTerm(term))
	);
