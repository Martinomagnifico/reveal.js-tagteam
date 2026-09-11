export const PLUGIN_ID = "tagteam";

/**
 * One term that a URL parameter or a group asks for.
 *
 * A plain string matches a section with that tag. A nested array is an AND:
 * every term in it has to be on the section, which is how `?t=cats+small` asks
 * for small cats rather than for cats and for small things.
 */
export type TagTerm = string | string[];

export interface Group {
	tags?: TagTerm[];
	names?: string[];
	/** @deprecated Spelled `tags` since 2.0.0. */
	t?: TagTerm[];
	/** @deprecated Spelled `names` since 2.0.0. */
	n?: string[];
}

/**
 * The tags and names whose sections start out of the presentation, until a URL
 * parameter asks for them.
 *
 * The same thing as writing `data-visibility="hidden"` on each of them, which is
 * why it is spelled `hide`. Spelled the same way a group is otherwise, so the two
 * read alike, and a bare array is the shorthand for tags: `hide: ["nerdy"]` and
 * `hide: { tags: ["nerdy"] }` are the same thing.
 */
export interface HideTerms {
	tags?: string[];
	names?: string[];
}

export type HideOption = string[] | HideTerms;

/**
 * How the deck behaves: which sections a URL parameter can reach, and what
 * happens to the rest.
 *
 * `select` filters down from everything: the parameter picks what is shown, and
 * hides every other marked section. `unhide` reveals up from a hidden set: the
 * parameter shows what it names, and never hides anything.
 *
 * What starts out is a separate question, answered by `hide` or by a
 * `data-visibility="hidden"` the deck wrote itself. What a parameter does about
 * it follows from the mode; it is not what the mode is for.
 */
export type Mode = "select" | "unhide";

export interface Config {
	debug: boolean;
	mandatorygroup: boolean;
	mode: Mode;
	hide: HideOption;
	groups: Record<string, Group>;
}

export const defaultConfig: Config = {
	debug: false,
	mandatorygroup: false,
	mode: "select",
	// An object rather than an array, so that a deck writing either form gets it
	// through the toolkit's config merge intact: arrays are replaced wholesale, and
	// a value of a different shape than the default replaces it wholesale too.
	hide: {},
	// Empty rather than a sample group. The toolkit deep-merges this into the deck's
	// own config, so a placeholder would survive the merge and stay addressable as a
	// real `?g=` value beside the author's own groups.
	groups: {},
};
