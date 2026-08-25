import globalHtml from "./index.umd";

declare global {
  var html: typeof globalHtml;
}

function getGlobal(): typeof globalThis {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }

  if (typeof self !== "undefined") {
    return self;
  }

  if (typeof window !== "undefined") {
    return window;
  }

  if (typeof global !== "undefined") {
    return global;
  }

  throw new Error("Unable to locate the global object");
}

getGlobal().html = globalHtml;
