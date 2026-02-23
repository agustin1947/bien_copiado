export const updateToStockAfterDeleting = async (uid, entityId) => {
  const entity = await strapi.entityService.findOne(uid, entityId, {
    populate: {
      Productos: true,
    },
  });
  
  if (!entity || !entity["Productos"]?.length) return;

  let updatedCount = 0;

  for (const producto of entity["Productos"]) {
    const cantidadOriginal = producto.cantidadOriginal;
    const productoId = parseInt(producto.productoItem);

    if (!cantidadOriginal || !productoId) continue;

    const productoDb = await strapi.entityService.findOne(
      "api::producto.producto",
      productoId,
    );
    
    if (!productoDb) continue;

    await strapi.entityService.update("api::producto.producto", productoId, {
      data: {
        stock: productoDb.stock + cantidadOriginal,
      },
    });
    updatedCount++;
  }
  return {count: updatedCount}
};
