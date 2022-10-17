
/*****************************************************************
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/Martinomagnifico
 *
 * Tagteam.js for Reveal.js 
 * Version 1.0.1
 * 
 * @license 
 * MIT licensed
 *
 * Thanks to:
 *  - Hakim El Hattab, Reveal.js 
 ******************************************************************/


var Plugin = function Plugin() {
  var tagteam = function tagteam(deck, options) {
    var debugLog = function debugLog(text) {
      if (options.debug) console.log(text);
    };

    var getParams = function getParams() {
      var url = new URL(window.location);
      var urlparams = new URLSearchParams(url.search);
      var t = urlparams.get('t');
      var n = urlparams.get('n');
      var g = urlparams.get('g');
      return {
        t: t,
        n: n,
        g: g
      };
    };

    var arrayFromString = function arrayFromString(string) {
      var newArray = [];
      var arrayItems = string.split(',').map(function (item) {
        return item.trim();
      });
      arrayItems.forEach(function (arrayItem) {
        if (arrayItem.indexOf(' ') >= 0) {
          var arrayItemWithSpace = arrayItem.split(' ');
          newArray.push(arrayItemWithSpace);
        } else {
          newArray.push(arrayItem);
        }
      });
      return newArray;
    };

    var arrayFromNameString = function arrayFromNameString(string) {
      var newArray = [];
      var arrayItems = string.split(',').map(function (item) {
        return item.trim();
      });
      arrayItems.forEach(function (arrayItem) {
        newArray.push(arrayItem);
      });
      return newArray;
    };

    var isInArray = function isInArray(arr, item) {
      var contains = arr.some(function (ele) {
        if (item.indexOf(ele) >= 0 || Array.isArray(ele) && ele.every(function (elem) {
          return item.includes(elem);
        })) {
          return true;
        }
      });
      return contains;
    };

    var hideElement = function hideElement(section) {
      section.setAttribute('data-visibility', 'hidden');
    };

    var showElement = function showElement(section) {
      // When an element needs to be shown, but had data-visibility set to hidden
      section.setAttribute('data-visibility', 'visible'); // Or when its parent is set to hidden, show it if there is no n set

      if (!getParams().n && !options.groups.names) {
        section.parentNode.setAttribute('data-visibility', 'visible');
      }
    };

    var hideItems = function hideItems(elems, elementsToShowArray, kind) {
      elems.forEach(function (elem) {
        var sectionArray = [];

        if (kind === 'tags' && elem.dataset.tag) {
          sectionArray = elem.dataset.tag.trim().split(/\s*,\s*/);

          if (elem.parentNode.dataset.tag) {
            var parentArray = elem.parentNode.dataset.tag.trim().split(/\s*,\s*/);
            sectionArray = sectionArray.concat(parentArray);
          }
        }

        if (kind === 'names') {
          var nameName = elem.dataset.name ? elem.dataset.name.toLowerCase() : elem.getAttribute(name).toLowerCase();

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
    };

    var checkSections = function checkSections() {
      var allSections = deck.getRevealElement().querySelectorAll("section:not([data-mandatory])");
      var taggedSections = deck.getRevealElement().querySelectorAll("section[data-tag]:not([data-tag=keep])");
      var namedSections = deck.getRevealElement().querySelectorAll("section[data-name]:not([data-tag=keep])");
      var mandatorySections = deck.getRevealElement().querySelectorAll("section[data-mandatory]");
      var tagsToShow = getParams().t;
      var namesToShow = getParams().n;
      var groupsToShow = getParams().g;
      var groups = options.groups;

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
          var groupTagsToShow = groups[groupsToShow].tags;
          var groupNamesToShow = groups[groupsToShow].names;

          if (!groupTagsToShow && !groupNamesToShow) {
            console.log("Please set a 'tags' or an 'names' object in this group.");
          }

          if (groupTagsToShow) {
            debugLog("Group tags to show: ".concat(JSON.stringify(groupTagsToShow)));
            hideItems(taggedSections, groupTagsToShow, 'tags');
          }

          if (groupNamesToShow) {
            debugLog("Group names to show: ".concat(JSON.stringify(groupNamesToShow)));
            hideItems(namedSections, groupNamesToShow, 'names');
          }
        } else {
          hideItems(taggedSections, [], '');
          hideItems(namedSections, [], '');
        }
      } else if (!options.mandatorygroup) {
        if (taggedSections && tagsToShow) {
          var tagsToShowArray = arrayFromString(tagsToShow);
          debugLog("URL Tag parameters: ".concat(JSON.stringify(tagsToShowArray)));
          hideItems(taggedSections, tagsToShowArray, 'tags');
        }

        if (namedSections && namesToShow) {
          var namesToShowArray = arrayFromNameString(namesToShow);
          debugLog("URL Names parameters: ".concat(JSON.stringify(namesToShowArray)));
          hideItems(namedSections, namesToShowArray, 'names');
        }
      }

      if (namedSections) {
        namedSections.forEach(function (namedSection) {
          if (namedSection.dataset.visibility != "hidden") {
            var parentVisible = false;

            if (namedSection.hasChildNodes()) {
              [].forEach.call(namedSection.children, function (child) {
                if (child.dataset.visibility != "hidden") {
                  parentVisible = true;
                }
              });
            }

            if (parentVisible != true) {
              hideElement(namedSection);
            }
          }
        });
      }
    };

    checkSections();
  };

  var init = function init(deck) {
    var defaultOptions = {
      debug: false,
      mandatorygroup: false,
      groups: {
        "pets": {
          t: ["cats", "dogs"],
          n: ["red"]
        }
      }
    };

    var defaults = function defaults(options, defaultOptions) {
      for (var i in defaultOptions) {
        if (!options.hasOwnProperty(i)) {
          options[i] = defaultOptions[i];
        }
      }
    };

    var options = deck.getConfig().tagteam || {};
    defaults(options, defaultOptions);
    tagteam(deck, options);
  };

  return {
    id: 'tagteam',
    init: init
  };
};

export { Plugin as default };
