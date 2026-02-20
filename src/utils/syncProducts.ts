type ContentTypeID = "api::venta.venta"|"api::cuenta-corriente.cuenta-corriente";

interface SyncProductosParams {
  uid: ContentTypeID;
  entityId: number;
  componentUID: string;
  listProducts?: string;
}

export const syncProducts = async ({uid, entityId, componentUID, listProducts = "Productos"}: SyncProductosParams) => {
  
const entity = await strapi.entityService.findOne(
    uid,
    entityId,
    {
      populate: "*",
    },
  );

  const productosActualizados = [];

  for (const producto of entity[listProducts]) {

    const cantidad = producto.cantidad;
    const id = parseInt(producto.productoItem);
    const cantidadOriginal = producto.cantidadOriginal;
    const idProductoOriginal = producto.idProductoOriginal;

    const productoDb = await strapi.entityService.findOne(
      "api::producto.producto",
      id,
    );

    // 🟢 1- PRODUCTO NUEVO
    if (idProductoOriginal == null) {
      if (!productoDb || productoDb.stock < cantidad) {
        return {
            error: true,
            message: `La cantidad supera el stock, usted dispone de ${productoDb?.stock ?? 0} unidades`
        }
      }

      await strapi.entityService.update("api::producto.producto", id, {
        data: {
          stock: productoDb.stock - cantidad,
        },
      });

      productosActualizados.push({
        ...producto,
        cantidadOriginal: cantidad,
        idProductoOriginal: id,
      });

      continue;
    }

    if (id !== idProductoOriginal) {
        return {
            error: true,
            message: `No puede cambiar de producto.`
        }
    }

    // 🟢 2- PRODUCTO SIN EDITAR
    if (cantidad === cantidadOriginal) {
      productosActualizados.push(producto);
      continue;
    }

    // 🟢 3- PRODUCTO EDITADO
    let diferenciaCantidad = 0;
    let stockNuevo = 0;

    /** actualizo stock */
    if (cantidad > cantidadOriginal) {
      diferenciaCantidad = cantidad - cantidadOriginal;
      if (productoDb.stock < diferenciaCantidad) {
        return {
            error: true,
            message: `La cantidad supera el stock, usted dispone de ${productoDb.stock} unidades de ${productoDb.nombre}`
        }
      }
      stockNuevo = productoDb.stock - diferenciaCantidad;
    } else {
      diferenciaCantidad = cantidadOriginal - cantidad;
      stockNuevo = productoDb.stock + diferenciaCantidad;
    }

    await strapi.entityService.update("api::producto.producto", id, {
      data: {
        stock: stockNuevo,
      },
    });

    if (cantidad !== 0) {
      // Si la cantidad es igual a 0 el producto sera eliminado de la venta.
      productosActualizados.push({
        // ❗❗ producto.id es el id del componente en el que se grabo el producto.
        id: producto.id,
        __component: componentUID,
        productoItem: id,
        cantidad: cantidad,
        cantidadOriginal: cantidad,
        total: producto.total,
        ganancia_por_item: producto.ganancia_por_item,
      });
    }
  }

  await strapi.entityService.update(uid, entityId, {
    data: {
      Productos: productosActualizados,
      __internal_update: true,
    },
  });

  return {
    error: false
  }
};
