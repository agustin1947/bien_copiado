import { useRef, useEffect, useState, useMemo } from "react";
import { jsxs, jsx } from "react/jsx-runtime";
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
  const ref = useRef(setPlugin);
  useEffect(() => {
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
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [yearsOptions, setYearsOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/reporte/years");
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
  return /* @__PURE__ */ jsxs("div", { className: "filters", children: [
    /* @__PURE__ */ jsx("div", { className: "filters_filter", children: /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsx("div", { className: "filters_filter", children: /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx("div", { className: "title_h1", children: "Reporte Caja" }),
    /* @__PURE__ */ jsx(FiltersByYearAndMonth, {})
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
        Input: async () => import("./index-B8I8osnA.mjs").then((module) => ({
          default: module.SelectCustomize
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
        Input: async () => import("./index-CqFpGrDx.mjs").then((module) => ({
          default: module.InputNumberCustomize
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
        Input: async () => import("./index-2BMoRILb.mjs").then((module) => ({
          default: module.InputNumberTotalItemCustomize
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
        Input: async () => import("./index-_Jzzhpy8.mjs").then((module) => ({
          default: module.InputTotalVentaCustomize
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
        Input: async () => import("./index-Bj59QtbH.mjs").then((module) => ({
          default: module.InputNombreVenta
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
        Input: async () => import("./index-BgQyltPX.mjs").then((module) => ({
          default: module.InputNombreLocal
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
        Input: async () => import("./index-DUwP-3EA.mjs").then((module) => ({
          default: module.InputTotalGastosItem
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
        Input: async () => import("./index-Yuz0ID84.mjs").then((module) => ({
          default: module.InputCantidadGastosItem
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
        Input: async () => import("./index-STt4ZQqs.mjs").then((module) => ({
          default: module.InputPrecioPorUnidadGastosItem
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
        Input: async () => import("./index-B6_K87qI.mjs").then((module) => ({
          default: module.InputTotalGastos
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
        Input: async () => import("./index-vWDnzmpe.mjs").then((module) => ({
          default: module.SelectCustomizeGasto
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
        Input: async () => import("./index-BekRk7qZ.mjs").then((module) => ({
          default: module.InputServiceTotalGanancia
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
        Input: async () => import("./index-D6xlgTMB.mjs").then((module) => ({
          default: module.TitleSection
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
        Input: async () => import("./index-DkoQaWbd.mjs").then((module) => ({
          default: module.InputNumberVentaGananciaItem
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
        Input: async () => import("./index-1kgmCoKn.mjs").then((module) => ({
          default: module.InputTotalVentaGanancia
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
        Input: async () => import("./index-BQdLQVXX.mjs").then((module) => ({
          default: module.InputTotalGenerico
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
        Input: async () => import("./index-C1lTNTMr.mjs").then((module) => ({
          default: module.VerCajaDiaria
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
        Input: async () => import("./index-JmrmMIIE.mjs").then((module) => ({
          default: module.SalesDetectChangesInItems
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
        Input: async () => import("./index-BbwVlTMq.mjs").then((module) => ({
          default: module.PagosParciales
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
        Input: async () => Promise.resolve().then(() => index$1).then((module) => ({
          default: module.GenericSearchableSelect
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
        Input: async () => import("./index-DgggBfmC.mjs").then((module) => ({
          default: module.CategoryProductSelect
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
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("./en-Byx4XI2L.mjs") }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
export {
  GenericSearchableSelect as G,
  index as i
};
