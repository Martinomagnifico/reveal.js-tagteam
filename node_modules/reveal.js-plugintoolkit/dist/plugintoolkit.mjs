import e from "deepmerge";
//#region \0rolldown/runtime.js
var t = Object.defineProperty, n = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, r = [
	".js",
	".min.js",
	".mjs"
], i = (() => {
	let e = import.meta;
	if (typeof e?.url == "string" && e.url !== "") return e.url;
	let t = typeof document < "u" ? document.currentScript : null;
	return t && "src" in t && t.src ? t.src : "";
})(), a = (e) => {
	let t = e.lastIndexOf("/");
	return t === -1 ? "" : e.slice(0, t + 1);
}, o = (e) => {
	let t = e.split(/[?#]/)[0];
	return t.slice(t.lastIndexOf("/") + 1);
}, s = (e, t) => r.some((n) => e === `${t}${n}`), c = [
	/\/@fs\//,
	/\/@id\//,
	/\/\.vite\/deps\//,
	/[?&][vt]=/
], l = (e) => c.some((t) => t.test(e)), u = (e) => {
	if (typeof document < "u") {
		let t = r.map((t) => `script[src$="${e}${t}"]`).join(", "), n = document.querySelector(t)?.getAttribute("src");
		if (n) return { directory: a(n) };
	}
	return i && !l(i) && s(o(i), e) ? { directory: a(i) } : { directory: null };
}, d = (e) => u(e).directory !== null, f = /* @__PURE__ */ new Map(), ee = (e = "") => {
	let t = f.get(e);
	if (t) return t;
	let n = typeof window < "u", r = typeof document < "u", i = import.meta, a = !1;
	try {
		a = typeof module < "u" && !!module?.hot;
	} catch {}
	let o = !1;
	try {
		o = !!i?.hot;
	} catch {}
	let s = a || o, c = !1;
	try {
		c = i?.env?.DEV === !0;
	} catch {}
	let l = e !== "" && d(e), u = {
		hasResolvableSource: l,
		hasWindow: n,
		hasDocument: r,
		isBundled: !l,
		isDevelopment: s || c,
		hasHMR: s,
		isViteDev: c
	};
	return f.set(e, u), u;
}, te = class {
	defaultConfig;
	pluginInit;
	pluginId;
	mergedConfig = null;
	userConfigData = null;
	data = {};
	constructor(e, t, n) {
		typeof e == "string" ? (this.pluginId = e, this.pluginInit = t, this.defaultConfig = n || {}) : (this.pluginId = e.id, this.pluginInit = e.init, this.defaultConfig = e.defaultConfig || {});
	}
	initializeConfig(t) {
		let n = this.defaultConfig, r = t.getConfig()[this.pluginId] || {};
		this.userConfigData = r, this.mergedConfig = e(n, r, {
			arrayMerge: (e, t) => t,
			clone: !0
		});
	}
	getCurrentConfig() {
		if (!this.mergedConfig) throw Error("Plugin configuration has not been initialized");
		return this.mergedConfig;
	}
	getData() {
		return Object.keys(this.data).length > 0 ? this.data : void 0;
	}
	get userConfig() {
		return this.userConfigData || {};
	}
	getEnvironmentInfo = () => ee(this.pluginId);
	init(e) {
		if (this.initializeConfig(e), this.pluginInit) return this.pluginInit(this, e, this.getCurrentConfig());
	}
	createInterface(e = {}) {
		return {
			id: this.pluginId,
			init: (e) => this.init(e),
			getConfig: () => this.getCurrentConfig(),
			getData: () => this.getData(),
			...e
		};
	}
}, p = "data-css-id", m = (e, t) => new Promise((n, r) => {
	let i = document.createElement("link");
	i.rel = "stylesheet", i.href = t, i.setAttribute(p, e);
	let a = setTimeout(() => {
		i.parentNode && i.parentNode.removeChild(i), r(/* @__PURE__ */ Error(`[${e}] Timeout loading CSS from: ${t}`));
	}, 5e3);
	i.onload = () => {
		clearTimeout(a), n();
	}, i.onerror = () => {
		clearTimeout(a), i.parentNode && i.parentNode.removeChild(i), r(/* @__PURE__ */ Error(`[${e}] Failed to load CSS from: ${t}`));
	}, document.head.appendChild(i);
}), ne = (e) => document.querySelectorAll(`[${p}="${e}"]`).length > 0, re = 1e4, ie = (e) => Promise.resolve(g(e)), h = (e) => new Promise((t) => {
	if (g(e)) return t(!0);
	if (typeof MutationObserver > "u") return t(!1);
	let n = !1, r = (e) => {
		n || (n = !0, i.disconnect(), clearTimeout(o), window.removeEventListener("load", a), t(e));
	}, i = new MutationObserver(() => {
		g(e) && r(!0);
	});
	i.observe(document.documentElement, {
		childList: !0,
		subtree: !0,
		attributeFilter: ["href", "rel"]
	});
	let a = () => requestAnimationFrame(() => r(g(e)));
	document.readyState === "complete" ? a() : window.addEventListener("load", a, { once: !0 });
	let o = setTimeout(() => r(g(e)), re);
}), g = (e) => {
	if (ne(e)) return !0;
	try {
		return window.getComputedStyle(document.documentElement).getPropertyValue(`--cssimported-${e}`).trim() !== "";
	} catch {
		return !1;
	}
}, ae = "--r-main-color", _ = () => {
	if (typeof document > "u" || typeof window > "u") return !1;
	try {
		return getComputedStyle(document.documentElement).getPropertyValue(ae).trim() !== "";
	} catch {
		return !1;
	}
}, v = (e = 1e3) => _() ? Promise.resolve(!0) : new Promise((t) => {
	let n = Date.now() + e, r = () => {
		if (_()) {
			t(!0);
			return;
		}
		if (Date.now() >= n) {
			t(!1);
			return;
		}
		setTimeout(r, 16);
	};
	r();
}), y = () => _(), b = ((e) => new Proxy(e, { get: (e, t) => {
	if (t in e) return e[t];
	let n = t.toString();
	if (typeof console[n] == "function") return (...t) => {
		e.debugLog(n, ...t);
	};
} }))(new class {
	debugMode = !1;
	label = "DEBUG";
	groupDepth = 0;
	initialize(e, t = "DEBUG") {
		this.debugMode = e, this.label = t;
	}
	group = (...e) => {
		this.debugLog("group", ...e), this.groupDepth++;
	};
	groupCollapsed = (...e) => {
		this.debugLog("groupCollapsed", ...e), this.groupDepth++;
	};
	groupEnd = () => {
		this.groupDepth > 0 && (this.groupDepth--, this.debugLog("groupEnd"));
	};
	error = (...e) => {
		let t = this.debugMode;
		this.debugMode = !0, this.formatAndLog(console.error, e), this.debugMode = t;
	};
	table = (e, t, n) => {
		if (this.debugMode) try {
			typeof e == "string" && t !== void 0 && typeof t != "string" ? (this.groupDepth === 0 ? console.log(`[${this.label}]: ${e}`) : console.log(e), n ? console.table(t, n) : console.table(t)) : (this.groupDepth === 0 && console.log(`[${this.label}]: Table data`), typeof t == "object" && Array.isArray(t) ? console.table(e, t) : console.table(e));
		} catch (t) {
			console.error(`[${this.label}]: Error showing table:`, t), console.log(`[${this.label}]: Raw data:`, e);
		}
	};
	formatAndLog = (e, t) => {
		if (this.debugMode) try {
			this.groupDepth > 0 ? e.call(console, ...t) : t.length > 0 && typeof t[0] == "string" ? e.call(console, `[${this.label}]: ${t[0]}`, ...t.slice(1)) : e.call(console, `[${this.label}]:`, ...t);
		} catch (e) {
			console.error(`[${this.label}]: Error in logging:`, e), console.log(`[${this.label}]: Original log data:`, ...t);
		}
	};
	debugLog(e, ...t) {
		let n = console[e];
		if (!this.debugMode && e !== "error" || typeof n != "function") return;
		let r = n;
		if (e === "group" || e === "groupCollapsed") {
			t.length > 0 && typeof t[0] == "string" ? r.call(console, `[${this.label}]: ${t[0]}`, ...t.slice(1)) : r.call(console, `[${this.label}]:`, ...t);
			return;
		}
		if (e === "groupEnd") {
			r.call(console);
			return;
		}
		if (e === "table") {
			t.length === 1 ? this.table(t[0]) : t.length === 2 ? (t[0], this.table(t[0], t[1])) : t.length >= 3 && this.table(t[0], t[1], t[2]);
			return;
		}
		this.groupDepth > 0 ? r.call(console, ...t) : t.length > 0 && typeof t[0] == "string" ? r.call(console, `[${this.label}]: ${t[0]}`, ...t.slice(1)) : r.call(console, `[${this.label}]:`, ...t);
	}
}()), x = /* @__PURE__ */ new Set(), S = (e, t) => {
	let n = `${e}::${t}`;
	x.has(n) || (x.add(n), console.warn(`[${e}] ${t}`));
}, C = (e) => [`dist/plugin/${e}/${e}.css`, `plugin/${e}/${e}.css`], w = (e) => typeof e == "string" && e.trim() !== "", T = async (e, t) => {
	let { cssautoload: n, csspath: r, debug: i = !1 } = t;
	if (n === !1 || r === !1) return i && console.log(`[${e}] CSS loading is switched off`), { status: "skipped" };
	if (w(r)) {
		let t = r.trim(), n = g(e), a = n && !!document.querySelector(`[data-css-id="${e}"]`);
		try {
			return await m(e, t), i && console.log(`[${e}] CSS loaded from: ${t}`), n && S(e, `Loaded CSS from ${t}, but a stylesheet for this plugin was already on the page (${a ? "a tagged <link>" : "an import or inline <style>"}) — csspath adds one, it cannot remove one. Both are live and the cascade decides. Remove the other import or <link>, or drop csspath.`), {
				status: "loaded",
				path: t
			};
		} catch {
			return console.warn(`[${e}] Could not load CSS from: ${t}`), {
				status: "failed",
				path: t
			};
		}
	}
	if (g(e)) return i && console.log(`[${e}] CSS is already imported, skipping`), { status: "present" };
	let { directory: a } = u(e);
	if (a !== null || n === !0) {
		let t = [...a === null ? [] : [`${a}${e}.css`], ...C(e)].filter((e, t, n) => n.indexOf(e) === t);
		for (let n of t) try {
			return await m(e, n), i && console.log(`[${e}] CSS loaded from: ${n}`), {
				status: "loaded",
				path: n
			};
		} catch {
			i && console.log(`[${e}] No CSS at: ${n}`);
		}
		return console.warn(`[${e}] Could not load CSS. Tried: ${t.join(", ")}. Import the stylesheet yourself, or set csspath to where it is.`), { status: "failed" };
	}
	return h(e).then((t) => {
		t || S(e, `CSS could not be autoloaded here, because the plugin is part of a bundle. Import it once in your own code: import 'reveal.js-${e}/${e}.css'`);
	}), { status: "advised" };
};
async function E(e, t) {
	if ("getEnvironmentInfo" in e && t) {
		let n = e, r = n.userConfig, i = "cssautoload" in r && r.cssautoload !== "auto" ? t.cssautoload : void 0;
		return T(n.pluginId, {
			...t,
			cssautoload: i
		});
	}
	let { id: n, cssautoload: r, csspath: i, debug: a } = e;
	return T(n, {
		cssautoload: r === "auto" ? void 0 : r,
		csspath: i,
		debug: a
	});
}
//#endregion
//#region src/utils/plugin-tools/event-tools.ts
var oe = /* @__PURE__ */ n({
	addDirectionEvents: () => A,
	addMoreDirectionEvents: () => j,
	addScrollModeEvents: () => M
}), D = Symbol.for("reveal.js-plugintoolkit.directionEvents"), O = Symbol.for("reveal.js-plugintoolkit.scrollModeEvents"), k = (e, t, n) => {
	Object.defineProperty(e, t, {
		value: n,
		configurable: !0,
		enumerable: !1,
		writable: !1
	});
}, A = (e) => {
	if (e[D]) return;
	let [t, n] = [0, 0];
	e.on("slidechanged", (r) => {
		let { indexh: i, indexv: a, previousSlide: o, currentSlide: s } = r;
		i !== t && e.dispatchEvent({
			type: "slidechanged-h",
			data: {
				previousSlide: o,
				currentSlide: s,
				indexh: i,
				indexv: a
			}
		}), a !== n && i === t && e.dispatchEvent({
			type: "slidechanged-v",
			data: {
				previousSlide: o,
				currentSlide: s,
				indexh: i,
				indexv: a
			}
		}), [t, n] = [i, a];
	}), k(e, D, !0);
}, j = A, M = (e) => {
	if (e[O]) return () => {};
	let t = e.getViewportElement();
	if (!t) return console.warn("[plugintoolkit]: Could not find viewport element"), () => {};
	let n = () => t.classList.contains("reveal-scroll"), r = n(), i = new MutationObserver(() => {
		let t = n();
		if (t !== r) {
			let n = e.getCurrentSlide(), { h: i, v: a } = e.getIndices();
			e.dispatchEvent({
				type: t ? "scrollmode-enter" : "scrollmode-exit",
				data: {
					currentSlide: n,
					previousSlide: null,
					indexh: i,
					indexv: a
				}
			}), r = t;
		}
	});
	i.observe(t, {
		attributes: !0,
		attributeFilter: ["class"]
	});
	let a = () => {
		i.disconnect(), delete e[O];
	};
	return k(e, O, a), a;
}, se = /* @__PURE__ */ n({
	SectionType: () => ce,
	getSectionType: () => R,
	getStack: () => L,
	isHorizontal: () => I,
	isSection: () => N,
	isStack: () => P,
	isVertical: () => F
}), ce = /* @__PURE__ */ function(e) {
	return e.HORIZONTAL = "horizontal", e.STACK = "stack", e.VERTICAL = "vertical", e.INVALID = "invalid", e;
}({}), N = (e) => e instanceof HTMLElement && e.tagName === "SECTION", P = (e) => N(e) ? Array.from(e.children).some((e) => e instanceof HTMLElement && e.tagName === "SECTION") : !1, F = (e) => N(e) ? e.parentElement instanceof HTMLElement && e.parentElement.tagName === "SECTION" : !1, I = (e) => N(e) && !F(e) && !P(e), L = (e) => {
	if (!N(e)) return null;
	if (F(e)) {
		let t = e.parentElement;
		if (t instanceof HTMLElement && P(t)) return t;
	}
	return null;
}, R = (e) => N(e) ? F(e) ? "vertical" : P(e) ? "stack" : "horizontal" : "invalid", z = /* @__PURE__ */ n({
	isJSON: () => B,
	toJSONString: () => V
}), B = (e) => {
	try {
		return JSON.parse(e) && !!e;
	} catch {
		return !1;
	}
}, V = (e) => {
	if (e == null) return "";
	let t = e;
	if (typeof t == "string" && (t = t.replace(/[“”]/g, "\"").replace(/[‘’]/g, "'")), B(e)) return e;
	if (typeof e == "object") return JSON.stringify(e, null, 2);
	if (typeof e == "string") {
		let t = e.trim().replace(/'/g, "\"");
		return t.charAt(0) === "{" ? t : `{${t}}`;
	}
	return "";
}, H = /* @__PURE__ */ n({
	copyDataAttributes: () => U,
	createNode: () => W
}), U = (e, t, n) => {
	for (let r of Array.from(e.attributes)) r.nodeName.startsWith("data") && (!n || r.nodeName !== n) && t.setAttribute(r.nodeName, r.nodeValue || "");
}, W = (e) => document.createRange().createContextualFragment(e).firstElementChild, le = /* @__PURE__ */ n({ sanitizeText: () => G }), G = (e) => e.toLowerCase().replace(/\s+/g, "").replace(/[^\p{L}\p{N}-]/gu, ""), ue = /* @__PURE__ */ n({ addThemeColor: () => $ }), K = Symbol.for("reveal.js-plugintoolkit.themeColor"), q = "has-light-background", J = "has-dark-background", de = "--c-theme-color", fe = "--c-theme-heading-color", pe = {
	text: "section",
	heading: "h1"
}, me = "c-theme-inverted", he = "reveal-scroll", ge = "stack", Y = (e, t, n) => {
	Object.defineProperty(e, t, {
		value: n,
		configurable: !0,
		enumerable: !1,
		writable: !1
	});
}, _e = (e) => {
	let t = e.getElementsByClassName("slides")[0];
	if (!t) return null;
	let n = document.createElement("section"), r = document.createElement(pe.heading);
	n.appendChild(r), t.appendChild(n);
	let i = () => ({
		text: getComputedStyle(n).getPropertyValue("color"),
		heading: getComputedStyle(r).getPropertyValue("color")
	}), a = i();
	n.classList.add(q);
	let o = i(), s = "dark";
	return o.text === a.text && o.heading === a.heading && (s = "light", n.classList.remove(q), n.classList.add(J), o = i()), n.remove(), {
		theme: s,
		text: {
			regular: a.text,
			inverse: o.text
		},
		heading: {
			regular: a.heading,
			inverse: o.heading
		}
	};
}, X = (e, t) => e?.classList.contains(t) ?? !1, ve = (e, t, n) => {
	let r = X(n, he) ? n : t;
	if (X(r, q)) return "light";
	if (X(r, J)) return "dark";
	let i = e.getCurrentSlide?.()?.parentElement ?? null;
	if (i && X(i, ge)) {
		if (X(i, q)) return "light";
		if (X(i, J)) return "dark";
	}
	return null;
}, Z = (e, t, n) => {
	let r = ve(e, t, e.getViewportElement());
	return n.theme === "dark" ? r === "light" : r === "dark";
}, Q = (e, t, n) => {
	let r = (e) => n ? e.inverse : e.regular;
	e.style.setProperty(de, r(t.text)), e.style.setProperty(fe, r(t.heading)), e.classList.toggle(me, n);
}, ye = async (e, { timeout: t = 1e3 }) => {
	let n = e.getRevealElement();
	if (!n) return null;
	let r = e.getViewportElement() ?? n;
	await v(t);
	let i = _e(n);
	if (!i) return null;
	let a = Z(e, n, i);
	Q(r, i, a);
	let o = () => {
		let t = Z(e, n, i);
		t !== a && (a = t, Q(r, i, t));
	}, s = new MutationObserver(o);
	return s.observe(n, {
		attributes: !0,
		attributeFilter: ["class"]
	}), r !== n && s.observe(r, {
		attributes: !0,
		attributeFilter: ["class"]
	}), e.on("slidechanged", o), i;
}, $ = (e, t = {}) => {
	let n = e[K];
	if (n) return n;
	let r = ye(e, t);
	return Y(e, K, r), r;
}, be = /* @__PURE__ */ n({
	addDirectionEvents: () => A,
	addMoreDirectionEvents: () => j,
	addScrollModeEvents: () => M,
	addThemeColor: () => $,
	copyDataAttributes: () => U,
	createNode: () => W,
	getSectionType: () => R,
	getStack: () => L,
	isHorizontal: () => I,
	isJSON: () => B,
	isSection: () => N,
	isStack: () => P,
	isVertical: () => F,
	sanitizeText: () => G,
	toJSONString: () => V
});
//#endregion
export { te as PluginBase, g as checkCssImported, z as configTools, H as domTools, oe as eventTools, u as findPluginSource, d as hasResolvableSource, ie as isCssImported, y as isThemeApplied, E as pluginCSS, b as pluginDebug, be as pluginTools, se as sectionTools, le as textTools, ue as themeTools, S as warnOnce, h as whenCssImported, v as whenThemeApplied };
