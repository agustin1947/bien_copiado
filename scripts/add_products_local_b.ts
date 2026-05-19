export default async function addProductsLocalB(strapi) {
  const countProductosLocalB = await strapi.db
    .query("api::producto-local-b.producto-local-b")
    .count();
  if (countProductosLocalB === 0) {
    const productos = await strapi.db.query("api::producto.producto").findMany({
      where: {
        locales: {
          id: 2,
        },
      },
      populate: true,
    });

    for (const producto of productos) {
      await strapi.db.query("api::producto-local-b.producto-local-b").create({
        data: {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio_compra: producto.precio_compra,
          precio: producto.precio,
          precio_mayorista: producto.precio_mayorista,
          stock: producto.stock,

          locales: {
            connect: [{ id: producto.locales.id }],
          },

          tipo_de_moneda: {
            connect: [{ id: producto.tipo_de_moneda.id }],
          },

          categoria_de_producto: {
            connect: [{ id: producto.categoria_de_producto.id }],
          },
        },
      });
    }

    strapi.log.info("8️⃣ ✔ Productos - Local B: creados");
  } else {
    strapi.log.info("❌ Productos - Local B: la tabla ya fue cargada.");
  }
}
