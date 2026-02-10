import { errors } from "@strapi/utils";
import { factories } from "@strapi/strapi";
const { ApplicationError } = errors;

export default {
    async beforeCreate(event) {
        const ctx = strapi.requestContext.get();
        const ctxBody = ctx.request.body;
        
        if(ctxBody.n_orden_st && ctxBody.n_orden_cc ) {
            throw new errors.ApplicationError(`No puede ingresar número de orden de Cuenta Corriente y Servicio Técnico al mismo tiempo, debe elegir una o ninguna de las dos opciones`);
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

        throw new errors.ApplicationError(`ERROR`);

        //(strapi as any).io.emit("refresh", "actualizado");
    },
    async afterCreate(event) {
    
    },
    async beforeUpdate(event) {
        //(strapi as any).io.emit("refresh", "actualizado");
    },
    async afterUpdate(event) {

    }
}