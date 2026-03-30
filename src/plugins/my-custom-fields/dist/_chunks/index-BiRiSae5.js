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
  className = "",
  allowEmptyOption = false
}) => {
  const [isOpen, setIsOpen] = react.useState(false);
  const [search, setSearch] = react.useState("");
  const containerRef = react.useRef(null);
  const optionsWithEmpty = react.useMemo(() => {
    if (!allowEmptyOption) return options;
    return [{ id: 0, label: placeholder, data: null }, ...options];
  }, [options, allowEmptyOption, placeholder]);
  const filteredOptions = react.useMemo(() => {
    if (!search) return optionsWithEmpty;
    console.log(search);
    return optionsWithEmpty.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  }, [search, optionsWithEmpty]);
  react.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedOption = optionsWithEmpty.find((option) => option.id === value);
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
const MonthlyPaymentTotals = ({ resumen }) => {
  if (!resumen) return null;
  const { entradas, salidas } = resumen;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "title_h3", children: "Totales por medio de pago" }),
    /* @__PURE__ */ jsxRuntime.jsxs("table", { className: "table w-100", children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Medio" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Entradas ARS" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Salidas ARS" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Entradas USD" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Salidas USD" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("tbody", { children: [
        /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: "Efectivo" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnPesosEfectivo }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnPesosEfectivo }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnDolaresEfectivo }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnDolaresEfectivo })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: "Transferencia" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnPesosTransferencia }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnPesosTransferencia }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnDolaresTransferencia }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnDolaresTransferencia })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: "Débito" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnPesosTarjetaDeDebito }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnPesosTarjetaDeDebito }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnDolaresTarjetaDeDebito }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnDolaresTarjetaDeDebito })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: "Crédito" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnPesosTarjetaDeCredito }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnPesosTarjetaDeCredito }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnDolaresTarjetaDeCredito }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnDolaresTarjetaDeCredito })
        ] })
      ] })
    ] })
  ] });
};
const DailySummaryTable = ({ data }) => {
  if (!data || data.length === 0) return /* @__PURE__ */ jsxRuntime.jsx("p", { children: "No hay datos" });
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "title_h3", children: "Resumen diario" }),
    /* @__PURE__ */ jsxRuntime.jsxs("table", { className: "table w-100", children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Fecha" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Entradas ARS" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Salidas ARS" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Entradas USD" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Salidas USD" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: data.map((day) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { children: new Date(day.fecha).toLocaleDateString("es-AR") }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { children: day.ingresosARS }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { children: day.egresosARS }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { children: day.ingresosUSD }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { children: day.egresosUSD })
      ] }, day.fecha)) })
    ] })
  ] });
};
const CashSummary = ({ resumen }) => {
  if (!resumen) return null;
  const { entradas, salidas } = resumen;
  const saldoARS = entradas.totalEnPesosEfectivo - salidas.totalEnPesosEfectivo;
  const saldoUSD = entradas.totalEnDolaresEfectivo - salidas.totalEnDolaresEfectivo;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "title_h3", children: "Resumen Caja (Efectivo)" }),
    /* @__PURE__ */ jsxRuntime.jsxs("table", { className: "table w-100", children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Moneda" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Entradas" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Salidas" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Saldo" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("tbody", { children: [
        /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: "ARS" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnPesosEfectivo }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnPesosEfectivo }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: saldoARS })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: "USD" }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: entradas.totalEnDolaresEfectivo }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: salidas.totalEnDolaresEfectivo }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: saldoUSD })
        ] })
      ] })
    ] })
  ] });
};
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
  const [reportData, setReportData] = react.useState(null);
  const [locals, setLocals] = react.useState([]);
  const [local, setLocal] = react.useState(null);
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
    const getLocals = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/locals");
        const data = await res.json();
        const localesFormatted = data.data.map((local2) => ({
          id: local2.id,
          label: local2.nombre,
          data: local2.id
        }));
        setLocals(localesFormatted);
      } catch (error) {
        console.error("Error cargando Locales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchYears();
    getLocals();
  }, []);
  react.useEffect(() => {
    if (year && month) {
      fetch(`/api/reportes/caja-mensual?year=${year}&month=${month}&local=${local}`).then((res) => res.json()).then((data) => {
        setReportData(data);
      });
    }
  }, [year, month, local]);
  const handleExport = () => {
    const url = `/api/reportes/caja-mensual/export?year=${year}&month=${month}&local=${local}`;
    window.open(url, "_blank");
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "filters", children: [
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
      ) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "filters_filter", children: /* @__PURE__ */ jsxRuntime.jsx(
        GenericSearchableSelect,
        {
          name: "locals",
          label: "Local",
          options: locals,
          value: local ?? "",
          disabled: !year,
          required: true,
          placeholder: "Seleccionar Local",
          onChange: (option) => {
            setLocal(Number(option?.target.value) || null);
          },
          allowEmptyOption: true
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx("button", { className: "boton-local boton-local--download", onClick: handleExport, children: "Generar reporte" }) }),
    reportData && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "reports", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "reports_table", children: /* @__PURE__ */ jsxRuntime.jsx(MonthlyPaymentTotals, { resumen: reportData.resumen }) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "reports_table", children: /* @__PURE__ */ jsxRuntime.jsx(CashSummary, { resumen: reportData.resumen }) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "reports_table", children: /* @__PURE__ */ jsxRuntime.jsx(DailySummaryTable, { data: reportData.porDia }) })
    ] })
  ] });
};
const ReporteCaja = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "title_h1", children: "Reporte Mensual" }),
    /* @__PURE__ */ jsxRuntime.jsx(FiltersByYearAndMonth, {})
  ] });
};
const ChartLine = () => /* @__PURE__ */ jsxRuntime.jsx("svg", { width: 18, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 640 640", children: /* @__PURE__ */ jsxRuntime.jsx("path", { fill: "#8e8ea9", d: "M128 128C128 110.3 113.7 96 96 96C78.3 96 64 110.3 64 128L64 464C64 508.2 99.8 544 144 544L544 544C561.7 544 576 529.7 576 512C576 494.3 561.7 480 544 480L144 480C135.2 480 128 472.8 128 464L128 128zM534.6 214.6C547.1 202.1 547.1 181.8 534.6 169.3C522.1 156.8 501.8 156.8 489.3 169.3L384 274.7L326.6 217.4C314.1 204.9 293.8 204.9 281.3 217.4L185.3 313.4C172.8 325.9 172.8 346.2 185.3 358.7C197.8 371.2 218.1 371.2 230.6 358.7L304 285.3L361.4 342.7C373.9 355.2 394.2 355.2 406.7 342.7L534.7 214.7z" }) });
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
        Input: async () => Promise.resolve().then(() => require("./index-UPTKWwB4.js")).then((module2) => ({
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
        Input: async () => Promise.resolve().then(() => require("./index-B5TVV3Lh.js")).then((module2) => ({
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
        Input: async () => Promise.resolve().then(() => require("./index-Dcwcf6sE.js")).then((module2) => ({
          default: module2.CategoryProductSelect
        }))
      },
      options: {}
    });
    app.addMenuLink({
      to: `/plugins/${PLUGIN_ID}/reporte-caja`,
      icon: ChartLine,
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
