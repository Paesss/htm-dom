import h from "../dom";
import htmlFn from "../html";

const globalHtml = Object.assign(<typeof htmlFn>((statics, ...args) => htmlFn(statics, ...args)), {
  html: htmlFn,
  h,
});

export default globalHtml;
