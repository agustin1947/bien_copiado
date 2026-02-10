import { errors } from "@strapi/utils";
import { factories } from "@strapi/strapi";
const { ApplicationError } = errors;

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    //console.log(ctxBody)

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

      // validar si coinciden los montos
      if (
        ordenST.total &&
        ctxBody.monto &&
        parseFloat(ordenST.total) !== parseFloat(ctxBody.monto)
      ) {
        throw new errors.ApplicationError(
          `El número de orden de Servicio Técnico ingresado tiene un monto diferente al monto ingresado en el ingreso`,
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
