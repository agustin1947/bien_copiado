import { useState, useEffect } from 'react';
import { GenericSearchableSelect } from '../GenericSearchableSelect';
import { CategoryProductSelect } from '../CategoryProductSelect';

const SelectCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const queryParams = new URLSearchParams(window.location.search);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);
  const [precio, setPrecio] = useState<number>(0);
  const [precioCompra, setPrecioCompra] = useState<number>(0);
  const [tipoDeVenta, setTipoDeVenta] = useState<any>(null);
  const tipoDeVentaId = queryParams.get('tipoDeVentaId');
  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);
  const pathname = window.location.pathname;

  const [localId, setLocalId] = useState<string | null>(null);

  useEffect(() => {
    let urlLocalId = queryParams.get('localId');

    if (!urlLocalId) {
      let urlSplit = window.location.href.split('/');
      let documentId = urlSplit[urlSplit.length - 1];

      let api = 'ventas';
      if (pathname.includes('api::cuenta-corriente.cuenta-corriente')) {
        api = 'cuenta-corrientes';
      }

      fetch(`/api/${api}?populate=*&filters[documentId][$eq]=${documentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data?.data) return;
          setLocalId(data.data[0].local.id);
          setTipoDeVenta(data.data[0].tipo_de_venta);
        })
        .catch((err) => {
          console.error('Error al cargar productos', err);
        });
    } else {
      setLocalId(urlLocalId);
    }
  }, []);

  useEffect(() => {
    if (!tipoDeVentaId) return;

    fetch(`/api/tipo-de-ventas?populate=*&filters[id][$eq]=${tipoDeVentaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;
        setTipoDeVenta(data.data[0]);
      })
      .catch((err) => console.error('Error al cargar tipo de venta', err));
  }, [tipoDeVentaId]);

  useEffect(() => {
    if (!tipoDeVenta) return;
    handleProductLogic(selectedProducto);
  }, [tipoDeVenta]);

  const getProductPrice = (producto: any, tipoDeVenta: any) => {
    const esMayorista = tipoDeVenta?.nombre?.toLowerCase().includes('mayorista');

    return esMayorista ? producto.precio_mayorista : producto.precio;
  };

  const getCantidad = (index: number) => {
    const cantidadHTML: HTMLInputElement | null = document.querySelector(
      `input[name="Productos.${index}.cantidad"]`
    );

    const cantidad = parseInt(cantidadHTML?.value || '0');
    return cantidad;
  };

  const calculateTotals = (cantidad: number, precioVenta: number, precioCompra: number) => {
    return {
      total: cantidad * precioVenta,
      ganancia: (precioVenta - precioCompra) * cantidad,
    };
  };
  22;

  const updateField = (name: string, value: any) => {
    onChange({
      target: {
        name: name,
        type: 'number',
        value: value,
      },
    });
  };

  const handleProductLogic = (producto: any) => {
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

  return (
    <div className="select_customize">
      <CategoryProductSelect
        localId={localId}
        name={name}
        productValue={value}
        required={required}
        disabled={disabled}
        onProductChange={(e: any, productoCompleto?: any) => {
          onChange(e);
          setSelectedProducto(!productoCompleto ? null : productoCompleto);
          if (!tipoDeVenta) return;
          handleProductLogic(productoCompleto);
        }}
      />
      {selectedProducto && (
        <div className="select_customize__description">
          <div>
            <label className="label-customize p-1">
              {tipoDeVenta?.nombre?.toLowerCase().includes('mayorista')
                ? `Precio mayorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad).`
                : `Precio minorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad).`}
            </label>
            <input
              className="d-none"
              type="number"
              name={`total-base-${index}`}
              value={precio}
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="label-customize p-1">{`Precio de costo: ${selectedProducto.tipo_de_moneda?.simbolo} ${precioCompra} (por unidad)`}</label>

            <input
              className="d-none"
              type="number"
              name={`total-compra-${index}`}
              value={precioCompra}
              readOnly
              disabled
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { SelectCustomize };
