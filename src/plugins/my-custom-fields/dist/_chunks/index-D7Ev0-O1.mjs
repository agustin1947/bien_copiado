import { jsxs, jsx } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs("div", { children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: name, className: "label-customize", children: label }),
    /* @__PURE__ */ jsxs(
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
          /* @__PURE__ */ jsx("option", { value: "", children: placeholder }),
          options.map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.label }, option.id))
        ]
      }
    )
  ] });
};
export {
  GenericSearchableSelect
};
