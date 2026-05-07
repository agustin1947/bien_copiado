import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { CategoryProductSelect } from "./index-76MmI03l.mjs";
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
        setTipoDeVenta(data.data[0].tipo_de_venta);
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
  useEffect(() => {
    if (!tipoDeVenta) return;
    handleProductLogic(selectedProducto);
  }, [tipoDeVenta]);
  const getProductPrice = (producto, tipoDeVenta2) => {
    const esMayorista = tipoDeVenta2?.nombre?.toLowerCase().includes("mayorista");
    return esMayorista ? producto.precio_mayorista : producto.precio;
  };
  const getCantidad = (index2) => {
    const cantidadHTML = document.querySelector(
      `input[name="Productos.${index2}.cantidad"]`
    );
    const cantidad = parseInt(cantidadHTML?.value || "0");
    return cantidad;
  };
  const calculateTotals = (cantidad, precioVenta, precioCompra2) => {
    return {
      total: cantidad * precioVenta,
      ganancia: (precioVenta - precioCompra2) * cantidad
    };
  };
  const updateField = (name2, value2) => {
    console.log("update field: ", name2, value2);
    onChange({
      target: {
        name: name2,
        type: "number",
        value: value2
      }
    });
  };
  const handleProductLogic = (producto) => {
    if (!producto) {
      updateField(`Productos.${index}.total`, 0);
      updateField(`Productos.${index}.ganancia_por_item`, 0);
      return;
    }
    const cantidad = getCantidad(index);
    const precioSeleccionado = getProductPrice(producto, tipoDeVenta);
    setPrecio(precioSeleccionado);
    setPrecioCompra(producto.precio_compra);
    const { total, ganancia } = calculateTotals(
      cantidad,
      precioSeleccionado,
      producto.precio_compra
    );
    updateField(`Productos.${index}.total`, total);
    updateField(`Productos.${index}.ganancia_por_item`, ganancia);
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
          setSelectedProducto(!productoCompleto ? null : productoCompleto);
          if (!tipoDeVenta) return;
          handleProductLogic(productoCompleto);
        }
      }
    ),
    selectedProducto && /* @__PURE__ */ jsxs("div", { className: "select_customize__description", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "label-customize p-1", children: tipoDeVenta?.nombre?.toLowerCase().includes("mayorista") ? `Precio mayorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad).` : `Precio minorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad).` }),
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
