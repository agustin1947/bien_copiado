"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const index = require("./index-CYq97mxp.js");
const CategoryProductSelect = ({
  localId,
  productValue,
  onProductChange,
  name,
  disabled,
  required
}) => {
  const [categorias, setCategorias] = react.useState([]);
  const [productos, setProductos] = react.useState([]);
  const [selectedCategoria, setSelectedCategoria] = react.useState(null);
  react.useEffect(() => {
    fetch(`/api/categoria-de-productos?pagination[pageSize]=1000`).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      setCategorias(data.data);
    }).catch(console.error);
  }, []);
  react.useEffect(() => {
    console.log("productValue: ", productValue);
    if (!productValue) return;
    fetch(`/api/productos?populate=*&filters[id][$eq]=${productValue}`).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      const producto = data.data[0];
      const categoriaId = producto.categoria_de_producto?.id;
      console.log("Producto seleccionado: ", producto);
      if (categoriaId) {
        setSelectedCategoria(categoriaId);
      }
      onProductChange({ target: { name, type: "number", value: productValue } }, producto);
    }).catch(console.error);
  }, [productValue]);
  react.useEffect(() => {
    if (!selectedCategoria || !localId) {
      setProductos([]);
      return;
    }
    fetch(
      `/api/productos?populate=*&filters[categoria_de_producto][id][$eq]=${selectedCategoria}&filters[locales][id][$eq]=${localId}&pagination[pageSize]=1000`
    ).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      setProductos(data.data);
    }).catch(console.error);
  }, [selectedCategoria, localId]);
  const opcionesCategorias = categorias.map((c) => ({
    id: c.id,
    label: c.nombre,
    data: c
  }));
  const opcionesProductos = productos.map((p) => ({
    id: p.id,
    label: `${p.nombre} (${p.tipo_de_moneda?.codigo})`,
    data: p
  }));
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      index.GenericSearchableSelect,
      {
        name: "categoria",
        label: "Categoría",
        options: opcionesCategorias,
        value: selectedCategoria || void 0,
        placeholder: "Seleccione una categoría",
        onChange: (e) => {
          setSelectedCategoria(e.target.value);
          onProductChange({ target: { name, type: "number", value: void 0 } }, void 0);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      index.GenericSearchableSelect,
      {
        name,
        label: "Producto",
        options: opcionesProductos,
        value: productValue,
        placeholder: "Seleccione un producto",
        required,
        disabled: disabled || !selectedCategoria,
        onChange: (e) => {
          onProductChange(e);
        },
        onOptionSelect: (selectedId, option) => {
          onProductChange(
            {
              target: { name, type: "number", value: selectedId }
            },
            option.data
            // 🔥 ahora sí mandamos el producto completo
          );
        }
      }
    )
  ] });
};
exports.CategoryProductSelect = CategoryProductSelect;
