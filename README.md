# htm-dom

A tiny, framework-free DOM helper for JavaScript and TypeScript. It gives you HTML-like tagged templates without building one large HTML string and handing it to innerHTML.

```js
const username = getUsername();
const view = html`<p>Hello, ${username}</p>`;

document.body.append(view);
```

The template describes the structure. Dynamic values stay values: strings become text, DOM nodes stay nodes, arrays are flattened, and functions can produce components. The result is a real `Element`, `SVGElement`, `DocumentFragment`, or `Text` node.

## Quickstart

ES
```js
import { html, h } from "htm-dom";
```

CommonJS
```js
const { html, h } = require("htm-dom");
```

UMD in Browser and Userscript
```js
const { html, h } = HTMDOM;
```

## Why use it instead of `innerHTML`?

### 1. Dynamic content does not become markup

With a normal template string, interpolation happens before the browser parses the result:

```js
const username = '<img src=x onerror="alert(\'XSS\')">';

const view = `<p>Hello, ${username}</p>`;
document.body.innerHTML = view;
```

The interpolated value is now part of the HTML source. If it contains markup, `innerHTML` parses that markup as elements. Escaping every value correctly is your responsibility.

With `htm-dom`, the static template and dynamic values remain separate:

```js
const username = '<img src=x onerror="alert(\'XSS\')">';

const view = html`<p>Hello, ${username}</p>`;
document.body.append(view);
```

Here `username` is inserted as a text node, so the browser displays the characters instead of creating an `img` element. Dynamic DOM nodes are appended as nodes, not serialized and reparsed.

This protects interpolation handled by the library. The template's own markup is still code and must be trusted. An API that deliberately inserts raw HTML would need the same care as `innerHTML`.

### 2. Values can be nodes, not just strings

`innerHTML` accepts a string. `htm-dom` accepts DOM nodes, nested arrays, strings, numbers, and components in the same child position:

```js
const items = ["One", "Two", "Three"];

const list = html`
  <ul>
    ${items.map((item) => html`<li>${item}</li>`)}
  </ul>
`;
```

Existing nodes are appended directly. Nested arrays are recursively flattened, while `null`, `undefined`, and booleans are ignored. This makes conditional content and reusable pieces ordinary JavaScript values without an HTML serialization step.

### 3. DOM properties, events, and refs are first-class

An `innerHTML` string can describe attributes, but it cannot assign live object properties or attach event listeners without a second pass through the DOM. `htm-dom` does both during creation:

```js
const inputRef = { current: null };

const input = html`
  <input
    value="initial"
    .value=${"live value"}
    .disabled=${false}
    onInput=${(event) => console.log(event.currentTarget.value)}
    ref=${inputRef}
  />
`;

inputRef.current?.focus();
```

* A leading dot assigns a DOM property, such as `.value` or `.disabled`.
* `onClick`, `onInput`, and other `on*` props call `addEventListener` directly.
* `ref` accepts a callback or an object with a mutable `current` property.
* `style` accepts either CSS text or an object.
* `dataset`, `data-*`, and `aria-*` work without manual attribute plumbing.

This is especially useful for form controls, where an HTML `value` attribute and the current `input.value` property are not the same thing.

Object values can be passed directly for styles and dataset entries. CSS properties use camelCase:

```js
const style = {
  backgroundColor: "rebeccapurple",
  fontSize: "1.1rem",
  marginTop: "1rem",
};
const dataset = { userId: 42, source: "inbox" };

const notice = html`
  <div style=${style} dataset=${dataset}>
    Message
  </div>
`;
```

This sets the element's styles and creates attributes such as `data-user-id="42"` and `data-source="inbox"`.

### 4. The DOM tree is available immediately

`htm-dom` creates the final DOM nodes directly. There is no virtual DOM, JSX compiler, rendering runtime, or string-to-DOM round trip to understand:

```js
const content = html`
  <h1>Dashboard</h1>
  <p>Ready.</p>
`;

document.querySelector("main")?.append(content);
```

You can pass the result to `append`, `appendChild`, or standard DOM APIs. Top-level siblings become a `DocumentFragment`; a single scalar is normalized to a `Text` node.

## Components without a framework

