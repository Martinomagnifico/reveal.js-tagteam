import { warnOnce } from "reveal.js-plugintoolkit";
import { PLUGIN_ID } from "../config";

// `&amp;`, `&#38;`, `&#x26;` — an entity that reached the attribute value intact
// instead of having been decoded into the character it stands for.
//
// Named entities are listed rather than matched as a shape, because `&\w+;` also
// describes a name someone meant to write: "R&D; Marketing" is not a mistake.
// Everything a template escapes for you is in this list.
const ENTITY = /&(?:amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-f]+);/i;

/**
 * Warn about a tag or name that still has an HTML entity in it.
 *
 * A template that escapes attribute values for you — pug, and most of the
 * others — turns an `&amp;` you wrote yourself into `&amp;amp;`, which the
 * browser then decodes to the five characters `&amp;`. The attribute reads
 * "Black &amp; white" where "Black & white" was meant, and every parameter
 * asking for it quietly matches nothing.
 *
 * Printed outside of debug mode on purpose. The symptom is a filter that appears
 * to do nothing at all, which is not a state anyone thinks to turn debugging on
 * for. `warnOnce` keeps it to a single line per deck.
 *
 * @param sections The sections a filter can act on.
 */
export const warnEscapedEntities = (sections: Iterable<HTMLElement>): void => {
	const offenders = new Set<string>();

	for (const section of sections) {
		for (const value of [section.dataset.tag, section.dataset.name]) {
			if (value && ENTITY.test(value)) {
				offenders.add(value);
			}
		}
	}

	if (offenders.size === 0) return;

	const list = [...offenders].map((value) => `"${value}"`).join(", ");

	warnOnce(
		PLUGIN_ID,
		`An HTML entity survived into a data-tag or data-name: ${list}. That is usually a template escaping the character twice — write the character itself rather than the entity, and let the template escape it. As it stands, no URL parameter can match these sections.`
	);
};
