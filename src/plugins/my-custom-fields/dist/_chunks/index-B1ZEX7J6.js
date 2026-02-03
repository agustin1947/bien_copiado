"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const SalesDetectChangesInItems = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  react.useEffect(() => {
    const timer = setTimeout(() => {
      console.log("ejecuto click sobre items");
      const buttonClosed = document.querySelectorAll('form h3 button[aria-expanded="false"]');
      document.querySelectorAll("form div[data-state=closed]");
      const buttonAction = document.querySelectorAll("h3 span button[data-state=closed]");
      buttonClosed.forEach((button) => {
        button.click();
      });
      buttonAction.forEach((button) => {
        button.classList.add("hidden-delete");
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, {});
};
exports.SalesDetectChangesInItems = SalesDetectChangesInItems;
