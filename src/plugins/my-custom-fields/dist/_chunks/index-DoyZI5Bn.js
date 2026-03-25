"use strict";
const react = require("react");
const jsxRuntime = require("react/jsx-runtime");
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "my-custom-fields";
const Initializer = ({ setPlugin }) => {
  const ref = react.useRef(setPlugin);
  react.useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
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
  const [isOpen, setIsOpen] = react.useState(false);
  const [search, setSearch] = react.useState("");
  const containerRef = react.useRef(null);
  const filteredOptions = react.useMemo(() => {
    if (!search) return options;
    console.log(search);
    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  }, [search, options]);
  react.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedOption = options.find((option) => option.id === value);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: containerRef, className: "generic_searchable_select", children: [
    label && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "label-customize", children: label }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: "generic_searchable_select__select input-customize",
          onClick: () => setIsOpen((prev) => !prev),
          children: [
            selectedOption ? selectedOption.label : placeholder,
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: arrow, alt: "arrow", className: `${isOpen ? "arrow arrow_up" : "arrow"}` }) })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: "generic_searchable_select__ul", children: [
        /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx(
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
        filteredOptions.length > 0 && filteredOptions.filter((option) => option.id !== value).map((option) => /* @__PURE__ */ jsxRuntime.jsx(
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
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GenericSearchableSelect
}, Symbol.toStringTag, { value: "Module" }));
const MONTHS = [
  { id: 1, label: "Enero", data: 1 },
  { id: 2, label: "Febrero", data: 2 },
  { id: 3, label: "Marzo", data: 3 },
  { id: 4, label: "Abril", data: 4 },
  { id: 5, label: "Mayo", data: 5 },
  { id: 6, label: "Junio", data: 6 },
  { id: 7, label: "Julio", data: 7 },
  { id: 8, label: "Agosto", data: 8 },
  { id: 9, label: "Septiembre", data: 9 },
  { id: 10, label: "Octubre", data: 10 },
  { id: 11, label: "Noviembre", data: 11 },
  { id: 12, label: "Diciembre", data: 12 }
];
const FiltersByYearAndMonth = () => {
  const [year, setYear] = react.useState(null);
  const [month, setMonth] = react.useState(null);
  const [yearsOptions, setYearsOptions] = react.useState([]);
  const [loading, setLoading] = react.useState(false);
  react.useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/reportes/years");
        const data = await res.json();
        setYearsOptions(data);
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        const yearExists = data.find((y) => y.data === currentYear);
        if (yearExists) {
          setYear(currentYear);
        } else if (data.length > 0) {
          setYear(data[data.length - 1].data);
        }
        const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
        setMonth(currentMonth);
      } catch (error) {
        console.error("Error cargando años", error);
      } finally {
        setLoading(false);
      }
    };
    fetchYears();
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "filters", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "filters_filter", children: /* @__PURE__ */ jsxRuntime.jsx(
      GenericSearchableSelect,
      {
        name: "year",
        label: "Año",
        options: yearsOptions,
        value: year ?? "",
        disabled: loading,
        required: true,
        placeholder: "Seleccionar Año",
        onChange: (option) => {
          setYear(Number(option?.target.value) || null);
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "filters_filter", children: /* @__PURE__ */ jsxRuntime.jsx(
      GenericSearchableSelect,
      {
        name: "month",
        label: "Mes",
        options: MONTHS,
        value: month ?? "",
        disabled: !year,
        required: true,
        placeholder: "Seleccionar Mes",
        onChange: (option) => {
          setMonth(Number(option?.target.value) || null);
        }
      }
    ) })
  ] });
};
const ReporteCaja = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "title_h1", children: "Reporte Caja" }),
    /* @__PURE__ */ jsxRuntime.jsx(FiltersByYearAndMonth, {})
  ] });
};
const index = {
  register(app) {
    app.customFields.register({
      name: "my-custom-field",
      pluginId: PLUGIN_ID,
      type: "integer",
      intlLabel: {
        id: "my-custom-fields-id-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "my-custom-fields-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-DkkJXkTl.js")).then((module2) => ({
          default: module2.SelectCustomize
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "my-input-number-field",
      pluginId: PLUGIN_ID,
      type: "integer",
      intlLabel: {
        id: "my-input-number-field-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "my-input-number-field-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-pogELDak.js")).then((module2) => ({
          default: module2.InputNumberCustomize
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "my-input-number-total-field",
      pluginId: PLUGIN_ID,
      type: "integer",
      intlLabel: {
        id: "my-input-number-total-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "my-input-number-total-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-BmbC3AWp.js")).then((module2) => ({
          default: module2.InputNumberTotalItemCustomize
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "my-input-number-total-venta-field",
      pluginId: PLUGIN_ID,
      type: "integer",
      intlLabel: {
        id: "my-input-number-total-venta-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "my-input-number-total-venta-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-BvnlXQFY.js")).then((module2) => ({
          default: module2.InputTotalVentaCustomize
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-nombre-venta",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-nombre-venta-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-nombre-venta-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-DzWZEf3l.js")).then((module2) => ({
          default: module2.InputNombreVenta
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-nombre-local",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-nombre-local-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-nombre-local-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-BP7hUBrc.js")).then((module2) => ({
          default: module2.InputNombreLocal
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-total-gastos-item",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-total-gastos-item-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-total-gastos-item-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-CiElwRqv.js")).then((module2) => ({
          default: module2.InputTotalGastosItem
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-cantidad-gastos-item",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-cantidad-gastos-item-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-cantidad-gastos-item-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-Bs1vA-VX.js")).then((module2) => ({
          default: module2.InputCantidadGastosItem
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-precio-por-unidad-gastos-item",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-precio-por-unidad-gastos-item-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-precio-por-unidad-gastos-item-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-D6LRObuF.js")).then((module2) => ({
          default: module2.InputPrecioPorUnidadGastosItem
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-total-gastos",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-total-gastos-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-total-gastos-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-Bb0IO-3-.js")).then((module2) => ({
          default: module2.InputTotalGastos
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "select-customize-gasto",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "select-customize-gasto-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "select-customize-gasto-id-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-D6ME4oqv.js")).then((module2) => ({
          default: module2.SelectCustomizeGasto
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-service-total-ganancia",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-service-total-ganancia-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-service-total-ganancia-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-ClUyAwDT.js")).then((module2) => ({
          default: module2.InputServiceTotalGanancia
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "title-section",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "title-section-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "title-section-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-B_HXBpob.js")).then((module2) => ({
          default: module2.TitleSection
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-number-venta-ganancia-item",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-number-venta-ganancia-item-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-number-venta-ganancia-item-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-CUXZNluD.js")).then((module2) => ({
          default: module2.InputNumberVentaGananciaItem
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-total-venta-ganancia",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-total-venta-ganancia-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-total-venta-ganancia-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-DGok1S7K.js")).then((module2) => ({
          default: module2.InputTotalVentaGanancia
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-total-generico",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-total-generico-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-total-generico-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-MwkviL5C.js")).then((module2) => ({
          default: module2.InputTotalGenerico
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "ver-caja-diaria",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "ver-caja-diaria-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "ver-caja-diaria-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-B2cJ_fD9.js")).then((module2) => ({
          default: module2.VerCajaDiaria
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "sales-detect-changes-in-items",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "sales-detect-changes-in-items-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "sales-detect-changes-in-items-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-B9D-jT9m.js")).then((module2) => ({
          default: module2.SalesDetectChangesInItems
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "pagos-parciales",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "pagos-parciales-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "pagos-parciales-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-DYunx6Lk.js")).then((module2) => ({
          default: module2.PagosParciales
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "generic_searchable_select",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "generic_searchable_select_label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "generic_searchable_select_description",
        defaultMessage: "Componente: desplegable genérico"
      },
      components: {
        Input: async () => Promise.resolve().then(() => index$1).then((module2) => ({
          default: module2.GenericSearchableSelect
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "category_product_select",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "category_product_select_label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "category_product_select_description",
        defaultMessage: "Componente: desplegable de categorías de productos"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./index-BSRb-NEo.js")).then((module2) => ({
          default: module2.CategoryProductSelect
        }))
      },
      options: {}
    });
    app.addMenuLink({
      to: `/plugins/${PLUGIN_ID}/reporte-caja`,
      icon: () => "📊",
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: "Reportes"
      },
      Component: async () => ReporteCaja,
      permissions: []
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("./en-B4KWt_jN.js")) }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
exports.GenericSearchableSelect = GenericSearchableSelect;
exports.index = index;
