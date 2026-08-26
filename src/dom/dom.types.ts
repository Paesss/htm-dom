import type { BooleanKeys } from "../type-utils.js";

export type VNodeChild = Node | string | number | boolean | null | undefined | VNodeChild[];

export type StyleObject = Partial<CSSStyleDeclaration> | Record<string, string | number>;

export type PropertyBindings = {
  [K in `.${string}`]?: unknown;
};

export type Ref<T = Element> = ((el: T) => void) | { current: T | null };

export type DataProps = {
  [K in `data-${string}`]?: string | number | boolean | null | undefined;
};

export type AriaProps = {
  [K in `aria-${string}`]?: string | number | boolean | null | undefined;
};

type BaseDOMProps<T extends Element> = DOMEventHandlers<T> &
  DataProps &
  AriaProps &
  PropertyBindings & {
    ref?: Ref<T>;
    style?: StyleObject | string;
    dataset?: Record<string, string | number | boolean | null | undefined>;
    id?: string;
    class?: string;
    className?: string;
    for?: string;
    htmlFor?: string;
    children?: VNodeChild;
  };

export type HTMLProps<T extends HTMLElement = HTMLElement> = BaseDOMProps<T> & {
  value?: string | number;
  disabled?: boolean;
  ".value"?: string | number;
  ".checked"?: boolean;
  ".selected"?: boolean;
  ".disabled"?: boolean;
};

export type SVGProps<T extends SVGElement = SVGElement> = BaseDOMProps<T> & {
  viewBox?: string;
};

export type DOMProps<T extends Element = Element> = T extends SVGElement
  ? SVGProps<T>
  : T extends HTMLElement
    ? HTMLProps<T>
    : BaseDOMProps<T>;

export type ComponentFunction<P = Record<string, unknown>> = (
  props: P & { children?: VNodeChild }
) => Element | DocumentFragment | VNodeChild;

export type CombinedBooleanKeys = BooleanKeys<CombinedElement>;

export type CanonicalSvgTagName<Tag extends string> = Extract<
  {
    [Name in Extract<keyof SVGElementTagNameMap, string>]: Lowercase<Name> extends Lowercase<Tag>
      ? Name
      : never;
  }[Extract<keyof SVGElementTagNameMap, string>],
  keyof SVGElementTagNameMap
>;

export type SvgElementForTag<Tag extends string> = SVGElementTagNameMap[CanonicalSvgTagName<Tag>];

export type CanonicalHtmlTagName<Tag extends string> = Extract<
  {
    [Name in Extract<keyof HTMLElementTagNameMap, string>]: Lowercase<Name> extends Lowercase<Tag>
      ? Name
      : never;
  }[Extract<keyof HTMLElementTagNameMap, string>],
  keyof HTMLElementTagNameMap
>;

export type HtmlElementForTag<Tag extends string> =
  HTMLElementTagNameMap[CanonicalHtmlTagName<Tag>];

export type DOMEventHandlers<T extends Element = Element> = {
  [K in keyof GlobalEventHandlersEventMap as `on${Capitalize<K>}`]?: (
    this: T,
    ev: GlobalEventHandlersEventMap[K]
  ) => void;
} & {
  [K in `on${string}`]?: (this: T, ev: Event) => void;
};

export type SVGTagName = keyof SVGElementTagNameMap;

export type CombinedElement =
  | HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
  | HTMLElementDeprecatedTagNameMap[keyof HTMLElementDeprecatedTagNameMap]
  | SVGElementTagNameMap[keyof SVGElementTagNameMap];
