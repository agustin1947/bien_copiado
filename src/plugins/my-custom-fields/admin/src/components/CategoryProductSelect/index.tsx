import { useEffect, useState } from 'react';
import { GenericSearchableSelect } from '../GenericSearchableSelect';

interface Props {
  localId: number | string | null;
  productValue?: number;
  onProductChange: (event: any, productoCompleto?: any) => void;
  name: string;
  disabled?: boolean;
  required?: boolean;
}

const CategoryProductSelect = ({
  localId,
  productValue,
  onProductChange,
  name,
  disabled,
  required,
}: Props) => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);

  // 🔹 Traer categorías
  useEffect(() => {
    fetch(`/api/categoria-de-productos?pagination[pageSize]=1000`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;
        setCategorias(data.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!productValue) return;
    fetch(`/api/productos?populate=*&filters[id][$eq]=${productValue}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;

        const producto = data.data[0];
        const categoriaId = producto.categoria_de_producto?.id;
        
        if (categoriaId) {
          setSelectedCategoria(categoriaId);
        }
      })
      .catch(console.error);
  }, [productValue]);

  // 🔹 Traer productos cuando cambia categoría
  useEffect(() => {
    if (!selectedCategoria || !localId) {
      setProductos([]);
      return;
    }

    fetch(
      `/api/productos?populate=*&filters[categoria_de_producto][id][$eq]=${selectedCategoria}&filters[locales][id][$eq]=${localId}&pagination[pageSize]=1000`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;
        setProductos(data.data);
      })
      .catch(console.error);
  }, [selectedCategoria, localId]);

  const opcionesCategorias = categorias.map((c) => ({
    id: c.id,
    label: c.nombre,
    data: c,
  }));

  const opcionesProductos = productos.map((p) => ({
    id: p.id,
    label: `${p.nombre} (${p.tipo_de_moneda?.codigo})`,
    data: p,
  }));

  return (
    <>
      {/* SELECT CATEGORIA */}
      <GenericSearchableSelect
        name="categoria"
        label="Categoría"
        options={opcionesCategorias}
        value={selectedCategoria || undefined}
        placeholder="Seleccione una categoría"
        onChange={(e) => {
          setSelectedCategoria(e.target.value);
          onProductChange({ target: { name, type: 'number', value: undefined } }, undefined);
        }}
      />

      {/* SELECT PRODUCTO */}
      <GenericSearchableSelect
        name={name}
        label="Producto"
        options={opcionesProductos}
        value={productValue}
        placeholder="Seleccione un producto"
        required={required}
        disabled={disabled || !selectedCategoria}
        onChange={(e) => {
          onProductChange(e);
        }}
        onOptionSelect={(selectedId, option) => {
          onProductChange(
            {
              target: { name, type: 'number', value: selectedId },
            },
            option.data // 🔥 ahora sí mandamos el producto completo
          );
        }}
      />
    </>
  );
};

export { CategoryProductSelect };
