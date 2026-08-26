import { describe, expect, it } from "vitest";
import h from "../src/dom/factory";
import html from "../src/html";

import "../src/index.userscript";

describe("html tagged template", () => {
  it("installs the browser globals consistently for userscript builds", () => {
    expect(globalThis.HTMDOM).toBeDefined();

    expect(globalThis.HTMDOM.html).toBe(html);
    expect(globalThis.HTMDOM.h).toBe(h);
  });

  it("creates an element with interpolated text", () => {
    const username = '<img src="x">';
    const view: HTMLParagraphElement = html`<p>Hello ${username}</p>`;

    expect(view.localName).toBe("p");
    expect(view.textContent).toBe(`Hello ${username}`);
    expect(view.querySelector("img")).toBeNull();
  });

  it("keeps interpolated nodes as nodes", () => {
    const link: HTMLAnchorElement = html`<a href="/profile">Profile</a>`;
    const view: HTMLParagraphElement = html`<p>Open ${link}</p>`;

    expect(view.textContent).toBe("Open Profile");
    expect(view.querySelector("a")).toBe(link);
  });

  it("returns a fragment for multiple top-level children", () => {
    const first: HTMLSpanElement = html`<span>one</span>`;
    const second: HTMLSpanElement = html`<span>two</span>`;
    const view: DocumentFragment = html`${[first, [" and ", second]]}`;

    expect(view).toBeInstanceOf(DocumentFragment);
    expect(view.childNodes).toHaveLength(3);
    expect(view.textContent).toBe("one and two");
  });

  it("returns text nodes for primitive and nullish results", () => {
    const number: Text = html`${42}`;
    const falseValue: Text = html`${false}`;
    const nullValue: Text = html`${null}`;
    const undefinedValue: Text = html`${undefined}`;

    expect(number.nodeValue).toBe("42");
    expect(falseValue.nodeValue).toBe("false");
    expect(nullValue.nodeValue).toBe("");
    expect(undefinedValue.nodeValue).toBe("");
  });
});
