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

    const localId = ctx.request.query.localId;
    if (!localId) {
      throw new errors.ApplicationError(`Debe seleccionar un local`);
    }

    event.params.data.local = {
      connect: [{ id: localId }],
    };
    //console.log("DATA: ", event.params.data)
    //throw new errors.ApplicationError(`ERROR`);
  },
  async afterCreate(event) {
    const { result } = event;
    //const { data } = event.params;
    if (!result.numero_de_orden) {
      await strapi.db.query("api::cuenta-corriente.cuenta-corriente").update({
        where: { id: result.id },
        data: {
          numero_de_orden: result.id,
        },
      });
    }
  },
};
