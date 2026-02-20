export const updateToStockAfterDeleting = async (uid, entityId) => {
    const entity = await strapi.entityService.findOne(
      uid,
      entityId,
      {
        populate: {
          Productos: true,
        },
      }
    );
    console.log(entity)
    if (!entity || !entity["Productos"]?.length) return;

    for (const producto of entity["Productos"]) {
      const cantidadOriginal = producto.cantidadOriginal;
      const productoId = parseInt(producto.productoItem);

      if (!cantidadOriginal || !productoId) continue;

      const productoDb = await strapi.entityService.findOne(
        "api::producto.producto",
        productoId
      );
      console.log(productoDb)
      if (!productoDb) continue;

      await strapi.entityService.update("api::producto.producto", productoId, {
        data: {
          stock: productoDb.stock + cantidadOriginal,
        },
      });
    }
}