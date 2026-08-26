// ==UserScript==
// @name         htm-dom
// @namespace    https://github.com/Paesss
// @version      0.1.11
// @author       Paesss
// @description  A tiny, framework-free DOM helper for JavaScript and TypeScript. It gives you HTML-like tagged templates without building one large HTML string and handing it to innerHTML
// @license      MIT
// @homepage     https://github.com/Paesss/htm-dom
// @homepageURL  https://github.com/Paesss/htm-dom
// @source       https://github.com/Paesss/htm-dom.git
// @supportURL   https://github.com/Paesss/htm-dom/issues
// @match        *://*/*
// ==/UserScript==

/* ========================================================================
* Bundled Library: XHTM (xhtm@1.8.0)
* Copyright (c) 2019 Dmitry Yv.
*
* MIT License
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* ======================================================================== */
(function() {
	"use strict";
	var __defProp = Object.defineProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
	var BOOLEAN_PROPS = new Set([
		"allowFullscreen",
		"async",
		"autocorrect",
		"autofocus",
		"autoplay",
		"checked",
		"className",
		"compact",
		"complete",
		"controls",
		"declare",
		"default",
		"defaultChecked",
		"defaultMuted",
		"defaultSelected",
		"defer",
		"disablePictureInPicture",
		"disableRemotePlayback",
		"disabled",
		"draggable",
		"ended",
		"formNoValidate",
		"hidden",
		"indeterminate",
		"inert",
		"isConnected",
		"isContentEditable",
		"isMap",
		"loop",
		"multiple",
		"muted",
		"noHref",
		"noModule",
		"noResize",
		"noShade",
		"noValidate",
		"noWrap",
		"open",
		"paused",
		"playsInline",
		"preservesPitch",
		"readOnly",
		"required",
		"reversed",
		"seeking",
		"selected",
		"shadowRootClonable",
		"shadowRootDelegatesFocus",
		"shadowRootSerializable",
		"spellcheck",
		"translate",
		"trueSpeed",
		"webkitdirectory",
		"willValidate"
	]);
	var isBooleanPropKey = (key) => BOOLEAN_PROPS.has(key);
	var SVG_TAG_KEYS = [
		"a",
		"animate",
		"animateMotion",
		"animateTransform",
		"circle",
		"clipPath",
		"defs",
		"desc",
		"ellipse",
		"feBlend",
		"feColorMatrix",
		"feComponentTransfer",
		"feComposite",
		"feConvolveMatrix",
		"feDiffuseLighting",
		"feDisplacementMap",
		"feDistantLight",
		"feDropShadow",
		"feFlood",
		"feFuncA",
		"feFuncB",
		"feFuncG",
		"feFuncR",
		"feGaussianBlur",
		"feImage",
		"feMerge",
		"feMergeNode",
		"feMorphology",
		"feOffset",
		"fePointLight",
		"feSpecularLighting",
		"feSpotLight",
		"feTile",
		"feTurbulence",
		"filter",
		"foreignObject",
		"g",
		"image",
		"line",
		"linearGradient",
		"marker",
		"mask",
		"metadata",
		"mpath",
		"path",
		"pattern",
		"polygon",
		"polyline",
		"radialGradient",
		"rect",
		"script",
		"set",
		"stop",
		"style",
		"svg",
		"switch",
		"symbol",
		"text",
		"textPath",
		"title",
		"tspan",
		"use",
		"view"
	];
	var SVG_TAG_SET = new Set();
	var CAMEL_CASE_SVG_TAGS = new Map();
	var UPPERCASE_REGEX = /[A-Z]/;
	for (let i = 0; i < SVG_TAG_KEYS.length; i++) {
		const tag = SVG_TAG_KEYS[i];
		const lower = tag.toLowerCase();
		SVG_TAG_SET.add(lower);
		if (UPPERCASE_REGEX.test(tag)) CAMEL_CASE_SVG_TAGS.set(lower, tag);
	}
	var getSvgTagName = (key) => {
		const lower = key.toLowerCase();
		if (!SVG_TAG_SET.has(lower)) return void 0;
		return CAMEL_CASE_SVG_TAGS.get(lower) || lower;
	};
	var VALID_NODE_TYPES = new Set([
		1,
		2,
		3,
		4,
		7,
		8,
		9,
		10,
		11
	]);
	var isNode = (value) => {
		if (value === null || typeof value !== "object") return false;
		if (typeof Node !== "undefined" && value instanceof Node) return true;
		const node = value;
		return typeof node.nodeType === "number" && VALID_NODE_TYPES.has(node.nodeType) && typeof node.nodeName === "string" && typeof node.addEventListener === "function";
	};
	function appendChildren(parent, children) {
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child == null || typeof child === "boolean") continue;
			if (Array.isArray(child)) appendChildren(parent, child);
			else if (isNode(child)) parent.appendChild(child);
			else parent.appendChild(document.createTextNode(String(child)));
		}
	}
	function setDataset(el, dataset) {
		if ("dataset" in el && el.dataset) {
			Object.assign(el.dataset, dataset);
			return;
		}
		for (const key in dataset) {
			const value = dataset[key];
			const attribute = `data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
			if (value == null) el.removeAttribute(attribute);
			else el.setAttribute(attribute, String(value));
		}
	}
	function setProps(el, props, isSvg) {
		for (const key in props) {
			const val = props[key];
			if (key === "ref") {
				if (typeof val === "function") val(el);
				else if (val && typeof val === "object") val.current = el;
				continue;
			}
			if (key === "children") continue;
			if (key.charCodeAt(0) === 46) {
				el[key.slice(1)] = val;
				continue;
			}
			if (val === void 0 || val === null) continue;
			if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
				const eventName = key.slice(2).toLowerCase();
				if (typeof val === "function" || typeof val === "object" && val !== null) el.addEventListener(eventName, val);
				continue;
			}
			let attrName = key;
			if (key === "className") attrName = "class";
			else if (key === "htmlFor") attrName = "for";
			if (key === "style") {
				const styledEl = el;
				if (typeof val === "object" && val !== null) Object.assign(styledEl.style, val);
				else styledEl.style.cssText = String(val);
				continue;
			}
			if (key === "dataset" && typeof val === "object") {
				setDataset(el, val);
				continue;
			}
			if (typeof val === "boolean") {
				if (!isSvg && isBooleanPropKey(key)) el[key] = val;
				if (val) el.setAttribute(attrName, "");
				else el.removeAttribute(attrName);
				continue;
			}
			el.setAttribute(attrName, String(val));
		}
	}
	var CURRENT_IS_SVG = false;
	function h(tag, props, ...children) {
		if (typeof tag === "function") {
			const normalizedProps = Object.assign({}, props);
			normalizedProps.children = children.length === 0 ? void 0 : children.length === 1 ? children[0] : children;
			return tag(normalizedProps);
		}
		if (!tag) {
			const fragment = document.createDocumentFragment();
			appendChildren(fragment, children);
			return fragment;
		}
		const tagName = String(tag);
		const lowerTag = tagName.toLowerCase();
		const parentIsSvg = CURRENT_IS_SVG;
		let isSvg = parentIsSvg;
		if (lowerTag === "svg" || lowerTag === "foreignobject") isSvg = true;
		else if (!isSvg) isSvg = getSvgTagName(lowerTag) !== void 0;
		CURRENT_IS_SVG = lowerTag === "foreignobject" ? false : isSvg;
		let el;
		try {
			if (isSvg) {
				const normalizedTag = getSvgTagName(lowerTag) ?? tagName;
				el = document.createElementNS(SVG_NAMESPACE, normalizedTag);
			} else el = document.createElement(tagName);
			if (props) setProps(el, props, isSvg);
			appendChildren(el, children);
		} finally {
			CURRENT_IS_SVG = parentIsSvg;
		}
		return el;
	}
	var FIELD = "";
	var QUOTES = "";
	var CACHE = new WeakMap();
	function htm(statics) {
		let tree = CACHE.get(statics);
		if (!tree) CACHE.set(statics, tree = parse(statics));
		let nodes = tree.map((node) => build(this, node, arguments));
		return nodes.length < 2 ? nodes[0] : nodes;
	}
	var build = (h, node, args) => {
		if (typeof node === "number") return args[node];
		if (typeof node !== "object") return node;
		let props = null;
		if (node.p) {
			props = {};
			for (let e of node.p) e.length < 2 ? Object.assign(props, args[e[0]]) : props[part(e[0], args)] = part(e[1], args);
		}
		return h(part(node.t, args), props, ...node.c.map((c) => build(h, c, args)));
	};
	var part = (v, args) => typeof v === "number" ? args[v] : Array.isArray(v) ? v.map((x) => (x = typeof x === "number" ? args[x] : x, x == null || x === false ? "" : x)).join("") : v;
	var parse = (statics) => {
		let prev = 0, current = [null], field = 0, args, name, value, quotes = [], quote = 0, last, level = 0, pre = false;
		const evaluate = (str, parts = [], raw) => {
			let i = 0;
			str = !raw && str === QUOTES ? quotes[quote++].slice(1, -1) : str.replace(/\ue001/g, (m) => quotes[quote++]);
			if (!str) return str;
			str.replace(/\ue000/g, (match, idx) => {
				if (idx) parts.push(str.slice(i, idx));
				i = idx + 1;
				return parts.push(++field);
			});
			if (i < str.length) parts.push(str.slice(i));
			return parts.length > 1 ? parts : parts[0];
		};
		const up = () => {
			args = current, current = args[0], last = args[1];
			current.push({
				t: last,
				p: args[2],
				c: args.slice(3)
			});
			if (pre === level--) pre = false;
		};
		let str = statics.join(FIELD);
		if (str.indexOf("<!") >= 0) str = str.replace(/<!--[^]*?-->/g, "").replace(/<!\[CDATA\[[^]*\]\]>/g, "");
		str = str.replace(/('|")[^\1]*?\1/g, (match) => (quotes.push(match), QUOTES));
		str.replace(/(?:^|>)((?:[^<]|<[^\w\ue000\/?!>])*)(?:$|<)/g, (match, text, idx, str) => {
			let tag, close;
			if (idx) str.slice(prev, idx).replace(/(\S)\/$/, "$1 /").split(/\s+/).map((part, i) => {
				if (part[0] === "/") {
					part = part.slice(1);
					if (EMPTY[part]) return;
					close = tag || part || 1;
				} else if (!i) {
					tag = evaluate(part);
					if (typeof tag === "string") {
						tag = tag.toLowerCase();
						while (CLOSE[current[1] + tag]) up();
					}
					current = [
						current,
						tag,
						null
					];
					level++;
					if (!pre && PRE[tag]) pre = level;
					if (EMPTY[tag]) close = tag;
				} else if (part) {
					let props = current[2] || (current[2] = []);
					if (part.slice(0, 3) === "...") props.push([++field]);
					else {
						[name, value] = part.split("=");
						props.push([evaluate(name), value ? evaluate(value) : true]);
					}
				}
			});
			if (close) {
				if (!current[0]) err(`Wrong close tag \`${close}\``);
				up();
				while (last !== close && CLOSE[last]) up();
			}
			prev = idx + match.length;
			if (!pre) text = text.replace(/\s*\n\s*/g, "").replace(/\s+/g, " ");
			if (text) evaluate((last = 0, text), current, true);
		});
		if (current[0] && CLOSE[current[1]]) up();
		if (level) err(`Unclosed \`${current[1]}\`.`);
		return current.slice(1);
	};
	var err = (msg) => {
		throw SyntaxError(msg);
	};
	var EMPTY = htm.empty = {};
	var CLOSE = htm.close = {};
	var PRE = htm.pre = {};
	"area base basefont bgsound br col command embed frame hr image img input keygen link meta param source track wbr ! !doctype ? ?xml".split(" ").map((v) => htm.empty[v] = true);
	var close = {
		"li": "",
		"dt": "dd",
		"dd": "dt",
		"p": "address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table",
		"rt": "rp",
		"rp": "rt",
		"optgroup": "",
		"option": "optgroup",
		"caption": "tbody thead tfoot tr colgroup",
		"colgroup": "thead tbody tfoot tr caption",
		"thead": "tbody tfoot caption",
		"tbody": "tfoot caption",
		"tfoot": "caption",
		"tr": "tbody tfoot",
		"td": "th tr",
		"th": "td tr tbody"
	};
	for (let tag in close) for (let closer of [...close[tag].split(" "), tag]) htm.close[tag] = htm.close[tag + closer] = true;
	"pre textarea".split(" ").map((v) => htm.pre[v] = true);
	var boundHtm = htm.bind(h);
	function html(statics, ...args) {
		const result = boundHtm(statics, ...args);
		if (Array.isArray(result)) {
			const fragment = document.createDocumentFragment();
			appendChildren(fragment, result);
			return fragment;
		}
		if (isNode(result)) return result;
		return document.createTextNode(String(result ?? ""));
	}
	var src_exports = __exportAll({
		appendChildren: () => appendChildren,
		h: () => h,
		html: () => html,
		isNode: () => isNode,
		setDataset: () => setDataset,
		setProps: () => setProps
	});
	var globalContext = (() => {
		if (typeof globalThis !== "undefined") return globalThis;
		if (typeof self !== "undefined") return self;
		if (typeof global !== "undefined") return global;
		if (typeof window !== "undefined") return window;
		throw new Error("Unable to locate the global object");
	})();
	globalContext.HTMDOM = src_exports;
})();
