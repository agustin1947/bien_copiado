import { errors } from "@strapi/utils";
const { ApplicationError } = errors;

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    //console.log("ctxBody: ", ctxBody)
    if (
      !ctxBody.cliente ||
      ctxBody.cliente === null ||
      (ctxBody.cliente.connect && ctxBody.cliente.connect.length === 0)
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Cliente"`);
    }

    if (
      !ctxBody.tipo_de_moneda ||
      ctxBody.tipo_de_moneda.length === 0 ||
      ctxBody.tipo_de_moneda.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Tipo de moneda"`);
    }

  },
  async afterCreate(event) {},
};
