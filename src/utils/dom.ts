/**
 * Modern DOM Node Types:
 *  1: ELEMENT_NODE
 *  2: ATTRIBUTE_NODE
 *  3: TEXT_NODE
 *  4: CDATA_SECTION_NODE
 *  7: PROCESSING_INSTRUCTION_NODE
 *  8: COMMENT_NODE
 *  9: DOCUMENT_NODE
 * 10: DOCUMENT_TYPE_NODE
 * 11: DOCUMENT_FRAGMENT_NODE
 */
const VALID_NODE_TYPES = new Set([1, 2, 3, 4, 7, 8, 9, 10, 11]);

/**
 * Robust cross-realm type guard for DOM Nodes.
 * Works across single-realm contexts, iframes, JSDOM, and detached subtrees.
 */
export const isNode = (value: unknown): value is Node => {
  if (value === null || typeof value !== "object") {
    return false;
  }

  // 1. Fast path: Same-realm instance check (covers ~95%+ of runtime checks)
  if (typeof Node !== "undefined" && value instanceof Node) {
    return true;
  }

  const node = value as Partial<Node>;

  // 2. Cross-realm fallback: Structural check (iframes, JSDOM, shadow DOM)
  return (
    typeof node.nodeType === "number" &&
    VALID_NODE_TYPES.has(node.nodeType) &&
    typeof node.nodeName === "string" &&
    typeof node.addEventListener === "function"
  );
};