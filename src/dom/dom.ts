import type { CombinedElement, DOMEventHandlers } from "./dom-elements.ts";
import type { BooleanKeys } from "./type-utils.ts";

export type {
  CanonicalHtmlTagName,
  CanonicalSvgTagName,
  CombinedElement,
  DOMEventHandlers,
  HtmlElementForTag,
  SVGTagName,
  SvgElementForTag,
} from "./dom-elements.ts";

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