Functions receive props and optional `children`, then return a node, fragment, text, array, or another supported child:

```js
const Card = ({ title, children }) => html`
  <article class="card">
    <h2>${title}</h2>
    ${children}
  </article>
`;

const view = html`
  <${Card} title="View">
    <p>This is the card content.</p>
  </${Card}>
`;
```

This gives repeated UI a small composition boundary while leaving updates, state, routing, and lifecycle decisions to you. Calling `html` creates new nodes; it does not reconcile an earlier result.

## TypeScript support

The lower-level `h` helper is typed for HTML tags, SVG tags, components, children, event handlers, refs, styles, `data-*`, `aria-*`, and property bindings:

```ts
const button = h("button", {
  class: "primary",
  disabled: false,
  onClick: (event: MouseEvent) => console.log(event.currentTarget),
}, "Save");
```

`h` is useful when a template would be awkward or when a typed, programmatic construction API is preferable:

```js
const fragment = h(null, null,
  h("span", null, "First"),
  h("span", null, "Second"),
);
```

## SVG and standard DOM behavior

HTML elements use the HTML namespace and recognized SVG tags use the SVG namespace, even when an SVG tag is created without a top-level `<svg>`. SVG tag names are matched case-insensitively and normalized to their canonical names, such as `clipPath` and `linearGradient`. Mixed content such as `foreignObject` is supported:

```js
const graphic = html`
  <svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" />
    <foreignObject x="10" y="10" width="80" height="30">
      <div>HTML content</div>
    </foreignObject>
  </svg>
`;
```

Self-closing tags, optional-close HTML tags, fragments, and normal HTML directives are accepted by the `xhtm` parser.

## The `h` helper

```js
h(tag, props?, ...children)
```

Its behavior is deliberately small:

* A string tag creates an HTML element or a recognized SVG element. Recognized SVG tags are detected without requiring an `<svg>` parent and normalized to their canonical names.
* A function tag receives copied props and normalized `children`.
* A missing tag (`null` or `undefined`) creates a `DocumentFragment`.
* Nodes, including nodes from another DOM realm, are appended directly.
* Strings and numbers become text nodes.
* `null`, `undefined`, and booleans are skipped as children.
* Explicit children take precedence over `props.children`.

## When `innerHTML` is still the right choice

This library is not a universal replacement for `innerHTML`:

* Use `innerHTML` when you already have trusted, complete HTML and want the browser to parse it as HTML.
* Use a sanitizer before inserting any HTML that is not fully trusted.
* Use a UI framework when you need state management, reconciliation, effects, routing, or lifecycle hooks.
* Use a DOM implementation such as `jsdom` for server-side use and configure the environment appropriately.

Choose `htm-dom` when dynamic values, direct DOM behavior, small components, and TypeScript types matter more than serializing a string.

## Installation

```sh
npm install htm-dom
```

The package exposes compiled files from `dist`:

* `import`: ES module
* `require`: CommonJS
* `default`/browser: UMD build
* `types`: generated TypeScript declarations

The library expects a browser-like DOM with `document` available. It is suitable for browser scripts, userscripts, and applications that already have a DOM.

## Userscript build

The Vite userscript entry point assigns the function to `globalThis.html`:

```js
const view = html`<div class="notice">Loaded</div>`;
document.body.append(view);
```

The generated userscript bundles `xhtm` and currently matches all HTTP and HTTPS pages. Narrow the userscript metadata before publishing a script for a specific site.

## Development

```sh
npm install
npm test
npm run build
```

Additional commands:

## License

MIT. See [LICENSE](../LICENSE).

```sh
npm run build:types
npm run build:lib
npm run build:package
npm run dev
npm run build:docs
```

`npm run build:docs` reads this file and generates the GitHub copy at `README.md` plus a rendered HTML copy at `docs/README.greasyfork.html`. It expands package metadata, converts Markdown to HTML, and highlights fenced code blocks with Shiki. Run it after changing this source README.

This source uses Handlebars' Mustache-style templates. Package metadata is available under `package`, so `htm-dom` and `0.1.3` are replaced from `package.json` during the docs build.

## License

This project is licensed under the MIT License. The userscript build includes `xhtm`, which is also distributed under the MIT License.
