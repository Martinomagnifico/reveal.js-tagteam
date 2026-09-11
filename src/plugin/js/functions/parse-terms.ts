import type { TagTerm } from "../config";

/**
 * Split a `?t=` value into the terms it asks for.
 *
 * Commas separate alternatives, spaces inside one alternative make it an AND.
 * A query string encodes a space as `+`, so `?t=dogs,cats+small` arrives here as
 * `"dogs, cats small"` and comes out as `["dogs", ["cats", "small"]]`: any dog,
 * but only the small cats.
 *
 * @param value The raw `t` parameter.
 * @returns One entry per alternative; arrays are AND-groups.
 */
export const parseTagTerms = (value: string): TagTerm[] =>
	value
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0)
		.map((item) => {
			const words = item.split(/\s+/);
			return words.length > 1 ? words : words[0];
		});

/**
 * Split a `?n=` value into the names it asks for.
 *
 * Names are not split on spaces the way tags are: "black & white" is one name,
 * not three terms. Only commas separate them.
 *
 * @param value The raw `n` parameter.
 * @returns One entry per name.
 */
export const parseNameTerms = (value: string): string[] =>
	value
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
