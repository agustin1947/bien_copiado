import { errors } from "@strapi/utils";
import { validateLocalPermissions } from "../../../../utils/validateLocalPermissions";

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;

    if (!event.params.data.fecha_de_ingreso) {
      throw new errors.ApplicationError(
        `Debe seleccionar una fecha de ingreso.`,
      );
    }

    const dateOfEntry = new Date(event.params.data.fecha_de_ingreso)
      .toISOString()
      .split("T")[0]; // "2025-12-21";

    if (
      !event.params.data.local ||
      event.params.data.local.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un local.`);
    }

    const localId = event.params.data.local.connect[0].id;
    validateLocalPermissions(user, localId);

    const cajaExistente = await strapi.db
      .query("api::caja-diaria.caja-diaria")
      .findOne({
        where: {
          fecha_de_ingreso: dateOfEntry,
          local: {
            id: localId, // <--- acá filtrás por ID
          },
        },
        populate: true,
      });

    if (cajaExistente) {
      throw new errors.ApplicationError(
        `Ya existe una caja diaria creada hoy (${cajaExistente.documentId}).`,
      );
    }
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;

    const caja = await strapi.db.query("api::caja-diaria.caja-diaria").findOne({
      where: {
        documentId: data.documentId,
      },
      populate: true,
    });

    if (
      !data.local ||
      (data.local.connect.length === 0 && data.local.disconnect.length > 0)
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un local.`);
    }

    if (data.local?.connect && data.local?.connect.length > 0) {
      console.log("EDITAR CAJA DIARIA");
      console.log("CTX BODY: ", data)
      const localId = data.local.connect[0].id;
      validateLocalPermissions(user, localId);
    }

    /*if(data.local?.connect.length > 0 && data.local?.connect[0].id != caja.local.id) {
      throw new errors.ApplicationError(
        `No puede editar el local.`
      );      
    }

    if (caja) {
      const createdAt = new Date(caja.createdAt);
      const now = new Date();

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);

      const fueCreadaHoy = createdAt >= startOfToday && createdAt <= endOfToday;

      if(!fueCreadaHoy){
        throw new errors.ApplicationError(`No es posible editar una caja correspondiente a una fecha anterior.`);
      }
    }*/
  },
};
