import { jsx, Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
const SalesDetectChangesInItems = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  useEffect(() => {
    const timer = setTimeout(() => {
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
  return /* @__PURE__ */ jsx(Fragment, {});
};
export {
  SalesDetectChangesInItems
};
