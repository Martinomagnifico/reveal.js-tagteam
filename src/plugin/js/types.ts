/** The three URL parameters Tagteam reads. */
export interface Params {
	/** `?t=` — tags. */
	t: string | null;
	/** `?n=` — names. */
	n: string | null;
	/** `?g=` — a predefined group. */
	g: string | null;
}

/**
 * Which attribute a pass matches on.
 *
 * `none` is the pass that hides a set outright — it collects no terms from the
 * section, so nothing can match and everything in the set is hidden.
 */
export type SelectionKind = "tags" | "names" | "none";
