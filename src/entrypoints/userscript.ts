import h from "../h";
import html from "../html";

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

getGlobal().html = Object.assign(html, { h });
