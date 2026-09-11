import type { RevealApi } from "reveal.js";
// Helper imports
import { pluginDebug as debug, warnOnce } from "reveal.js-plugintoolkit";
import type { Config, TagTerm } from "./config";
import { PLUGIN_ID } from "./config";
// Function imports
import { applySelection } from "./functions/apply-selection";
import {
	type HideList,
	hasHide,
	normalizeHide,
	partitionHidden,
} from "./functions/hidden-sections";
import { matchesTerms } from "./functions/matches-terms";
import { parseNameTerms, parseTagTerms } from "./functions/parse-terms";
import { pruneEmptyStacks } from "./functions/prune-empty-stacks";
import { readParams } from "./functions/read-params";
import { resolveGroup } from "./functions/resolve-group";
import { sectionTerms } from "./functions/section-terms";
import { hideSection, showSection } from "./functions/set-visibility";
import { splitTerms } from "./functions/split-terms";
import { warnEscapedEntities } from "./functions/warn-escaped-entities";
import type { Params } from "./types";

/** The terms a run asked for, per attribute. */
interface Asked {
	tags: TagTerm[];
	names: string[];
}

const NOTHING_ASKED: Asked = { tags: [], names: [] };

export class Tagteam {
	private readonly options: Config;
	private readonly params: Params;
	private readonly root: HTMLElement;

	/** In `unhide` mode a parameter only ever shows; nothing is filtered. */
	private readonly unhideMode: boolean;

	/** The deck's `hide` terms, in the same form as the ones read off sections. */
	private readonly hide: HideList;

	/** Every section a filter may hide. The mandatory notices are not among them. */
	private readonly selectable: NodeListOf<HTMLElement>;
	private readonly mandatory: NodeListOf<HTMLElement>;

	/** Tagged and named sections a filter judges — the hidden ones held apart. */
	private readonly tagged: HTMLElement[];
	private readonly named: HTMLElement[];
	private readonly held: HTMLElement[];

	/** Every marked section, held or not. What a parameter can reach in `unhide` mode. */
	private readonly marked: HTMLElement[];

	private constructor(deck: RevealApi, options: Config) {
		this.options = options;
		this.params = readParams();
		this.root = deck.getRevealElement() as HTMLElement;
		this.unhideMode = options.mode === "unhide";
		this.hide = normalizeHide(options.hide);

		// `data-tag="keep"` opts a section out of both filters — the title slide of a
		// deck, typically. It only works as the whole attribute value: `data-tag="keep,
		// intro"` is an ordinary tagged section. It is not a way out of the
		// mandatorygroup safeguard, which works off `data-mandatory`.
		this.selectable = this.root.querySelectorAll("section:not([data-mandatory])");
		this.mandatory = this.root.querySelectorAll("section[data-mandatory]");

		const tagged = [
			...this.root.querySelectorAll<HTMLElement>("section[data-tag]:not([data-tag=keep])"),
		];
		const named = [
			...this.root.querySelectorAll<HTMLElement>("section[data-name]:not([data-tag=keep])"),
		];

		// A section named by `hide` is held out of both filters, whether it was
		// found by tag or by name. Only a term naming it brings it back, so the other
		// attribute cannot reach it by accident.
		const byTag = partitionHidden(tagged, this.hide);
		const byName = partitionHidden(named, this.hide);

		this.tagged = byTag.filtered;
		this.named = byName.filtered;
		this.held = [...new Set([...byTag.held, ...byName.held])];
		this.marked = [...new Set([...tagged, ...named])];
	}

	/**
	 * Decide, once, which sections survive.
	 *
	 * Everything happens during `init()`, before Reveal's `start()` reaches
	 * `removeHiddenSlides()`, so the deck Reveal goes on to lay out is already the
	 * filtered one. There is nothing to re-run on navigation.
	 *
	 * What starts out is the deck's own business: a section it wrote
	 * `data-visibility="hidden"` on is out until something says otherwise. Tagteam
	 * only decides what a parameter does about that.
	 */
	private run(): void {
		debug.log("Options:", this.options);
		debug.log("Parameters:", this.params);

		// Checked before anything else, so the reason a filter is about to do nothing
		// is on the console before the result of it is on the screen.
		warnEscapedEntities(this.marked);
		this.warnAboutMode();

		// What `hide` names starts out, the same as a `data-visibility="hidden"` the
		// deck wrote itself. It only saves the deck the trouble of writing it.
		if (hasHide(this.hide)) {
			debug.log(`Hidden until asked for: ${this.held.length} section(s).`);
			for (const section of this.held) {
				hideSection(section);
			}
		}

		const { groups, mandatorygroup } = this.options;
		const requestedGroup = this.params.g;
		const group =
			requestedGroup !== null && Object.hasOwn(groups, requestedGroup)
				? groups[requestedGroup]
				: null;

		// The safeguard. Without a group that exists, a mandatorygroup deck shows only
		// its `data-mandatory` notices; in every other case those notices are what gets
		// hidden, since they exist to be seen when nothing else is.
		if (mandatorygroup && !this.unhideMode && !group) {
			debug.log("Mandatory group missing or unknown, showing only [data-mandatory].");
			applySelection(this.selectable, [], "none", false);
		} else {
			applySelection(this.mandatory, [], "none", false);
		}

		const asked = this.askedFor(requestedGroup, group, mandatorygroup);

		if (this.unhideMode) {
			// Before the prune, so that a stack whose only visible slide has just been
			// shown is not judged empty.
			this.showAsked(asked);
			pruneEmptyStacks(this.named);
			return;
		}

		// A `?g=` naming a group that does not exist asks for nothing, and in `select`
		// mode a parameter that names nothing shows nothing. A mistyped link should
		// not become a way past the filter.
		if (requestedGroup !== null && !group) {
			applySelection(this.tagged, [], "none", false);
			applySelection(this.named, [], "none", false);
		}

		// In `select` mode a term naming hidden material is not something to filter
		// by, so it is taken out before the filter runs.
		const byTag = splitTerms(asked.tags, this.hide.tags);
		const byName = splitTerms(asked.names, this.hide.names);

		this.applyFilters({ tags: byTag.filter, names: byName.filter });
		pruneEmptyStacks(this.named);

		// Last, so that nothing can take back a section the URL asked for.
		this.showHeld({ tags: byTag.include, names: byName.include });
	}

