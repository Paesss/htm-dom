import type { CombinedBooleanKeys, SVGTagName } from "../types/dom";
import type { MissingKeys } from "../types/type-utils";

export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const BOOLEAN_PROP_KEYS = [
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
  "willValidate",
] as const satisfies readonly CombinedBooleanKeys[];

const BOOLEAN_PROP_KEYS_CHECK: typeof BOOLEAN_PROP_KEYS &
  (MissingKeys<CombinedBooleanKeys, typeof BOOLEAN_PROP_KEYS> extends never
    ? unknown
    : ["Missing keys", MissingKeys<CombinedBooleanKeys, typeof BOOLEAN_PROP_KEYS>]) =
  BOOLEAN_PROP_KEYS;

const BOOLEAN_PROPS = new Set<string>(BOOLEAN_PROP_KEYS_CHECK);

export const isBooleanPropKey = (key: string): key is CombinedBooleanKeys => BOOLEAN_PROPS.has(key);

const SVG_TAG_KEYS = [
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
  "view",
] as const satisfies readonly SVGTagName[];

const SVG_TAG_KEYS_CHECK: typeof SVG_TAG_KEYS &
  (MissingKeys<SVGTagName, typeof SVG_TAG_KEYS> extends never
    ? unknown
    : ["Missing keys", MissingKeys<SVGTagName, typeof SVG_TAG_KEYS>]) = SVG_TAG_KEYS;

type SVGTagKey = (typeof SVG_TAG_KEYS)[number];
type SVGTagLookupKey = Lowercase<SVGTagKey>;

const SVG_TAG_SET = new Set<string>();
const CAMEL_CASE_SVG_TAGS = new Map<string, SVGTagKey>();

const UPPERCASE_REGEX = /[A-Z]/;

for (let i = 0; i < SVG_TAG_KEYS_CHECK.length; i++) {
  const tag = SVG_TAG_KEYS_CHECK[i];
  const lower = tag.toLowerCase();

  SVG_TAG_SET.add(lower);

  if (UPPERCASE_REGEX.test(tag)) {
    CAMEL_CASE_SVG_TAGS.set(lower, tag);
  }
}

export const isSvgTagName = (key: string): key is SVGTagLookupKey =>
  SVG_TAG_SET.has(key.toLowerCase());

export function getSvgTagName(key: string): SVGTagKey | undefined {
  const lower = key.toLowerCase();
  if (!SVG_TAG_SET.has(lower)) return undefined;

  return (CAMEL_CASE_SVG_TAGS.get(lower) || lower) as SVGTagKey;
}
