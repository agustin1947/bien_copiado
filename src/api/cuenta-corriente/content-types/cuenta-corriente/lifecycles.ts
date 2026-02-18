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
  },
  async afterCreate(event) {},
};
