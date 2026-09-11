/**
 * Mark a section as hidden.
 *
 * Reveal reads `data-visibility="hidden"` in its own `start()` and removes the
 * section from the DOM altogether, so this is the whole of Tagteam's output.
 */
export const hideSection = (section: HTMLElement): void => {
	section.dataset.visibility = "hidden";
};

/**
 * Mark a section as visible.
 *
 * The explicit "visible" matters because a deck may ship a stack with
 * `data-visibility="hidden"` already on it — the demo does — so that nothing
 * shows until a parameter asks for it. Clearing the attribute is not enough on
 * a stack that was authored hidden.
 *
 * When no name filter is in play, a matching vertical slide also re-opens the
 * stack it sits in: `?t=dogs` should reach the dogs inside `data-name="Brown"`
 * even though the "Brown" stack itself has no matching tag. With `?n=` or a
 * group's `names` set, the stack's visibility is the names pass's decision and
 * is left alone.
 *
 * @param section The section to show.
 * @param nameFilterActive Whether a name filter decides stack visibility.
 */
export const showSection = (section: HTMLElement, nameFilterActive: boolean): void => {
	section.dataset.visibility = "visible";

	if (nameFilterActive) return;

	const parent = section.parentElement;
	if (parent instanceof HTMLElement && parent.tagName === "SECTION") {
		parent.dataset.visibility = "visible";
	}
};
