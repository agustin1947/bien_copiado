"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const GenericSearchableSelect = ({
  name,
  label,
  options,
  value,
  disabled = false,
  required = false,
  placeholder = "Seleccione una opción",
  onChange,
  className = ""
}) => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
    label && /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: name, className: "label-customize", children: label }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      "select",
      {
        name,
        id: name,
        value: value ?? "",
        disabled,
        required,
        onChange: (e) => onChange(e.target.value),
        className: `input-customize ${className}`,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: placeholder }),
          options.map((option) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: option.id, children: option.label }, option.id))
        ]
      }
    )
  ] });
};
exports.GenericSearchableSelect = GenericSearchableSelect;
