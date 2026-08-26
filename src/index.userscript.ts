import * as exports from "./index";

export * from "./index";

declare global {
  var htmdom: typeof exports;
}

const globalContext: typeof globalThis = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }

  if (typeof self !== "undefined") {
    return self;
  }

  if (typeof global !== "undefined") {
    return global;
  }

  if (typeof window !== "undefined") {
    return window;
  }

  throw new Error("Unable to locate the global object");
})();

globalContext.htmdom = exports;
