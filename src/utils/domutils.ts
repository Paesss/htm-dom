export const isNode = (value: unknown): value is Node =>
  value !== null &&
  typeof value === "object" &&
  "nodeType" in value &&
  typeof value.nodeType === "number" &&
  "nodeName" in value &&
  typeof value.nodeName === "string";
