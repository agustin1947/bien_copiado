import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (
      !data.local ||
      data.local.length === 0 ||
      data.local.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un local.`);
    }

    if (
      !data.estado_de_service ||
      data.estado_de_service.length === 0 ||
      data.estado_de_service.connect.length === 0
    ) {
      throw new errors.ApplicationError(
        `Debe seleccionar un estado para el servicio técnico.`,
      );
    }

    if (
      !data.forma_de_pago ||
      data.forma_de_pago.length === 0 ||
      data.forma_de_pago.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar una forma de pago.`);
    }
  },
  async afterCreate(event) {
    const { result } = event;
    const { data } = event.params;

    if (!result.numero_de_orden) {
      await strapi.db.query("api::service.service").update({
        where: { id: result.id },
        data: {
          numero_de_orden: result.id,
          fecha_de_ingreso: result.fecha_de_ingreso,
          fecha_de_entrega: result.fecha_de_entrega,
          local: { connect: [], disconnect: [] },
          forma_de_pago: { connect: [], disconnect: [] },
          estado_de_service: { connect: [], disconnect: [] },
        },
      });
    }
    (strapi as any).io.emit("respuesta", "actualizado");
    (strapi as any).io.emit("refresh", "actualizado");
  },
  async beforeUpdate(event) {
    const { data, where } = event.params;
    const serviceId = where.id;

    const serviceData = await strapi.db.query("api::service.service").findOne({
      where: { id: serviceId },
      populate: ["estado_de_service"],
    });

    if (data.local.connect.length === 0 && data.local.disconnect.length > 0) {
      throw new errors.ApplicationError(`Debe seleccionar un local.`);
    }
    if (data.local.connect.length > 0 && data.local.disconnect.length > 0) {
      if (data.local.connect[0].id !== data.local.disconnect[0].id) {
        throw new errors.ApplicationError(`No se puede editar el local.`);
      }
    }
    if (
      data.estado_de_service.connect.length === 0 &&
      data.estado_de_service.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un estado.`);
    }
    if (
      data.forma_de_pago.connect.length === 0 &&
      data.forma_de_pago.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar una forma de pago.`);
    }
    if (
      data.forma_de_pago.connect.length > 0 &&
      data.forma_de_pago.disconnect.length > 0
    ) {
      if (
        data.forma_de_pago.connect[0].id !== data.forma_de_pago.disconnect[0].id
      ) {
        throw new errors.ApplicationError(
          `No se puede editar la forma de pago.`,
        );
      }
    }

    if (!data.numero_de_orden) {
      event.params.data.numero_de_orden = where.id;
    }
    console.log("Data: ", data)
    const fechaDeEntrega = data?.fecha_de_entrega?.split("T")[0];
    if (fechaDeEntrega) {
      if (fechaDeEntrega < data?.fecha_de_ingreso) {
        throw new errors.ApplicationError(
          "La fecha de entrega no puede ser menor a la fecha de ingreso.",
        );
      }
      
      if (serviceData?.estado_de_service?.id !== 4) {
        throw new errors.ApplicationError(
          `No se puede cargar una fecha de entrega, sin actualizar el estado a "Entregado"`,
        );
      }
    }

    if (
      data.estado_de_service?.connect &&
      data.estado_de_service?.connect[0] &&
      data?.estado_de_service?.connect[0]?.id === 4
    ) {
      if (data?.fecha_de_entrega === null) {
        throw new errors.ApplicationError(
          `No se puede actualizar el estado a Entregado, sin agregarle una "Fecha de entrega"`,
        );
      }
    }
  },
  async afterUpdate(event) {
    (strapi as any).io.emit("respuesta", "actualizado");
    (strapi as any).io.emit("refresh", "actualizado");
  },
  async beforeDelete(event) {
    const { where } = event.params;
    const serviceId = where.id;

    await strapi.db.query("api::ingreso.ingreso").deleteMany({
      where: { n_orden_st: serviceId },
    });
  },
};
