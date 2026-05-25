import { errors } from "@strapi/utils";
import { validateLocalPermissions } from "../../../../utils/validateLocalPermissions";

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;

    const { data } = event.params;
    const name = data.nombre?.trim();

    if (!data.categoria_de_producto) {
      event.params.data.categoria_de_producto = {
        connect: [{ id: 1 }],
      };
    }

    if (!data.tipo_de_moneda || data.tipo_de_moneda.connect.length === 0) {
      throw new errors.ApplicationError(`Debe seleccionar una moneda`);
    }
    const tipoDeMonedaId = data.tipo_de_moneda.connect[0].id;
    if (!data.locales || data.locales.connect.length === 0) {
      throw new errors.ApplicationError(`Debe seleccionar un local`);
    }
    const localId = data.locales.connect[0].id;

    //validateLocalProductPermissions(user, localId);
    validateLocalPermissions(user, localId);

    const productoDbName = await strapi.db
      .query("api::producto.producto")
      .findOne({
        where: {
          nombre: name,
          tipo_de_moneda: { id: tipoDeMonedaId },
          locales: { id: localId },
        },
        populate: true,
      });

    if (productoDbName) {
      throw new errors.ApplicationError(
        `Ya existe un producto con el nombre ${name}`,
      );
    }

    /** */
    console.log("BEFORE CREATE PRODUCTO LIFECYCLE");
    console.log("BODY:");
    console.log(JSON.stringify(ctx.request.body, null, 2));

    console.log("DATA:");
    console.log(JSON.stringify(event.params.data, null, 2));
    /** */
  },
  async beforeUpdate(event) {
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;
    const ctxBody = ctx.request.body;
    /** esta validación se realiza para todos los datos que no vienen de ventas. */
    if (
      !strapi.requestContext
        .get()
        .url.startsWith("/content-manager/collection-types/api::venta.venta") &&
      !strapi.requestContext
        .get()
        .url.startsWith(
          "/content-manager/collection-types/api::cuenta-corriente.cuenta-corriente",
        )
    ) {
      const { data } = event.params;
      const productoDb = await strapi.db
        .query("api::producto.producto")
        .findOne({
          where: { documentId: data.documentId },
          populate: true,
        });

      /** en caso que se quiera volver a enviar el tipo de moneda vacio */
      if (
        ctxBody.tipo_de_moneda.connect.length === 0 &&
        ctxBody.tipo_de_moneda.disconnect.length > 0
      ) {
        throw new errors.ApplicationError(`Debe seleccionar una moneda`);
      }
      /** si se selecciono un tipo de moneda, evitar que se modifique el tipo de moneda que tiene el producto en la base de datos */
      if (data.tipo_de_moneda.connect.length > 0) {
        if (
          productoDb.tipo_de_moneda &&
          productoDb.tipo_de_moneda.id !== data.tipo_de_moneda.connect[0].id
        ) {
          throw new errors.ApplicationError(
            `No se puede cambiar la moneda de un producto ya creado: ${productoDb.nombre}`,
          );
        }
      }

      if (
        !data.locales ||
        (data.locales.connect.length === 0 &&
          data.locales.disconnect.length > 0)
      ) {
        throw new errors.ApplicationError(`Debe seleccionar un local`);
      }

      if (data.locales.connect.length > 0) {
        if (
          productoDb.locales &&
          productoDb.locales.id !== data.locales.connect[0].id
        ) {
          throw new errors.ApplicationError(
            `No se puede cambiar el local de un producto ya creado: ${productoDb.nombre}`,
          );
        }
      }
      
    }
    /** */
    console.log("BEFORE UPDATE PRODUCTO LIFECYCLE");
    console.log("BODY:");
    console.log(JSON.stringify(ctx.request.body, null, 2));

    console.log("DATA:");
    console.log(JSON.stringify(event.params.data, null, 2));
    /** */
  },
};

/*
function validateLocalProductPermissions(user, localId) {
  const roles = user.roles || [];

  const isSuperAdmin = roles.some(
    (role: any) => role.code === "strapi-super-admin",
  );

  if (isSuperAdmin) return;

  const hasLocalA = roles.some((role: any) => role.name === "local-a");

  const hasLocalB = roles.some((role: any) => role.name === "local-b");

  if (hasLocalA && localId !== 1) {
    throw new errors.ApplicationError(
      "Usted no tiene permisos para grabar en ese local.",
    );
  }

  if (hasLocalB && localId !== 2) {
    throw new errors.ApplicationError(
      "Usted no tiene permisos para grabar en ese local.",
    );
  }
}
*/
