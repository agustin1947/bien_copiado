export default async function seedCategoriaDeProducto(strapi) {
  const ventasCount = await strapi.db
    .query("api::categoria-de-producto.categoria-de-producto")
    .count();

  if (ventasCount === 0) {
    await strapi.db.query("api::categoria-de-producto.categoria-de-producto").createMany({
      data: [
        { id: 1, nombre: "Sin categoría" },
        { id: 2, nombre: "Telefonía" },
        { id: 3, nombre: "Accesorios" },
        { id: 4, nombre: "Consolas" },
        { id: 5, nombre: "Gamer" },
      ],
    });

    strapi.log.info("5️⃣ ✔ Categoría de productos creadas");
  }else{
    strapi.log.info("5️⃣ ❌ Categoría de producto: la tabla ya fue cargada.");
  }
}
