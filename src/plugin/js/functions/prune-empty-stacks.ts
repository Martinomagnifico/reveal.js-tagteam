import { sectionTools } from "reveal.js-plugintoolkit";
import { hideSection } from "./set-visibility";

/**
 * Hide any named stack whose vertical slides have all been hidden.
 *
 * A stack can survive the passes above on its own name or tag while every slide
 * inside it was filtered away — or be re-opened by `showSection` for a child
 * that a later pass then hid. Reveal would keep such a stack as an empty chapter
 * and a menu built from names would still list it, so it goes too.
 *
 * Only stacks are considered. A named section that holds content rather than
 * vertical slides has no children to judge it by, and its own pass already
 * decided it.
 *
 * @param namedSections The sections with a `data-name`.
 */
export const pruneEmptyStacks = (namedSections: Iterable<HTMLElement>): void => {
	for (const section of namedSections) {
		if (section.dataset.visibility === "hidden") continue;
		if (!sectionTools.isStack(section)) continue;

		const verticals = section.querySelectorAll(":scope > section");
		const anyVisible = Array.from(verticals).some(
			(vertical) => (vertical as HTMLElement).dataset.visibility !== "hidden"
		);

		if (!anyVisible) {
			hideSection(section);
		}
	}
};
