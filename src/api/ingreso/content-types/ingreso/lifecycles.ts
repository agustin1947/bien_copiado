import { errors } from "@strapi/utils";
import { factories } from "@strapi/strapi";
import ingreso from "../../controllers/ingreso";
import { get } from "http";

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
      const diff = await validateEntryAgainstOrder(ctxBody, "api::service.service");
      if (diff.error) {
        throw new errors.ApplicationError(diff.message);
      }
    }
  },
  async afterCreate(event) {},
  async beforeUpdate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    const { params } = event;
    const ingresoId = params.where.id;

    const ingresoOriginal = await strapi.db
      .query("api::ingreso.ingreso")
      .findOne({
        where: { id: ingresoId },
        populate: true,
      });

    const localOriginal = ingresoOriginal.local?.id;
    const tipoDeMonedaOriginal = ingresoOriginal.tipo_de_moneda?.id;

    // que no se carguen números de orden de cuenta corriente y servicio técnico al mismo tiempo
    if (ctxBody.n_orden_st && ctxBody.n_orden_cc) {
      throw new errors.ApplicationError(
        `No puede ingresar número de orden de Cuenta Corriente y Servicio Técnico al mismo tiempo, debe elegir una o ninguna de las dos opciones`,
      );
    }

    /** EVITAR EL CAMBIO DE N DE ORDEN */
    /** si se cargo en principio n de orden de st */
    if (ingresoOriginal.n_orden_st) {
      if (ctxBody.n_orden_st !== ingresoOriginal.n_orden_st) {
        throw new errors.ApplicationError(
          `No se puede modificar el número de orden de Servicio Técnico una vez creado el ingreso`,
        );
      }
    }

    /** si se cargo en principio n de orden de cc */
    if (ingresoOriginal.n_orden_cc) {
      if (ctxBody.n_orden_cc !== ingresoOriginal.n_orden_cc) {
        throw new errors.ApplicationError(
          `No se puede modificar el número de orden de Cuenta Corriente una vez creado el ingreso`,
        );
      }
    }

    // que se seleccione un local y que no se modfique
    if (
      (ctxBody.local.connect.length > 0 &&
        ctxBody.local.connect[0].id !== localOriginal) ||
      (ctxBody.local.connect.length === 0 &&
        ctxBody.local.disconnect.length > 0)
    ) {
      throw new errors.ApplicationError(
        `No se puede modificar el "Local" una vez creado el ingreso`,
      );
    }

    // que se seleccione un tipo de moneda y que no se modifique
    if (
      (ctxBody.tipo_de_moneda.connect.length > 0 &&
        ctxBody.tipo_de_moneda.connect[0].id !== tipoDeMonedaOriginal) ||
      (ctxBody.tipo_de_moneda.connect.length === 0 &&
        ctxBody.tipo_de_moneda.disconnect.length > 0)
    ) {
      throw new errors.ApplicationError(
        `No se puede modificar el "Tipo de Moneda" una vez creado el ingreso`,
      );
    }
    // que se seleccione una forma de pago
    if (
      ctxBody.forma_de_pago.connect.length === 0 &&
      ctxBody.forma_de_pago.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(
        `Debe ingresar al menos una "Forma de pago"`,
      );
    }

    if (ctxBody.n_orden_st && !ctxBody.n_orden_cc) {
      const diff = await validateEntryAgainstOrder(ctxBody, "api::service.service", ingresoId);
      if (diff.error) {
        throw new errors.ApplicationError(diff.message);
      }
    }
  },
  async afterUpdate(event) {},
};

const validateEntryAgainstOrder = async (ctxBody, api, ingresoId = null) => {
  const name =
    api === "api::service.service" ? "Servicio Técnico" : "Cuenta Corriente";
  const n_orden =
    api === "api::service.service" ? ctxBody.n_orden_st : ctxBody.n_orden_cc;

  const orden = await strapi.db.query(api).findOne({
    where: { id: n_orden },
    populate: true,
  });

  if (!orden) {
    return {
      error: true,
      message: `${name}: El número de orden ingresado no existe.`,
    };
  }

  // los service siempre son en pesos
  if (
    api === "api::service.service" &&
    ctxBody.tipo_de_moneda.connect[0] &&
    ctxBody.tipo_de_moneda.connect[0].id !== 1
  ) {
    return {
      error: true,
      message: `${name}: El número de orden ingresado tiene un tipo de moneda diferente al seleccionado en el ingreso.`,
    };  
  }

  // validar si tienen el mismo local
  if (ctxBody.local.connect[0] && orden.local?.id !== ctxBody.local.connect[0].id) {
    return {
      error: true,
      message: `${name}: El número de orden ingresado tiene un local diferente al seleccionado en el ingreso.`,
    };
  }

  const n_orden_ingresos_relacionados =
    api === "api::service.service"
      ? { n_orden_st: ctxBody.n_orden_st }
      : { n_orden_cc: ctxBody.n_orden_cc };

  const whereClause = {
    ...n_orden_ingresos_relacionados,
    ...(ingresoId && { id: { $ne: ingresoId } }),
  };

  const ingresosRelacionados = await strapi.db
    .query("api::ingreso.ingreso")
    .findMany({
      where: whereClause,
    });

  const pagosParciales = ingresosRelacionados.reduce((total, ingreso) => {
    return total + parseFloat(ingreso.monto);
  }, 0);

  const diferencia = parseFloat(orden.total) - pagosParciales;

  if (diferencia === 0) {
    return {
      error: true,
      message: `${name}: el pago ya está completado`,
    };
  }

  if (ctxBody.monto > diferencia) {
    return {
      error: true,
      message: `${name}: el monto del ingreso excede la diferencia restante`,
    };
  }

  return { error: false };
};
