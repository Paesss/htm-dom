import type { html as htmlFn } from "./html";

declare global {
  var html: typeof htmlFn;
}
