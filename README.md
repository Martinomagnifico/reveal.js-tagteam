# Tagteam

[![Version](https://img.shields.io/npm/v/reveal.js-tagteam)](#) [![Downloads](https://img.shields.io/npm/dt/reveal.js-tagteam)](https://github.com/Martinomagnifico/reveal.js-tagteam/archive/refs/heads/master.zip)

A plugin for [Reveal.js](https://revealjs.com) that shows only certain sections of a presentation. A URL parameter decides which.

[<img src="https://martinomagnifico.github.io/reveal.js-tagteam/screenshot.png" width="100%">](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html)

* [Demo](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html)
* [Select demo](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo-select.html)
* [Unhide demo](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo-unhide.html)
* [Mandatory group demo](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo-mandatory.html)

Tagteam reads three URL parameters:

1. `?t=abcd` for `data-tag` sections
2. `?n=abcd` for `data-name` sections
3. `?g=abcd` for predefined groups


## Two ways to use it

They need different things from your markup.

**[Selecting](#mode-select).** Mark the sections a parameter may choose between, each with a `data-tag` or a `data-name`. A parameter then names what is shown, and every marked section it does not name is hidden. Everything the parameter should be able to hide has to be marked.

**[Unhiding](#mode-unhide).** Mark only the material to be left out. It stays out until a parameter asks for it, and then nothing else changes. The rest of the deck needs no marking at all.

These are two separate questions, and Tagteam keeps them apart. The markup says **what starts out**. `mode` says **how the deck behaves**: `"select"` filters down from everything, so the parameter picks what is shown and hides every other marked section. `"unhide"` reveals up from what is hidden, so the parameter shows what it names and never hides anything. What a parameter does follows from the mode; `"select"` is the default, and is what Tagteam has always done.

| `mode` | What a URL parameter does |
|---|---|
| `"select"` (default) | Picks what is shown, and hides every other marked section |
| `"unhide"` | Shows what it names, and leaves everything else alone |

With no parameter at all, neither mode filters anything: the deck is what you wrote, less whatever is hidden. What a parameter shows is what was hidden (if hidden) — naming a section that is already visible does nothing to it. A section with no `data-tag` and no `data-name` is never touched by a parameter either way.


## Installation

### Regular installation

Copy the tagteam folder to the plugins folder of the reveal.js folder, like this: `plugin/tagteam`.

### npm installation

This plugin is published to, and can be installed from, npm.

```console
npm install reveal.js-tagteam
```

The Tagteam plugin folder can then be referenced from `node_modules/reveal.js-tagteam/plugin/tagteam`


## Setup

There are two JavaScript files to choose between, a regular one, `tagteam.js`, and a module one, `tagteam.mjs`. You only need one of them.

### Regular

If you're not using ES modules, for example, to be able to run your presentation from the filesystem, you can add it like this:

```html
<script type="text/javascript" src="dist/reveal.js"></script>
<script src="plugin/tagteam/tagteam.js"></script>
<script>
	Reveal.initialize({
		// ...
		plugins: [ Tagteam ]
	});
</script>
```

### As a module

If you're using ES modules, you can add it like this:

```html
<script type="module">
	// This will need a server
	import Reveal from './dist/reveal.esm.js';
	import Tagteam from './plugin/tagteam/tagteam.mjs';
	Reveal.initialize({
		// ...
		plugins: [ Tagteam ]
	});
</script>
```

Tagteam ships no stylesheet. All it does is set `data-visibility` on the sections that are not to be shown, and removing those is Reveal's own job.

### Plugin order

Tagteam does its whole job during `init()`, before Reveal removes the hidden sections. Two other plugins care about that:

* **Load the Markdown plugin *before* Tagteam**, so that Tagteam can find the tagged and named sections it writes.
* **Load Tagteam *before* [Simplemenu](https://github.com/Martinomagnifico/reveal.js-simplemenu)**, so that the chapters Tagteam hides never make it into the menu. Simplemenu skips sections marked hidden while it builds its map, but only the ones already marked when its own `init()` runs.

```javascript
Reveal.initialize({
	// ...
	plugins: [ RevealMarkdown, Tagteam, Simplemenu ]
});
```


## `mode: "select"`

The parameter names what is shown. Everything it should be able to hide needs a `data-tag` or a `data-name`: a section with neither is never looked at, and is always shown.

[Select demo](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo-select.html) — a portfolio, where the URL decides which work is shown.

### Tags

A tag is a single word, and a section can hold several, comma-separated. You can tag the parent stack sections too: a vertical slide counts the tags on its stack as its own.

```html
<section data-tag="nice">
	<section data-tag="cats, small">Cat (brown, small, nice)</section>
	<section data-tag="dogs">Dog (brown, nice)</section>
	<section data-tag="dogs, big">Dog (brown, big, nice)</section>
	<section data-tag="horses">Horse (brown, nice)</section>
</section>
<section>
	<section data-tag="cats">Cat (black &amp; white)</section>
	<section data-tag="dogs, small">Dog (black &amp; white + small)</section>
	<section data-tag="horses">Horse (black &amp; white)</section>
</section>
```

A comma separates alternatives, a plus sign narrows one of them down: `?t=dogs,cats+small` asks for every dog, but only for the small cats.

- [demo.html?t=dogs](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html?t=dogs)
- [demo.html?t=dogs,cats](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html?t=dogs,cats)
- [demo.html?t=dogs,cats+small](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html?t=dogs,cats+small)
- [demo.html?t=small+cats,nice+horses](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html?t=small+cats,nice+horses)

### Names

A name belongs to a stack, so one parameter takes a whole chapter. Names can be several words long, like "About us".

```html
<section data-name="Brown" data-tag="nice">
	<section data-tag="cats, small">Cat (brown, small, nice)</section>
	<section data-tag="dogs">Dog (brown, nice)</section>
	<section data-tag="dogs, big">Dog (brown, big, nice)</section>
	<section data-tag="horses">Horse (brown, nice)</section>
</section>
<section data-name="Black &amp; white">
	<section data-tag="cats">Cat (black &amp; white)</section>
	<section data-tag="dogs, small">Dog (black &amp; white + small)</section>
	<section data-tag="horses">Horse (black &amp; white)</section>
</section>
```

- [demo.html?n=brown](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html?n=brown)
- [demo.html?n=brown,black+%26+white](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html?n=brown,black+%26+white)

Names are matched case-insensitively, and are not split on spaces the way tags are: "black & white" is one name. Runs of whitespace inside a name are collapsed, so a stray double space in your markup still matches.

**A note on ampersands.** Write the character itself in your markup — `data-name="Black & white"`, or `data-name="Black &amp; white"` if you are writing HTML by hand and prefer the entity. What you must not do is write the entity in a template that escapes attribute values for you (pug, and most of the others): that produces `&amp;amp;` in the page, the attribute ends up reading "Black &amp; white" literally, and no parameter can match it. Tagteam warns on the console when it finds a tag or name in that state.

### Both at once

Each parameter filters on its own attribute, and both apply. In the markup above the names are on the stacks and the tags on the slides inside them, so this asks for black and white horses, and small black and white dogs:

- [demo.html?n=black+%26+white&t=horses,small+dogs](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html?n=black+%26+white&t=horses,small+dogs)

A section with both a name and a tag has to survive both parameters to be shown.

A *named* stack that ends up with all of its vertical slides hidden is hidden as well, so a filter does not leave an empty chapter behind. A stack without a `data-name` is not checked that way, and would stay as an empty stack.

### Groups

A group is a set of tags and/or names under one word. Each needs a name, and an array of `tags` and/or an array of `names`.

```javascript
Reveal.initialize({
	//...
	tagteam: {
		groups: {
			"brownpets": {
				names: ["brown"], tags: ["cats", "dogs"]
			},
			"bwhsd": {
				names: ["black & white"], tags: [ "horses", ["dogs", "small"] ]
			}
		}
	},
	plugins: [ Tagteam ]
});
```

A nested array inside `tags` is the equivalent of the plus sign in a URL parameter: `["dogs", "small"]` asks for sections that are both. So `?g=bwhsd` is the whole of the names-and-tags URL above:

- [demo.html?g=bwhsd](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo.html?g=bwhsd)

A `?g=` naming a group you have not defined hides every tagged and named section, rather than falling back to showing everything.

### Mandatory groups

With `mandatorygroup`, a `?g=` naming a group you defined is the only thing that shows the deck at all.

```javascript
Reveal.initialize({
	//...
	tagteam: {
		mandatorygroup: true,
		groups: {
			"brownpets": {
				names: ["brown"], tags: ["cats", "dogs"]
			}
		}
	},
	plugins: [ Tagteam ]
});
```

- [demo-mandatory.html?g=brownpets](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo-mandatory.html?g=brownpets) — a correct group, and the slides show
- [demo-mandatory.html?g=pinkpets](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo-mandatory.html?g=pinkpets) — an incorrect one, and only `data-mandatory` slides show

A `data-mandatory` section is the other way round from every other section: it is shown only in that fallback case, and hidden whenever the deck has something else to show. It is the place for a "this link is not valid" notice.

This is a simple safeguard. Anyone with a bit of HTML knowledge can find the valid group names.

### Always shown

`data-tag="keep"` leaves a section out of both filters, so it is shown whatever the parameter says — the title slide of the demo presentation, for one. The mandatorygroup safeguard is the exception, and hides it along with everything else that is not `data-mandatory`.

`keep` only matters in `mode: "select"`, and even there only for a section that also has a `data-tag` or a `data-name`. A section with neither is never judged by a parameter to begin with, so it is already always shown. In `mode: "unhide"` no parameter ever hides an ordinary marked section, so `keep` has nothing to protect it from.

`keep` has to be the whole of the attribute. `data-tag="keep, intro"` is an ordinary tagged section and is filtered like any other, so give a slide `keep` on its own or give it real tags, not both.


## `mode: "unhide"`

### Marking what starts out

Two ways, and you can mix them. In the markup, with Reveal's own attribute:

```html
<section data-name="The business" data-tag="business" data-visibility="hidden"> ... </section>
<section data-tag="nerdy" data-visibility="hidden"> ... </section>
```

Or by term, in one place:

```javascript
tagteam: {
	hide: { names: ["The business"], tags: ["nerdy"] }
}
```

Either way the section starts out of the presentation, and the term a parameter has to say to bring it back is the section's own `data-tag` or `data-name`. `hide` is named after the attribute because it does the same thing: it writes that hiding for you. In `mode: "select"` it does one thing more — it keeps those sections out of the filter, which the markup alone cannot.

### Saying what a parameter does

```javascript
Reveal.initialize({
	//...
	tagteam: {
		mode: "unhide"
	},
	plugins: [ Tagteam ]
});
```

`"unhide"` means a parameter never hides anything. It puts back what it names and leaves every other section exactly as it was — so a deck can use tags of its own without a parameter disturbing them, and a term that matches nothing changes nothing.

In this mode a parameter also reaches a section the deck authored `data-visibility="hidden"` itself, without that section being declared anywhere. Nothing is being filtered, so naming it simply unhides it.

`mandatorygroup` has nothing to withhold in this mode, so it is ignored, with a line on the console to say so.

### Or leave it on the default

Back in `mode: "select"`, `hide` still works. The sections it names start out, and a parameter naming one brings it back without filtering on that term, but every *other* marked section is still filtered by that same parameter. That is what you want when the deck filters on tags of its own as well.

A section the markup hides is treated differently there. It is an ordinary marked section, so a parameter naming it shows it *and* filters everything else. Use `hide` when you want the first without the second.

[Unhide demo](https://martinomagnifico.github.io/reveal.js-tagteam/demo/demo-unhide.html) — an ordinary talk with one chapter and one slide that only show up when the URL asks for them.

```html
<section data-name="The brew" data-tag="core,deep">
	<section>...</section>
	<section data-tag="nerdy">One slide for the specialists</section>
</section>

<section data-name="The business">
	...
</section>

<section data-name="Thanks" data-tag="core">
	...
</section>
```

```javascript
Reveal.initialize({
	//...
	tagteam: {
		hide: { names: ["The business"], tags: ["nerdy"] }
	},
	plugins: [ Tagteam ]
});
```

`hide` is spelled the same way a group is. Hide by `tags` when the material already has one, and by `names` when it does not — that is how you leave out a chapter with no tag at all. A bare array is the shorthand for tags, so `hide: ["nerdy"]` and `hide: { tags: ["nerdy"] }` are the same thing.

`deck.html` gives the short version. `deck.html?n=the+business` adds the chapter, and its entry in a Simplemenu menubar. A single slide inside an otherwise normal chapter works the same way, as `?t=nerdy`.

### Beside the filter

A hidden term is not a filter term, so it is taken out before the filter runs. Tagteam only filters when it is given something to filter by — no `?t=` means no filtering — and a parameter that names nothing but hidden terms means the same.

| URL | What happens |
|---|---|
| `deck.html` | The short version. |
| `?n=the+business` | Nothing is filtered, the chapter is switched on. |
| `?t=deep` | Ordinary filtering. The chapter stays out. |
| `?t=deep&n=the+business` | Filters on `deep` *and* switches the chapter on. |
| `?g=full` | Groups split the same way, so a group can do both at once. |

Each parameter works on its own attribute: `?t=` shows what you hid by tag, `?n=` what you hid by name. A hidden section is kept out of both filters, so the other one cannot reach it by accident. This happens last, after everything else is decided, so nothing can take back a section the URL asked for.

The two work differently on the slides inside a stack. Tags are inherited, so excluding a stack by tag also excludes every slide in it, and asking for the tag brings them all back. A name belongs to the stack alone, so excluding by name leaves the slides in it untouched. They come back with the stack, unless one of them has a tag that a filter in the same URL has hidden.

### By hand

You can put `data-visibility="hidden"` on the optional section yourself and leave `hide` unset. That much `hide` only saves you typing. The rest is what you miss: with nothing named in `hide`, a `?t=` hides every *other* tagged section, so a deck that also uses tags of its own would have to name all of them in the URL too.


## Configuration

There are a few options that you can change from the Reveal.js options. The values below are default and do not need to be set if they are not changed.

```javascript
Reveal.initialize({
	//...
	tagteam: {
		debug: false,
		mandatorygroup: false,
		mode: "select",
		hide: {},
		groups: {}
	},
	plugins: [ Tagteam ]
});
```

* **`debug`**: This option can show debug messages in the console.
* **`mandatorygroup`**: This option can set the mandatory use of groups.
* **`mode`**: How the deck behaves. `"select"` filters down: a parameter picks what is shown and hides every other marked section. `"unhide"` reveals up: a parameter shows what it names and leaves the rest alone. It does not decide what starts out; the markup and `hide` do that.
* **`hide`**: The tags and names whose sections start out of the presentation until a URL parameter asks for them: `{ tags: [], names: [] }`, or a bare array as shorthand for tags. The same as writing `data-visibility="hidden"` on each of them.
* **`groups`**: Your predefined groups. Empty by default.


## Like it?

If you like it, please star this repo!

And if you want to show off what you made with it, please do :-)


## License

MIT licensed

Copyright (C) 2021 Martijn De Jongh (Martino)
