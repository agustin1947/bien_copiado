"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const react = require("react");
const SalesDetectChangesInItems = () => {
  react.useEffect(() => {
    const applyChanges = () => {
      const buttonClosed = document.querySelectorAll(
        'form h3 button[aria-expanded="false"]'
      );
      const buttonAction = document.querySelectorAll(
        "h3 span button[data-state=closed]"
      );
      buttonClosed.forEach((button) => {
        button.click();
      });
      buttonAction.forEach((button) => {
        button.classList.add("hidden-delete");
      });
    };
    applyChanges();
    const observer = new MutationObserver(() => {
      applyChanges();
    });
    observer.observe(document.querySelector("form") || document.body, {
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  return null;
};
exports.SalesDetectChangesInItems = SalesDetectChangesInItems;
