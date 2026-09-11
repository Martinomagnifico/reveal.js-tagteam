 /*****************************************************************
 *
 * reveal.js-tagteam for Reveal.js 
 * Version 2.0.0
 * 
 * @link
 * https://github.com/martinomagnifico/reveal.js-tagteam
 * 
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/martinomagnifico
 *
 * @license 
 * MIT
 * 
 * Copyright (C) 2026 Martijn De Jongh (Martino)
 *
 ******************************************************************/


//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = /* @__PURE__ */ ((n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)))((/* @__PURE__ */ o(((e, t) => {
	var n = function(e) {
		return r(e) && !i(e);
	};
	function r(e) {
		return !!e && typeof e == "object";
	}
	function i(e) {
		var t = Object.prototype.toString.call(e);
		return t === "[object RegExp]" || t === "[object Date]" || o(e);
	}
	var a = typeof Symbol == "function" && Symbol.for ? Symbol.for("react.element") : 60103;
	function o(e) {
		return e.$$typeof === a;
	}
	function s(e) {
		return Array.isArray(e) ? [] : {};
	}
	function c(e, t) {
		return t.clone !== !1 && t.isMergeableObject(e) ? g(s(e), e, t) : e;
	}
	function l(e, t, n) {
		return e.concat(t).map(function(e) {
			return c(e, n);
		});
	}
	function u(e, t) {
		if (!t.customMerge) return g;
		var n = t.customMerge(e);
		return typeof n == "function" ? n : g;
	}
	function d(e) {
		return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e).filter(function(t) {
			return Object.propertyIsEnumerable.call(e, t);
		}) : [];
	}
	function f(e) {
		return Object.keys(e).concat(d(e));
	}
	function p(e, t) {
		try {
			return t in e;
		} catch {
			return !1;
		}
	}
	function m(e, t) {
		return p(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
	}
	function h(e, t, n) {
		var r = {};
		return n.isMergeableObject(e) && f(e).forEach(function(t) {
			r[t] = c(e[t], n);
		}), f(t).forEach(function(i) {
			m(e, i) || (r[i] = p(e, i) && n.isMergeableObject(t[i]) ? u(i, n)(e[i], t[i], n) : c(t[i], n));
		}), r;
	}
	function g(e, t, r) {
		r ||= {}, r.arrayMerge = r.arrayMerge || l, r.isMergeableObject = r.isMergeableObject || n, r.cloneUnlessOtherwiseSpecified = c;
		var i = Array.isArray(t);
		return i === Array.isArray(e) ? i ? r.arrayMerge(e, t, r) : h(e, t, r) : c(t, r);
	}
	g.all = function(e, t) {
		if (!Array.isArray(e)) throw Error("first argument should be an array");
		return e.reduce(function(e, n) {
			return g(e, n, t);
		}, {});
	}, t.exports = g;
})))(), 1), l = Object.defineProperty, u = (e, t) => {
	let n = {};
	for (var r in e) l(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || l(n, Symbol.toStringTag, { value: "Module" }), n;
}, d = [
	".js",
	".min.js",
	".mjs"
], f = (() => {
	let e = import.meta;
	if (typeof e?.url == "string" && e.url !== "") return e.url;
	let t = typeof document < "u" ? document.currentScript : null;
	return t && "src" in t && t.src ? t.src : "";
})(), p = (e) => {
	let t = e.lastIndexOf("/");
	return t === -1 ? "" : e.slice(0, t + 1);
}, m = (e) => {
	let t = e.split(/[?#]/)[0];
	return t.slice(t.lastIndexOf("/") + 1);
}, h = (e, t) => d.some((n) => e === `${t}${n}`), g = [
	/\/@fs\//,
	/\/@id\//,
	/\/\.vite\/deps\//,
	/[?&][vt]=/
], _ = (e) => g.some((t) => t.test(e)), v = (e) => {
	if (typeof document < "u") {
		let t = d.map((t) => `script[src$="${e}${t}"]`).join(", "), n = document.querySelector(t)?.getAttribute("src");
		if (n) return { directory: p(n) };
	}
	return f && !_(f) && h(m(f), e) ? { directory: p(f) } : { directory: null };
}, y = (e) => v(e).directory !== null, b = /* @__PURE__ */ new Map(), ee = (e = "") => {
	let t = b.get(e);
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
	let l = e !== "" && y(e), u = {
		hasResolvableSource: l,
		hasWindow: n,
		hasDocument: r,
		isBundled: !l,
		isDevelopment: s || c,
		hasHMR: s,
		isViteDev: c
	};
	return b.set(e, u), u;
}, x = class {
	defaultConfig;
	pluginInit;
	pluginId;
	mergedConfig = null;
	userConfigData = null;
	data = {};
	constructor(e, t, n) {
		typeof e == "string" ? (this.pluginId = e, this.pluginInit = t, this.defaultConfig = n || {}) : (this.pluginId = e.id, this.pluginInit = e.init, this.defaultConfig = e.defaultConfig || {});
	}
	initializeConfig(e) {
		let t = this.defaultConfig, n = e.getConfig()[this.pluginId] || {};
		this.userConfigData = n, this.mergedConfig = (0, c.default)(t, n, {
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
}, S = ((e) => new Proxy(e, { get: (e, t) => {
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
}()), C = /* @__PURE__ */ new Set(), w = (e, t) => {
	let n = `${e}::${t}`;
	C.has(n) || (C.add(n), console.warn(`[${e}] ${t}`));
}, T = /* @__PURE__ */ u({
	SectionType: () => E,
	getSectionType: () => M,
	getStack: () => j,
	isHorizontal: () => A,
	isSection: () => D,
	isStack: () => O,
	isVertical: () => k
}), E = /* @__PURE__ */ function(e) {
	return e.HORIZONTAL = "horizontal", e.STACK = "stack", e.VERTICAL = "vertical", e.INVALID = "invalid", e;
}({}), D = (e) => e instanceof HTMLElement && e.tagName === "SECTION", O = (e) => D(e) ? Array.from(e.children).some((e) => e instanceof HTMLElement && e.tagName === "SECTION") : !1, k = (e) => D(e) ? e.parentElement instanceof HTMLElement && e.parentElement.tagName === "SECTION" : !1, A = (e) => D(e) && !k(e) && !O(e), j = (e) => {
	if (!D(e)) return null;
	if (k(e)) {
		let t = e.parentElement;
		if (t instanceof HTMLElement && O(t)) return t;
	}
	return null;
}, M = (e) => D(e) ? k(e) ? "vertical" : O(e) ? "stack" : "horizontal" : "invalid", N = "tagteam", P = {
	debug: !1,
	mandatorygroup: !1,
	mode: "select",
	hide: {},
	groups: {}
}, F = (e) => e.trim().replace(/\s+/g, " ").toLowerCase(), I = (e, t) => e.some((e) => Array.isArray(e) ? e.every((e) => t.includes(F(e))) : t.includes(F(e))), L = (e, t) => {
	if (t === "tags") {
		let t = R(e.dataset.tag), n = e.parentElement, r = n instanceof HTMLElement ? R(n.dataset.tag) : [];
		return [...t, ...r];
	}
	return t === "names" ? R(e.dataset.name) : [];
}, R = (e) => e ? e.split(",").map(F).filter((e) => e.length > 0) : [], z = (e) => {
	e.dataset.visibility = "hidden";
}, B = (e, t) => {
	if (e.dataset.visibility = "visible", t) return;
	let n = e.parentElement;
	n instanceof HTMLElement && n.tagName === "SECTION" && (n.dataset.visibility = "visible");
}, V = (e, t, n, r) => {
	for (let i of e) I(t, L(i, n)) ? B(i, r) : z(i);
}, H = (e) => {
	let t = Array.isArray(e) ? { tags: e } : e ?? {}, n = (e) => (e ?? []).map(F).filter((e) => e.length > 0);
	return {
		tags: n(t.tags),
		names: n(t.names)
	};
}, U = (e) => e.tags.length > 0 || e.names.length > 0, W = (e, t) => !!(t.tags.length > 0 && L(e, "tags").some((e) => t.tags.includes(e)) || t.names.length > 0 && L(e, "names").some((e) => t.names.includes(e))), G = (e, t) => {
	let n = [], r = [];
	for (let i of e) (W(i, t) ? r : n).push(i);
	return {
		filtered: n,
		held: r
	};
}, K = (e) => e.split(",").map((e) => e.trim()).filter((e) => e.length > 0).map((e) => {
	let t = e.split(/\s+/);
	return t.length > 1 ? t : t[0];
}), q = (e) => e.split(",").map((e) => e.trim()).filter((e) => e.length > 0), J = (e) => {
	for (let t of e) {
		if (t.dataset.visibility === "hidden" || !T.isStack(t)) continue;
		let e = t.querySelectorAll(":scope > section");
		Array.from(e).some((e) => e.dataset.visibility !== "hidden") || z(t);
	}
}, Y = () => {
	let e = new URLSearchParams(new URL(window.location.href).search);
	return {
		t: e.get("t"),
		n: e.get("n"),
		g: e.get("g")
	};
}, X = (e) => ((e.t || e.n) && w(N, "Groups are spelled `tags` and `names` since 2.0.0. The short `t` and `n` keys still work, but will be dropped."), {
	tags: e.tags ?? e.t ?? null,
	names: e.names ?? e.n ?? null
}), Z = (e, t) => {
	let n = [], r = [];
	for (let i of e) {
		let e = i;
		(Array.isArray(e) ? e : [e]).map(F).some((e) => t.includes(e)) ? r.push(i) : n.push(i);
	}
	return {
		filter: n,
		include: r
	};
}, Q = /&(?:amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-f]+);/i, te = (e) => {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of [n.dataset.tag, n.dataset.name]) e && Q.test(e) && t.add(e);
	t.size !== 0 && w(N, `An HTML entity survived into a data-tag or data-name: ${[...t].map((e) => `"${e}"`).join(", ")}. That is usually a template escaping the character twice — write the character itself rather than the entity, and let the template escape it. As it stands, no URL parameter can match these sections.`);
}, $ = {
	tags: [],
	names: []
}, ne = class e {
	options;
	params;
	root;
	unhideMode;
	hide;
	selectable;
	mandatory;
	tagged;
	named;
	held;
	marked;
	constructor(e, t) {
		this.options = t, this.params = Y(), this.root = e.getRevealElement(), this.unhideMode = t.mode === "unhide", this.hide = H(t.hide), this.selectable = this.root.querySelectorAll("section:not([data-mandatory])"), this.mandatory = this.root.querySelectorAll("section[data-mandatory]");
		let n = [...this.root.querySelectorAll("section[data-tag]:not([data-tag=keep])")], r = [...this.root.querySelectorAll("section[data-name]:not([data-tag=keep])")], i = G(n, this.hide), a = G(r, this.hide);
		this.tagged = i.filtered, this.named = a.filtered, this.held = [.../* @__PURE__ */ new Set([...i.held, ...a.held])], this.marked = [.../* @__PURE__ */ new Set([...n, ...r])];
	}
	run() {
		if (S.log("Options:", this.options), S.log("Parameters:", this.params), te(this.marked), this.warnAboutMode(), U(this.hide)) {
			S.log(`Hidden until asked for: ${this.held.length} section(s).`);
			for (let e of this.held) z(e);
		}
		let { groups: e, mandatorygroup: t } = this.options, n = this.params.g, r = n !== null && Object.hasOwn(e, n) ? e[n] : null;
		t && !this.unhideMode && !r ? (S.log("Mandatory group missing or unknown, showing only [data-mandatory]."), V(this.selectable, [], "none", !1)) : V(this.mandatory, [], "none", !1);
		let i = this.askedFor(n, r, t);
		if (this.unhideMode) {
			this.showAsked(i), J(this.named);
			return;
		}
		n !== null && !r && (V(this.tagged, [], "none", !1), V(this.named, [], "none", !1));
		let a = Z(i.tags, this.hide.tags), o = Z(i.names, this.hide.names);
		this.applyFilters({
			tags: a.filter,
			names: o.filter
		}), J(this.named), this.showHeld({
			tags: a.include,
			names: o.include
		});
	}
	askedFor(e, t, n) {
		return e === null ? n && !this.unhideMode ? $ : {
			tags: this.params.t ? K(this.params.t) : [],
			names: this.params.n ? q(this.params.n) : []
		} : this.groupTerms(e, t);
	}
	groupTerms(e, t) {
		if (!t) return S.warn(this.unhideMode ? `Group "${e}" is not defined. Nothing was revealed.` : `Group "${e}" is not defined. Hiding everything instead.`), $;
		let { tags: n, names: r } = X(t);
		return !n && !r ? (S.warn(`Group "${e}" sets neither a 'tags' nor a 'names' array.`), $) : {
			tags: n ?? [],
			names: r ?? []
		};
	}
	applyFilters(e) {
		let t = e.names.length > 0;
		e.tags.length > 0 && (S.log("Tags to show:", e.tags), V(this.tagged, e.tags, "tags", t)), t && (S.log("Names to show:", e.names), V(this.named, e.names, "names", t));
	}
	showAsked(e) {
		if (e.tags.length !== 0 || e.names.length !== 0) {
			S.log("Asked for:", e);
			for (let t of this.marked) (I(e.tags, L(t, "tags")) || I(e.names, L(t, "names"))) && B(t, !1);
		}
	}
	showHeld(e) {
		if (this.held.length !== 0 && (e.tags.length !== 0 || e.names.length !== 0)) {
			S.log("Hidden material asked for:", e);
			for (let t of this.held) (I(e.tags, L(t, "tags")) || I(e.names, L(t, "names"))) && B(t, !1);
		}
	}
	warnAboutMode() {
		this.unhideMode && this.options.mandatorygroup && w(N, "`mandatorygroup` does nothing in mode \"unhide\". Nothing is withheld in that mode: a parameter never hides anything.");
	}
	static create(t, n) {
		let r = new e(t, n);
		return r.run(), r;
	}
}, re = (e, t, n) => {
	S && n.debug && (S.initialize(!0, N), S.log("Tagteam debugging enabled.")), ne.create(t, n);
}, ie = () => new x(N, re, P).createInterface();
//#endregion
export { ie as default };
