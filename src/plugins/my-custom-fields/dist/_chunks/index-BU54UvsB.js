"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const index = require("./index-CigGbG3F.js");
const SelectCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = react.useState([]);
  const [selectedProducto, setSelectedProducto] = react.useState(null);
  const [precio, setPrecio] = react.useState(0);
  const [precioCompra, setPrecioCompra] = react.useState(0);
  const [tipoDeVenta, setTipoDeVenta] = react.useState(null);
  const localId = queryParams.get("localId");
  const tipoDeVentaId = queryParams.get("tipoDeVentaId");
  const nameSplit = name.split(".");
  const index$1 = parseInt(nameSplit[1]);
  const pathname = window.location.pathname;
  react.useEffect(() => {
    if (!localId) {
      let urlSplit = window.location.href.split("/");
      let documentId = urlSplit[urlSplit.length - 1];
      let api = "ventas";
      if (pathname.includes("api::cuenta-corriente.cuenta-corriente")) {
        api = "cuenta-corrientes";
      }
      fetch(`/api/${api}?populate=*&filters[documentId][$eq]=${documentId}`).then((res) => res.json()).then((data) => {
        if (!data?.data) return;
        filtrarLocalesPorLocal(data.data[0].local.id);
      }).catch((err) => {
        console.error("Error al cargar productos", err);
      });
    } else {
      filtrarLocalesPorLocal(localId);
    }
    getTipoDeVenta(tipoDeVentaId);
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
  const getTipoDeVenta = (tipoDeVentaId2) => {
    fetch(`/api/tipo-de-ventas?populate=*&filters[id][$eq]=${tipoDeVentaId2}`).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      setTipoDeVenta(data.data[0]);
    }).catch((err) => {
      console.error("Error al cargar tipo de venta", err);
    });
  };
  const handleChange = (selectedId) => {
    const selectedProductoChange = productos.find((p) => p.id === parseInt(selectedId));
    setSelectedProducto(selectedProductoChange);
    const cantidadHTML = document.querySelector(
      `input[name="Productos.${index$1}.cantidad"]`
    );
    const cantidad = cantidadHTML?.value;
    onChange({
      target: { name, type: attribute.type, value: selectedId }
    });
    if (selectedProductoChange) {
      let precioSelected = tipoDeVenta?.nombre?.toLowerCase().includes("mayorista") ? selectedProductoChange.precio_mayorista : selectedProductoChange.precio;
      setPrecio(precioSelected);
      selectedProductoChange.stock;
      setPrecioCompra(selectedProductoChange.precio_compra);
      const totalGanancia = precioSelected * parseInt(cantidad || "0") - selectedProductoChange.precio_compra * parseInt(cantidad || "0");
      onChange({
        target: {
          name: `Productos.${index$1}.total`,
          type: "number",
          value: parseInt(cantidad || "0") > 0 ? precioSelected * parseInt(cantidad || "0") : 0
        }
      });
      onChange({
        target: {
          name: `Productos.${index$1}.ganancia_por_item`,
          type: "number",
          value: totalGanancia
        }
      });
    }
  };
  const opcionesProductos = productos.map((producto) => ({
    id: producto.id,
    label: `${producto.nombre} (${producto.tipo_de_moneda?.codigo})`
  }));
  react.useEffect(() => {
    if (value && productos.length > 0) {
      handleChange(value);
    }
    console.log(productos);
  }, [value, productos]);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      index.GenericSearchableSelect,
      {
        name,
        label: "Producto",
        options: opcionesProductos,
        value,
        placeholder: "Seleccione un Producto sss",
        required,
        disabled,
        onChange: (selectedId) => handleChange(selectedId)
      }
    ),
    selectedProducto && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize p-1", children: tipoDeVenta?.nombre?.toLowerCase().includes("mayorista") ? `Precio mayorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad)` : `Precio minorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad)` }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          className: "d-none",
          type: "number",
          name: `total-base-${index$1}`,
          value: precio,
          readOnly: true,
          disabled: true
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize p-1", children: `Precio de compra: ${selectedProducto.tipo_de_moneda?.simbolo} ${precioCompra} (por unidad)` }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          className: "d-none",
          type: "number",
          name: `total-compra-${index$1}`,
          value: precioCompra,
          readOnly: true,
          disabled: true
        }
      )
    ] })
  ] });
};
exports.SelectCustomize = SelectCustomize;