	/**
	 * Read the terms this run asks for, from a group or from the parameters.
	 */
	private askedFor(
		requestedGroup: string | null,
		group: Config["groups"][string] | null,
		mandatorygroup: boolean
	): Asked {
		if (requestedGroup !== null) {
			return this.groupTerms(requestedGroup, group);
		}
		if (mandatorygroup && !this.unhideMode) {
			return NOTHING_ASKED;
		}
		return {
			tags: this.params.t ? parseTagTerms(this.params.t) : [],
			names: this.params.n ? parseNameTerms(this.params.n) : [],
		};
	}

	/**
	 * Read a `?g=` group's terms.
	 *
	 * An unknown group asks for nothing. In `select` mode that hides every tagged
	 * and named section, because a parameter there names the whole presentation and
	 * a mistyped link should not become a way past the filter. In `unhide` mode it
	 * simply reveals nothing, since a parameter never hides.
	 */
	private groupTerms(requestedGroup: string, group: Config["groups"][string] | null): Asked {
		if (!group) {
			debug.warn(
				this.unhideMode
					? `Group "${requestedGroup}" is not defined. Nothing was revealed.`
					: `Group "${requestedGroup}" is not defined. Hiding everything instead.`
			);
			return NOTHING_ASKED;
		}

		const { tags, names } = resolveGroup(group);

		if (!tags && !names) {
			debug.warn(`Group "${requestedGroup}" sets neither a 'tags' nor a 'names' array.`);
			return NOTHING_ASKED;
		}

		return { tags: tags ?? [], names: names ?? [] };
	}

	/**
	 * `select` mode: the parameter names what is shown, and every marked section it
	 * does not name is hidden.
	 *
	 * Tags run first so that a stack hidden by the tag pass can still be re-opened
	 * by a matching vertical slide, and the name pass then has the final say over
	 * the stacks it knows about.
	 */
	private applyFilters(asked: Asked): void {
		// Only a name pass that actually runs gets the last word on stacks, so only
		// then does a matching vertical slide leave its stack alone.
		const nameFilterActive = asked.names.length > 0;

		if (asked.tags.length > 0) {
			debug.log("Tags to show:", asked.tags);
			applySelection(this.tagged, asked.tags, "tags", nameFilterActive);
		}
		if (nameFilterActive) {
			debug.log("Names to show:", asked.names);
			applySelection(this.named, asked.names, "names", nameFilterActive);
		}
	}

	/**
	 * `unhide` mode: show what the parameter names and leave everything else alone.
	 *
	 * This reaches any marked section, including one the deck authored
	 * `data-visibility="hidden"` on. Nothing was hidden by a filter here, so showing
	 * a section that was already visible is a no-op, and a term that matches nothing
	 * changes nothing at all.
	 */
	private showAsked(asked: Asked): void {
		if (asked.tags.length === 0 && asked.names.length === 0) return;

		debug.log("Asked for:", asked);

		for (const section of this.marked) {
			const wanted =
				matchesTerms(asked.tags, sectionTerms(section, "tags")) ||
				matchesTerms(asked.names, sectionTerms(section, "names"));

			if (wanted) {
				showSection(section, false);
			}
		}
	}

	/**
	 * `select` mode: put back the hidden sections the URL asked for.
	 *
	 * Purely additive, and it runs after everything else, so it can never undo a
	 * filter's work on the sections the filter was allowed to judge.
	 */
	private showHeld(asked: Asked): void {
		if (this.held.length === 0) return;
		if (asked.tags.length === 0 && asked.names.length === 0) return;

		debug.log("Hidden material asked for:", asked);

		for (const section of this.held) {
			const wanted =
				matchesTerms(asked.tags, sectionTerms(section, "tags")) ||
				matchesTerms(asked.names, sectionTerms(section, "names"));

			if (wanted) {
				showSection(section, false);
			}
		}
	}

	/**
	 * Say so when the config asks for something the mode cannot do, rather than
	 * quietly ignoring it.
	 */
	private warnAboutMode(): void {
		if (this.unhideMode && this.options.mandatorygroup) {
			warnOnce(
				PLUGIN_ID,
				'`mandatorygroup` does nothing in mode "unhide". Nothing is withheld in that mode: a parameter never hides anything.'
			);
		}
	}

	/**
	 * Create a Tagteam instance and run its single pass.
	 */
	static create(deck: RevealApi, options: Config): Tagteam {
		const instance = new Tagteam(deck, options);
		instance.run();
		return instance;
	}
}
