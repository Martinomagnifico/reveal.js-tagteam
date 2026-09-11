/**
 * Bring a term to the form both sides of a comparison are held in.
 *
 * Lowercased, ends trimmed, and any run of whitespace inside collapsed to a
 * single space, so that `data-name="Black  &  white"` still answers to
 * `?n=black+%26+white`. A name is matched as written text, and a double space in
 * the markup is a typo rather than a different name.
 *
 * Tags never contain a space — a space is what separates them inside one `?t=`
 * alternative — so for those this only lowercases.
 *
 * @param value The raw term, from an attribute or from a parameter.
 * @returns The term in comparable form.
 */
export const normalizeTerm = (value: string): string =>
	value.trim().replace(/\s+/g, " ").toLowerCase();
