"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const PagosParciales = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const segments = window.location.pathname.split("/");
  const documentId = segments[segments.length - 1];
  const [service, setService] = react.useState(null);
  const [ingresos, setIngresos] = react.useState([]);
  const [totalPagado, setTotalPagado] = react.useState(0);
  const [loading, setLoading] = react.useState(true);
  react.useEffect(() => {
    const fetchService = async () => {
      fetch(`/api/services?populate=*&filters[documentId][$eq]=${documentId}&sort[id]=desc`).then((res) => res.json()).then((data) => {
        if (!data?.data) {
          console.error("No hay pagos parciales");
          return;
        }
        setService(data.data[0]);
      }).catch((err) => {
        console.error("Error el service", err);
      });
    };
    if (documentId) {
      fetchService();
    }
  }, [documentId]);
  react.useEffect(() => {
    if (!service?.id) return;
    setLoading(false);
    const fetchIngresos = () => {
      fetch(`/api/ingresos?populate=*&filters[n_orden_st][$eq]=${service?.id}&sort[id]=desc`).then((res) => res.json()).then((data) => {
        if (!data?.data) {
          console.error("No hay pagos ingresos");
          return;
        }
        setIngresos(data.data);
      }).catch((err) => {
        console.error("Error el service", err);
      });
    };
    fetchIngresos();
    console.log("service actualizado:", service);
  }, [service]);
  react.useEffect(() => {
    const totalPagado2 = ingresos.reduce((acc, ingreso) => {
      return acc + Number(ingreso.total || 0);
    }, 0);
    setTotalPagado(totalPagado2);
    setLoading(false);
  }, [ingresos]);
  if (loading) return /* @__PURE__ */ jsxRuntime.jsx("p", { children: "Cargando..." });
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "h1", children: "Pagos Parciales" }),
    /* @__PURE__ */ jsxRuntime.jsx("br", {}),
    /* @__PURE__ */ jsxRuntime.jsxs("table", { border: 1, className: "table w-100", children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Id" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Título" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Fecha de ingreso" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Monto" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("tbody", { children: [
        ingresos.length === 0 && /* @__PURE__ */ jsxRuntime.jsx("tr", { children: /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: 4, children: "No se registran pagos." }) }),
        ingresos.length > 0 && ingresos.map((ingreso) => /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: ingreso.id }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: ingreso.titulo }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: (/* @__PURE__ */ new Date(ingreso.fecha_de_ingreso + "T00:00:00")).toLocaleDateString("es-AR") }),
          /* @__PURE__ */ jsxRuntime.jsxs("td", { children: [
            "$",
            ingreso.total
          ] })
        ] }, ingreso.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("br", {}),
    ingresos.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("table", { className: "table w-100", children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Total pagado" }),
        /* @__PURE__ */ jsxRuntime.jsx("th", { children: "Falta por pagar" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("td", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { style: { color: "green" }, children: [
          "$",
          totalPagado
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx("td", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { style: { color: "red" }, children: [
          "$",
          service?.total - totalPagado
        ] }) })
      ] }) })
    ] })
  ] });
};
exports.PagosParciales = PagosParciales;
