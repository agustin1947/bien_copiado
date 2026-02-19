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
    const tipoDeMonedaId = ctxBody.tipo_de_moneda.connect[0].id;

    const localId = ctx.request.query.localId;
    if (!localId) {
      throw new errors.ApplicationError(`Debe seleccionar un local`);
    }

    event.params.data.local = {
      connect: [{ id: localId }],
    };

    if (ctxBody.Productos.length > 0) {
      for (const producto of ctxBody.Productos) {
        const cantidad = producto.cantidad;
        const id = parseInt(producto.productoItem);

        const productoDb = await strapi.db
          .query("api::producto.producto")
          .findOne({
            where: { id: id },
            populate: true,
          });

        if (productoDb.tipo_de_moneda.id !== tipoDeMonedaId) {
          throw new ApplicationError(
            `La moneda del producto ${productoDb.nombre} no coincide con la moneda seleccionada para la venta.`,
          );
        }

        const stock = productoDb.stock;
        const nombreProducto = productoDb.nombre;
        if (cantidad > stock || cantidad == 0) {
          throw new errors.ApplicationError(
            `La cantidad supera el stock, usted dispone de ${stock} unidades de ${nombreProducto}`,
          );
        }
      }
    }
  },
  async afterCreate(event) {
    const { result } = event;
    const ccId = result.id;

    const cuentaCorriente = await strapi.entityService.findOne(
      "api::cuenta-corriente.cuenta-corriente" as any,
      ccId,
      {
        populate: "*",
      },
    );

    if (!result.numero_de_orden) {
      await strapi.db.query("api::cuenta-corriente.cuenta-corriente").update({
        where: { id: result.id },
        data: {
          numero_de_orden: result.id,
        },
      });
    }

    if (
      cuentaCorriente["Productos"] &&
      cuentaCorriente["Productos"].length > 0
    ) {
      const productosActualizados = [];

      for (const producto of cuentaCorriente["Productos"]) {
        const cantidad = producto.cantidad;
        const id = parseInt(producto.productoItem);

        const productoDb = await strapi.entityService.findOne(
          "api::producto.producto",
          id,
        );

        if (productoDb) {
          const stockNuevo = productoDb.stock - cantidad;

          await strapi.entityService.update("api::producto.producto", id, {
            data: {
              stock: stockNuevo < 0 ? 0 : stockNuevo,
            },
          });

          productosActualizados.push({
            id: producto.id,
            __component: "cuenta-corriente.cuenta-corriente-items",
            productoItem: id,
            cantidad: cantidad,
            cantidadOriginal: cantidad, // 🔥 ACÁ se guarda bien
            total: producto.total,
            ganancia_por_item: producto.ganancia_por_item,
            idProductoOriginal: id,
          });
        }
      }

      await strapi.entityService.update(
        "api::cuenta-corriente.cuenta-corriente",
        ccId,
        {
          data: {
            Productos: productosActualizados,
          },
        },
      );
    }
  },
  async beforeUpdate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    const { params } = event;
    const ccId = params.where.id;

    const ccOriginal = await strapi.entityService.findOne(
      "api::cuenta-corriente.cuenta-corriente",
      ccId,
    );
    console.log("ccOriginal: ", ccOriginal);
    const fechaIngreso = ccOriginal["fecha_de_ingreso"];
    console.log("fechaIngreso: ", fechaIngreso);
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];
    console.log("Hoy: ", hoyStr);
    if (hoyStr > fechaIngreso) {
      throw new errors.ApplicationError(
        "No se puede editar una Cuenta Corriente después del día de ingreso.",
      );
    }
    if (
      ctxBody.tipo_de_moneda.connect.length === 0 &&
      ctxBody.tipo_de_moneda.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Tipo de moneda"`);
    }

    if (
      ctxBody.tipo_de_moneda.connect.length > 0 &&
      ctxBody.tipo_de_moneda.disconnect &&
      ctxBody.tipo_de_moneda.disconnect.length > 0
    ) {
      if (
        ctxBody.tipo_de_moneda.connect[0].id !==
        ctxBody.tipo_de_moneda.disconnect[0].id
      ) {
        throw new errors.ApplicationError(
          `No puede editar el "Tipo de moneda"`,
        );
      }
    }

    if (
      ctxBody.cliente.connect.length === 0 &&
      ctxBody.cliente.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Cliente"`);
    }

    if (
      ctxBody.cliente.connect.length > 0 &&
      ctxBody.cliente.disconnect &&
      ctxBody.cliente.disconnect.length > 0
    ) {
      if (
        ctxBody.cliente.connect[0].id !==
        ctxBody.cliente.disconnect[0].id
      ) {
        throw new errors.ApplicationError(
          `No puede editar el "Cliente"`,
        );
      }
    }

  },
  async afterUpdate(event) {},
};
