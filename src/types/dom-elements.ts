
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


