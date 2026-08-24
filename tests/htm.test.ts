// jsdom is used only by the test runtime and does not provide bundled TypeScript declarations.
// @ts-expect-error -- jsdom has no declaration file in this project.
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { appendChildren } from "../src/dom/children";
import { h } from "../src/dom/factory";

describe("DOM adapter", () => {
  it("creates normalized SVG elements and attributes", () => {
    const clipPath: SVGClipPathElement = h("clipPath", { id: "clip" });

    const svg: SVGSVGElement = h("svg", { viewBox: "0 0 10 10" }, clipPath);

    expect(svg.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(clipPath.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(clipPath.localName).toBe("clipPath");
    expect(svg.getAttribute("viewBox")).toBe("0 0 10 10");
  });

  it("detects SVG tags without an SVG parent", () => {
    const gradient: SVGLinearGradientElement = h("linearGradient", { id: "gradient" });

    expect(gradient.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(gradient.localName).toBe("linearGradient");
    expect(gradient.getAttribute("id")).toBe("gradient");
  });

  it("normalizes SVG tag names case-insensitively", () => {
    const clipPath: SVGClipPathElement = h("CLIPPATH", { id: "clip" });

    expect(clipPath.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(clipPath.localName).toBe("clipPath");
  });

  it("normalizes HTML tag names case-insensitively", () => {
    const input: HTMLInputElement = h("INPUT", {
      value: "initial",
    });

    expect(input.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(input.localName).toBe("input");
    expect(input.value).toBe("initial");
  });

  it("restores SVG context around component children", () => {
    const svgChild: () => SVGPathElement = () => h("path");
    const htmlChild: () => HTMLDivElement = () => h("div");
    const svg = h("svg", null, h(svgChild), h("foreignObject", null, h(htmlChild)));

    expect(svg.querySelector("path")?.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(svg.querySelector("div")?.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
  });

  it("keeps foreignObject children in the HTML namespace", () => {
    const child: HTMLDivElement = h("div", { class: "content" }, "Hello");
    const foreignObject: SVGForeignObjectElement = h("foreignObject", null, child);

    expect(foreignObject.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(child.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
  });

  it("supports fragments and nested children", () => {
    const fragment: DocumentFragment = h(null, null, ["one", [h("br"), "two"]]);

    expect(fragment.childNodes).toHaveLength(3);
    expect(fragment.textContent).toBe("onetwo");
  });

  it("uses attributes by default and properties with dot bindings", () => {
    const input: HTMLInputElement = h("input", { value: "initial", ".value": "live" });

    expect(input.getAttribute("value")).toBe("initial");
    expect(input.value).toBe("live");
  });

  it("synchronizes known boolean properties", () => {
    const enabled: HTMLButtonElement = h("button", { disabled: false });
    const disabled: HTMLButtonElement = h("button", { disabled: true });

    expect(enabled.disabled).toBe(false);
    expect(enabled.hasAttribute("disabled")).toBe(false);
    expect(disabled.disabled).toBe(true);
    expect(disabled.hasAttribute("disabled")).toBe(true);
  });

  it("registers event handlers and refs", () => {
    let clicked = false;
    let referenced: HTMLButtonElement | null = null;
    const button: HTMLButtonElement = h("button", {
      onClick: () => {
        clicked = true;
      },
      ref: (element: HTMLButtonElement) => {
        referenced = element;
      },
    });

    button.click();
    expect(clicked).toBe(true);
    expect(referenced).toBe(button);
  });

  it("handles dataset on HTML and SVG elements", () => {
    const div: HTMLDivElement = h("div", { dataset: { userId: 42 } });
    const svg: SVGSVGElement = h("svg", { dataset: { chartType: "line" } });

    expect(div.getAttribute("data-user-id")).toBe("42");
    expect(svg.getAttribute("data-chart-type")).toBe("line");
  });

  it("normalizes component children", () => {
    const component: (props: { children?: unknown }) => HTMLParagraphElement = (props: {
      children?: unknown;
    }) => h("p", null, String(props.children));
    const paragraph = h(component, null, "content");

    expect(paragraph.textContent).toBe("content");
  });

  it("appends nodes created in another realm", () => {
    const otherWindow = new JSDOM("<span>foreign</span>").window;
    const foreignNode = otherWindow.document.querySelector("span");
    const parent = h("div");

    expect(foreignNode).not.toBeNull();
    appendChildren(parent, [foreignNode as unknown as Node]);
    expect(parent.textContent).toBe("foreign");
  });
});
