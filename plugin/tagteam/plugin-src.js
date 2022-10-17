const Plugin = () => {

	const tagteam = function (deck, options) {

		const debugLog = function (text) {
			if (options.debug) console.log(text);
		}

		const getParams = () => {
			let url = new URL(window.location);
			let urlparams = new URLSearchParams(url.search);

			let t = urlparams.get('t');
			let n = urlparams.get('n');
			let g = urlparams.get('g');

			return {
				t,n,g
			}
		};

		const arrayFromString = (string) => {
			let newArray = [];
			let arrayItems = string.split(',').map((item) => item.trim());

			arrayItems.forEach((arrayItem) => {
				if (arrayItem.indexOf(' ') >= 0) {
					let arrayItemWithSpace = arrayItem.split(' ');
					newArray.push(arrayItemWithSpace);
				} else {
					newArray.push(arrayItem);
				}
			});
			return newArray
		}

		const arrayFromNameString = (string) => {
			let newArray = [];
			let arrayItems = string.split(',').map((item) => item.trim());

			arrayItems.forEach((arrayItem) => {
				newArray.push(arrayItem);
			});
			return newArray
		}

		const isInArray = (arr, item) => {
			let contains = arr.some(ele => {
				if ((item.indexOf(ele) >= 0) || (Array.isArray(ele) && ele.every(elem => item.includes(elem)))) {
					return true
				}
			});
			return contains;
		}

		const hideElement = (section) => {
			section.setAttribute('data-visibility', 'hidden');
		}
		const showElement = (section) => {
			// When an element needs to be shown, but had data-visibility set to hidden
			section.setAttribute('data-visibility', 'visible');
			// Or when its parent is set to hidden, show it if there is no n set
			if (!getParams().n && !options.groups.names) {
				section.parentNode.setAttribute('data-visibility', 'visible');
			}
		}

		const hideItems = (elems, elementsToShowArray, kind) => {

			elems.forEach(elem => {

				let sectionArray = [];

				if (kind === 'tags' && elem.dataset.tag) {
					sectionArray = elem.dataset.tag.trim().split(/\s*,\s*/);

					if (elem.parentNode.dataset.tag) {
						let parentArray = elem.parentNode.dataset.tag.trim().split(/\s*,\s*/);
						sectionArray = sectionArray.concat(parentArray);
					}
				}

				if (kind === 'names') {
					let nameName = elem.dataset.name ? elem.dataset.name.toLowerCase() : elem.getAttribute(name).toLowerCase();
					if (nameName) {
						sectionArray = nameName.trim().split(/\s*,\s*/);
					}
				}

				if (!isInArray(elementsToShowArray, sectionArray)) {
					hideElement(elem);
				} else {
					showElement(elem);
				}

			});
		}

		const checkSections = () => {

			let allSections = deck.getRevealElement().querySelectorAll("section:not([data-mandatory])");
			let taggedSections = deck.getRevealElement().querySelectorAll("section[data-tag]:not([data-tag=keep])");
			let namedSections = deck.getRevealElement().querySelectorAll("section[data-name]:not([data-tag=keep])");
			let mandatorySections = deck.getRevealElement().querySelectorAll("section[data-mandatory]");

			let tagsToShow = getParams().t;
			let namesToShow = getParams().n;
			let groupsToShow = getParams().g;
			let groups = options.groups;

			if (options.mandatorygroup) {
				if (!(groupsToShow in groups)) {
					hideItems(allSections, [], '');
				} else if (mandatorySections) {
					hideItems(mandatorySections, [], '');
				}
			} else if (mandatorySections) {
				hideItems(mandatorySections, [], 'mnd');
			}

			if (groupsToShow) {

				if (groupsToShow in groups) {

					let groupTagsToShow = groups[groupsToShow].tags;
					let groupNamesToShow = groups[groupsToShow].names;

					if (!groupTagsToShow && !groupNamesToShow) {
						console.log("Please set a 'tags' or an 'names' object in this group.")
					}

					if (groupTagsToShow) {
						debugLog(`Group tags to show: ${JSON.stringify(groupTagsToShow)}`);
						hideItems(taggedSections, groupTagsToShow, 'tags');
					}
					if (groupNamesToShow) {
						debugLog(`Group names to show: ${JSON.stringify(groupNamesToShow)}`);
						hideItems(namedSections, groupNamesToShow, 'names');
					}
				} else {
					hideItems(taggedSections, [], '');
					hideItems(namedSections, [], '');
				}

			} else if (!options.mandatorygroup) {

				if (taggedSections && tagsToShow) {

					let tagsToShowArray = arrayFromString(tagsToShow);
					debugLog(`URL Tag parameters: ${JSON.stringify(tagsToShowArray)}`);
					hideItems(taggedSections, tagsToShowArray, 'tags');
				}
				if (namedSections && namesToShow) {
					let namesToShowArray = arrayFromNameString(namesToShow);
					debugLog(`URL Names parameters: ${JSON.stringify(namesToShowArray)}`);
					hideItems(namedSections, namesToShowArray, 'names');
				}
			}

			if (namedSections) {
				namedSections.forEach(namedSection => {

					if (namedSection.dataset.visibility != "hidden") {

						let parentVisible = false;

						if (namedSection.hasChildNodes()) {

							[].forEach.call(namedSection.children, function(child) {
								if (child.dataset.visibility != "hidden") {
									parentVisible = true;
								}
							});
						}

						if (parentVisible != true) {
							hideElement(namedSection)
						}

					}
				});
			}
		}
		checkSections();
	};

	const init = function (deck) {

		let defaultOptions = {
			debug: false,
			mandatorygroup: false,
			groups: {
				"pets": {
					t: ["cats", "dogs"],
					n: ["red"]
				}
			}
		};

		const defaults = function (options, defaultOptions) {
			for (let i in defaultOptions) {
				if (!options.hasOwnProperty(i)) {
					options[i] = defaultOptions[i];
				}
			}
		}

		let options = deck.getConfig().tagteam || {};

		defaults(options, defaultOptions);
		tagteam(deck, options);
	};

	return {
		id: 'tagteam',
		init: init
	};
};

export default Plugin;