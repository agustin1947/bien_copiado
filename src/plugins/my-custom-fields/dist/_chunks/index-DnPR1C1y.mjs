import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { CategoryProductSelect } from "./index-CCKWwttK.mjs";
const SelectCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const queryParams = new URLSearchParams(window.location.search);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [precio, setPrecio] = useState(0);
  const [precioCompra, setPrecioCompra] = useState(0);
  const [tipoDeVenta, setTipoDeVenta] = useState(null);
  const tipoDeVentaId = queryParams.get("tipoDeVentaId");
  const nameSplit = name.split(".");
  const index = parseInt(nameSplit[1]);
  const pathname = window.location.pathname;
  const [localId, setLocalId] = useState(null);
  useEffect(() => {
    let urlLocalId = queryParams.get("localId");
    if (!urlLocalId) {
      let urlSplit = window.location.href.split("/");
      let documentId = urlSplit[urlSplit.length - 1];
      let api = "ventas";
      if (pathname.includes("api::cuenta-corriente.cuenta-corriente")) {
        api = "cuenta-corrientes";
      }
      fetch(`/api/${api}?populate=*&filters[documentId][$eq]=${documentId}`).then((res) => res.json()).then((data) => {
        if (!data?.data) return;
        setLocalId(data.data[0].local.id);
      }).catch((err) => {
        console.error("Error al cargar productos", err);
      });
    } else {
      setLocalId(urlLocalId);
    }
  }, []);
  useEffect(() => {
    if (!tipoDeVentaId) return;
    fetch(`/api/tipo-de-ventas?populate=*&filters[id][$eq]=${tipoDeVentaId}`).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      setTipoDeVenta(data.data[0]);
    }).catch((err) => console.error("Error al cargar tipo de venta", err));
  }, [tipoDeVentaId]);
  const handleProductLogic = (producto) => {
    if (!producto) {
      setSelectedProducto(null);
      onChange({
        target: {
          name: `Productos.${index}.total`,
          type: "number",
          value: 0
        }
      });
      onChange({
        target: {
          name: `Productos.${index}.ganancia_por_item`,
          type: "number",
          value: 0
        }
      });
      return;
    }
    setSelectedProducto(producto);
    const cantidadHTML = document.querySelector(
      `input[name="Productos.${index}.cantidad"]`
    );
    const cantidad = parseInt(cantidadHTML?.value || "0");
    const esMayorista = tipoDeVenta?.nombre?.toLowerCase().includes("mayorista");
    const precioSeleccionado = esMayorista ? producto.precio_mayorista : producto.precio;
    setPrecio(precioSeleccionado);
    setPrecioCompra(producto.precio_compra);
    const total = cantidad > 0 ? precioSeleccionado * cantidad : 0;
    const ganancia = precioSeleccionado * cantidad - producto.precio_compra * cantidad;
    onChange({
      target: {
        name: `Productos.${index}.total`,
        type: "number",
        value: total
      }
    });
    onChange({
      target: {
        name: `Productos.${index}.ganancia_por_item`,
        type: "number",
        value: ganancia
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "select_customize", children: [
    /* @__PURE__ */ jsx(
      CategoryProductSelect,
      {
        localId,
        name,
        productValue: value,
        required,
        disabled,
        onProductChange: (e, productoCompleto) => {
          onChange(e);
          handleProductLogic(productoCompleto);
        }
      }
    ),
    selectedProducto && /* @__PURE__ */ jsxs("div", { className: "select_customize__description", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "label-customize p-1", children: tipoDeVenta?.nombre?.toLowerCase().includes("mayorista") ? `Precio mayorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad)` : `Precio minorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad)` }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "d-none",
            type: "number",
            name: `total-base-${index}`,
            value: precio,
            readOnly: true,
            disabled: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "label-customize p-1", children: `Precio de costo: ${selectedProducto.tipo_de_moneda?.simbolo} ${precioCompra} (por unidad)` }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "d-none",
            type: "number",
            name: `total-compra-${index}`,
            value: precioCompra,
            readOnly: true,
            disabled: true
          }
        )
      ] })
    ] })
  ] });
};
export {
  SelectCustomize
};
