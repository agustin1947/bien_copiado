import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const PagosParciales = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const segments = window.location.pathname.split("/");
  const documentId = segments[segments.length - 1];
  const [service, setService] = useState(null);
  const [ingresos, setIngresos] = useState([]);
  const [totalPagado, setTotalPagado] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
    const totalPagado2 = ingresos.reduce((acc, ingreso) => {
      return acc + Number(ingreso.total || 0);
    }, 0);
    setTotalPagado(totalPagado2);
    setLoading(false);
  }, [ingresos]);
  if (loading) return /* @__PURE__ */ jsx("p", { children: "Cargando..." });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { className: "h1", children: "Pagos Parciales" }),
    /* @__PURE__ */ jsx("br", {}),
    /* @__PURE__ */ jsxs("table", { border: 1, className: "table w-100", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Id" }),
        /* @__PURE__ */ jsx("th", { children: "Título" }),
        /* @__PURE__ */ jsx("th", { children: "Fecha de ingreso" }),
        /* @__PURE__ */ jsx("th", { children: "Monto" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        ingresos.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, children: "No se registran pagos." }) }),
        ingresos.length > 0 && ingresos.map((ingreso) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: ingreso.id }),
          /* @__PURE__ */ jsx("td", { children: ingreso.titulo }),
          /* @__PURE__ */ jsx("td", { children: (/* @__PURE__ */ new Date(ingreso.fecha_de_ingreso + "T00:00:00")).toLocaleDateString("es-AR") }),
          /* @__PURE__ */ jsxs("td", { children: [
            "$",
            ingreso.total
          ] })
        ] }, ingreso.id))
      ] })
    ] }),
    /* @__PURE__ */ jsx("br", {}),
    ingresos.length > 0 && /* @__PURE__ */ jsxs("table", { className: "table w-100", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Total pagado" }),
        /* @__PURE__ */ jsx("th", { children: "Falta por pagar" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("b", { style: { color: "green" }, children: [
          "$",
          totalPagado
        ] }) }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("b", { style: { color: "red" }, children: [
          "$",
          service?.total - totalPagado
        ] }) })
      ] }) })
    ] })
  ] });
};
export {
  PagosParciales
};
