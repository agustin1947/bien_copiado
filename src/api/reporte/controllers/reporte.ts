export default {
  async getYears(ctx) {
    try {
      const result = await strapi.db
        .query("api::caja-diaria.caja-diaria")
        .findOne({
          orderBy: {
            fecha_de_ingreso: "asc",
          },
        });
      
      const yearStarted = result
        ? new Date(result.fecha_de_ingreso).getFullYear()
        : new Date().getFullYear();

      const currentYear = new Date().getFullYear();

      const years = Array.from(
        { length: currentYear - yearStarted + 1 },
        (_, i) => yearStarted + i,
      );
      
      ctx.body = years;
    } catch (error) {
      console.error(error);
      ctx.throw(500, "Error obteniendo años");
    }
  },
};
