import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useMemo, useEffect } from "react";
const arrow = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20width='15px'%20height='15px'%20fill='%238e8ea9'%3e%3cpath%20d='m26.708%2012.708-10%2010a1%201%200%200%201-1.415%200l-10-10A1%201%200%200%201%206%2011h20a1%201%200%200%201%20.707%201.707'%3e%3c/path%3e%3c/svg%3e";
const GenericSearchableSelect = ({
  name,
  label,
  options,
  value,
  disabled = false,
  required = false,
  placeholder = "Seleccione una opción",
  onChange,
  onOptionSelect,
  type,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    console.log(search);
    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  }, [search, options]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedOption = options.find((option) => option.id === value);
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "generic_searchable_select", children: [
    label && /* @__PURE__ */ jsx("div", { className: "label-customize", children: label }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "generic_searchable_select__select input-customize",
          onClick: () => setIsOpen((prev) => !prev),
          children: [
            selectedOption ? selectedOption.label : placeholder,
            /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("img", { src: arrow, alt: "arrow", className: `${isOpen ? "arrow arrow_up" : "arrow"}` }) })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsxs("ul", { className: "generic_searchable_select__ul", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "search",
            value: search,
            className: "input-customize",
            placeholder: "Buscar...",
            onChange: (e) => setSearch(e.target.value)
          }
        ) }),
        filteredOptions.length > 0 && filteredOptions.filter((option) => option.id !== value).map((option) => /* @__PURE__ */ jsx(
          "li",
          {
            value: option.id,
            className: "generic_searchable_select__li",
            onClick: () => {
              setIsOpen(false);
              onChange({
                target: {
                  name,
                  type: type || "number",
                  value: option.id
                }
              });
              if (onOptionSelect) {
                onOptionSelect(option.id, option);
              }
              setSearch("");
            },
            children: option.label
          },
          option.id
        ))
      ] })
    ] })
  ] });
};
export {
  GenericSearchableSelect
};
