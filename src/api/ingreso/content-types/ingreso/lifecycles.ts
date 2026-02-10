import { errors } from "@strapi/utils";
import { factories } from "@strapi/strapi";
import ingreso from "../../controllers/ingreso";

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
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    const { params } = event;
    const ingresoId = params.where.id;

    console.log("ctxBody", ctxBody);
    //(strapi as any).io.emit("refresh", "actualizado");

    const ingresoOriginal = await strapi.db
        .query("api::ingreso.ingreso")
        .findOne({
          where: { id: ingresoId },
          populate: true,
        });

    console.log("ingresoOriginal", ingresoOriginal);
    const localOriginal = ingresoOriginal.local?.id;
    const tipoDeMonedaOriginal = ingresoOriginal.tipo_de_moneda?.id;
    const formaDePagoOriginal = ingresoOriginal.forma_de_pago?.id;

    // que no se carguen números de orden de cuenta corriente y servicio técnico al mismo tiempo
    if (ctxBody.n_orden_st && ctxBody.n_orden_cc) {
      throw new errors.ApplicationError(
        `No puede ingresar número de orden de Cuenta Corriente y Servicio Técnico al mismo tiempo, debe elegir una o ninguna de las dos opciones`,
      );
    }
    
    // que no se modifique el n de orden
    /** si se cargo en principio n de orden de st */
    if(ingresoOriginal.n_orden_st){
        if(ctxBody.n_orden_st !== ingresoOriginal.n_orden_st){
            throw new errors.ApplicationError(
                `No se puede modificar el número de orden de Servicio Técnico una vez creado el ingreso`,
              );
        }
    }

    /** si se cargo en principio n de orden de cc */
    if(ingresoOriginal.n_orden_cc){ 
        if(ctxBody.n_orden_cc !== ingresoOriginal.n_orden_cc){ 
            throw new errors.ApplicationError(
                `No se puede modificar el número de orden de Cuenta Corriente una vez creado el ingreso`,
              );
        }
    }
    

    // que se seleccione un local y que no se modfique
    if((ctxBody.local.connect.length > 0 && ctxBody.local.connect[0].id !== localOriginal) || 
        (ctxBody.local.connect.length === 0 && ctxBody.local.disconnect.length > 0)){
        throw new errors.ApplicationError(`No se puede modificar el "Local" una vez creado el ingreso`);
    }

    // que se seleccione un tipo de moneda y que no se modifique
    if((ctxBody.tipo_de_moneda.connect.length > 0 && ctxBody.tipo_de_moneda.connect[0].id !== tipoDeMonedaOriginal) || 
        (ctxBody.tipo_de_moneda.connect.length === 0 && ctxBody.tipo_de_moneda.disconnect.length > 0)){
        throw new errors.ApplicationError(`No se puede modificar el "Tipo de Moneda" una vez creado el ingreso`);
    }
    // que se seleccione una forma de pago
    if(ctxBody.forma_de_pago.connect.length === 0 && ctxBody.forma_de_pago.disconnect.length > 0){
        throw new errors.ApplicationError(`Debe ingresar al menos una "Forma de pago"`);
    }
    //validar montos
    // obtener todos los ingresos que tengan ese número de orden de servicio técnico para sumar sus montos
    //el monto obtenido de los ingresos restarlo al monto total del servicio técnico
    // en caso que la diferencia cea cero, quiere decir que ya se termino de pagar.
    // el monto del ingreso tiene que ser menor o igual a esta diferencia

    throw new errors.ApplicationError(`BEFORE UPDATE`,);

  },
  async afterUpdate(event) {},
};
