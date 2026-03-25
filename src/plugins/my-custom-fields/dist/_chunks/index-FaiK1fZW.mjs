import { jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { G as GenericSearchableSelect } from "./index-e1hSZI8H.mjs";
const SelectCustomizeGasto = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = useState([]);
  const localId = queryParams.get("localId");
  const nameSplit = name.split(".");
  parseInt(nameSplit[1]);
  useEffect(() => {
    if (!localId) {
      let urlSplit = window.location.href.split("/");
      let documentId = urlSplit[urlSplit.length - 1];
      fetch(`/api/gastos?populate=*&filters[documentId][$eq]=${documentId}`).then((res) => res.json()).then((data) => {
        if (!data?.data) return;
        filtrarLocalesPorLocal(data.data[0].local.id);
      }).catch((err) => {
        console.error("Error al cargar productos", err);
      });
    } else {
      filtrarLocalesPorLocal(localId);
    }
  }, []);
  const filtrarLocalesPorLocal = (localId2) => {
    fetch(
      `/api/productos?populate=*&filters[locales][id][$eq]=${localId2}&sort=nombre:desc&pagination[pageSize]=1000`
    ).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      setProductos(data.data);
    }).catch((err) => {
      console.error("Error al cargar productos", err);
    });
  };
  const handleChange = (e) => {
    const selectedId = e.target.value;
    onChange({
      target: { name, type: attribute.type, value: selectedId }
    });
  };
  const opcionesProductos = productos.map((p) => ({
    id: p.id,
    label: `${p.nombre} (${p.tipo_de_moneda?.codigo})`,
    data: p
  }));
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    GenericSearchableSelect,
    {
      name,
      label: "Producto",
      options: opcionesProductos,
      value: value ?? "",
      placeholder: "Seleccione un producto",
      required,
      disabled,
      onChange: handleChange
    }
  ) });
};
export {
  SelectCustomizeGasto
};
