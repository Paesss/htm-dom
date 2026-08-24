type NodeLike = { nodeType: number; nodeName: string };

export const isNode = (value: unknown): value is Node =>
  value !== null &&
  typeof value === "object" &&
  typeof (value as NodeLike).nodeType === "number" &&
  typeof (value as NodeLike).nodeName === "string" &&
  ((value as NodeLike).nodeType === 9 || "ownerDocument" in value);
