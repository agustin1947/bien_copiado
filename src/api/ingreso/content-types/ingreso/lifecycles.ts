import { errors } from "@strapi/utils";
import { factories } from "@strapi/strapi";

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;

    if (ctxBody.n_orden_st && ctxBody.n_orden_cc) {
      throw new errors.ApplicationError(
        `No puede ingresar número de orden de Cuenta Corriente y Servicio Técnico al mismo tiempo, debe elegir una o ninguna de las dos opciones`,
      );
    }

    if (
      !ctxBody.local ||
      !ctxBody.local.connect ||
      ctxBody.local.length === 0 ||
      ctxBody.local.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Local"`);
    }

    if (
      !ctxBody.tipo_de_moneda ||
      !ctxBody.tipo_de_moneda.connect ||
      ctxBody.tipo_de_moneda.length === 0 ||
      ctxBody.tipo_de_moneda.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Tipo de moneda"`);
    }

    if (
      !ctxBody.forma_de_pago ||
      !ctxBody.forma_de_pago.connect ||
      ctxBody.forma_de_pago.length === 0 ||
      ctxBody.forma_de_pago.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Forma de pago"`);
    }

    // en caso que se complete número de orden de un servicio técnico.
    if (ctxBody.n_orden_st && !ctxBody.n_orden_cc) {
      const ordenST = await strapi.db.query("api::service.service").findOne({
        where: { id: ctxBody.n_orden_st },
        populate: true,
      });

      if (!ordenST) {
        throw new errors.ApplicationError(
          `El número de orden de Servicio Técnico ingresado no existe`,
        );
      }

      // los service siempre son en pesos
      if (ctxBody.tipo_de_moneda.connect[0].id !== 1) {
        throw new errors.ApplicationError(
          `El número de orden de Servicio Técnico ingresado tiene un tipo de moneda diferente al seleccionado en el ingreso`,
        );
      }

      // validar si tienen el mismo local
      if (ordenST.local?.id !== ctxBody.local.connect[0].id) {
        throw new errors.ApplicationError(
          `El número de orden de Servicio Técnico ingresado tiene un local diferente al seleccionado en el ingreso`,
        );
      }

      // validar forma de pago
      if (ordenST.forma_de_pago?.id !== ctxBody.forma_de_pago.connect[0].id) {
        throw new errors.ApplicationError(
          `El número de orden de Servicio Técnico ingresado tiene una forma de pago diferente a la seleccionada en el ingreso`,
        );
      }

      // validar montos

      // obtener todos los ingresos que tengan ese número de orden de servicio técnico para sumar sus montos
      const ingresosRelacionados = await strapi.db
        .query("api::ingreso.ingreso")
        .findMany({
          where: { n_orden_st: ctxBody.n_orden_st },
        });

      const pagosParciales = ingresosRelacionados.reduce((total, ingreso) => {
        return total + parseFloat(ingreso.monto);
      }, 0);

      //el monto obtenido de los ingresos restarlo al monto total del servicio técnico
      const diferencia = parseFloat(ordenST.total) - pagosParciales;

      // en caso que la diferencia cea cero, quiere decir que ya se termino de pagar.
      if (diferencia === 0) {
        throw new errors.ApplicationError(
          `El pago del Servicio Técnico ya está completado`,
        );
      }

      // el monto del ingreso tiene que ser menor o igual a esta diferencia
      if (ctxBody.monto > diferencia) {
        throw new errors.ApplicationError(
          `El monto del ingreso excede la diferencia restante del Servicio Técnico`,
        );
      }
    }
  },
  async afterCreate(event) {},
  async beforeUpdate(event) {
    //(strapi as any).io.emit("refresh", "actualizado");
  },
  async afterUpdate(event) {},
};
