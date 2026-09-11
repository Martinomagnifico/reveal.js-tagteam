# Changelog

## [1.1.0] - 2026-09-11
### Changed
- Rewritten in TypeScript and built with Vite, on top of [reveal.js-plugintoolkit](https://github.com/Martinomagnifico/reveal.js-plugintoolkit). The distributed files are now `tagteam.js` (UMD) and `tagteam.mjs` (ESM). `tagteam.esm.js` is still shipped alongside them, as a one-line re-export of `tagteam.mjs`, so a deck that loads the old filename by path goes on working untouched.
- Groups are spelled `tags` and `names`. The old `t` and `n` keys are still read, but warn once and will be dropped.
- The default `groups` is empty. It used to hold a "pets" placeholder, which merged into your own config and stayed addressable as a real `?g=` value.
- Names are matched case-insensitively on both sides, so `?n=Brown` finds `data-name="brown"` as well. Whitespace inside a name is collapsed on both sides too: `data-name="Black  &  white"` still answers to `?n=black+%26+white`.
- A named stack is now judged on its vertical slides only, so a stack that holds something other than sections is no longer kept open by that.

### Fixed
- A matching slide no longer re-opens its stack while a name filter is in play. The names pass has the last word on the stacks it knows about, instead of depending on the order the two passes happen to run in.
- Empty terms in a parameter (`?t=dogs,,cats`) are dropped instead of being kept as terms that can never match.

### Added
- `mode`, which says how the deck behaves. `"select"` filters down from everything, the way Tagteam has always worked, and is the default: a parameter picks what is shown and hides every other marked section. `"unhide"` reveals up from a hidden set: a parameter shows what it names and leaves everything else exactly as it was, so it can only ever reveal and a term that matches nothing changes nothing. What starts out is a separate question, answered by the markup and by `hide`.
- In `mode: "unhide"`, a parameter reaches a section the deck authored `data-visibility="hidden"` itself, without it being named anywhere. Nothing is being filtered, so naming it simply shows it.
- `hide`, the tags and names whose sections start out of the presentation until a URL parameter asks for them — the same as writing `data-visibility="hidden"` on each of them, which is what it is named after. Spelled the same way a group is otherwise — `hide: { tags: [], names: [] }`, with a bare array as shorthand for tags — so a chapter with no tag at all can be hidden by its name. For the deck you give a few times, where only once you also want to cover a particular subject. The hidden sections are kept out of both filters, and a hidden tag is taken out of the filter before it runs — so `?t=business` switches that chapter on without hiding the rest of a tagged deck, while `?t=deep` filters exactly as it always did and `?t=deep,business` does both. Groups split the same way.
- A console warning when a `data-tag` or `data-name` still contains an HTML entity, which is what a template escaping an ampersand twice leaves behind. Such a section can never be matched, and the symptom is a filter that appears to do nothing, so the warning is printed whether or not `debug` is on.
- A demo built from the same source as the plugin, with the mandatory-group case on its own page (`demo-mandatory.html`), and Simplemenu alongside it to show the menubar following the filter.
- Two demos, one per `mode`: `demo-select.html`, a portfolio where the URL picks the work to show, and `demo-unhide.html`, an ordinary short talk with one optional chapter and one optional slide in it.


## [1.0.1] - 2022-10-17
- Started keeping the changelog.
### Changed
- Fix bug in `forEach()`


## [1.0.0] - 2021-12-08
- First commit
