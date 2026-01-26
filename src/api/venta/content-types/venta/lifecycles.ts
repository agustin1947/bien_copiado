import { errors } from "@strapi/utils";
const { ApplicationError } = errors;
import { factories } from "@strapi/strapi";

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;

    if (
      !ctxBody.tipo_de_moneda ||
      ctxBody.tipo_de_moneda.length === 0 ||
      ctxBody.tipo_de_moneda.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Tipo de moneda"`);
    }

    const tipoDeMonedaId = ctxBody.tipo_de_moneda.connect[0].id;

    if (ctxBody.Productos.length == 0) {
      throw new errors.ApplicationError(
        "Para crear una venta como mínimo debe haber un producto.",
      );
    }

    const localId = ctx.request.query.localId;
    if (!localId) {
      throw new errors.ApplicationError(`Debe seleccionar un local`);
    }

    event.params.data.local = {
      connect: [{ id: localId }],
    };

    const tipoDeVentaId = ctx.request.query.tipoDeVentaId;
    if (!tipoDeVentaId) {
      throw new errors.ApplicationError(`Debe seleccionar un tipo de venta`);
    }

    event.params.data.tipo_de_venta = {
      connect: [{ id: tipoDeVentaId }],
    };

    if (
      !ctxBody.forma_de_pago ||
      ctxBody.forma_de_pago.length === 0 ||
      ctxBody.forma_de_pago.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Forma de pago"`);
    }

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
    (strapi as any).io.emit("refresh", "actualizado");
  },
  async afterCreate(event) {
    //const ctx = strapi.requestContext.get();
    //const ctxBody = ctx.request.body;
    const ventaId = event.result.id;
    //console.log(`ventaId: ${ventaId}`);
    const ventaOriginal = await strapi.entityService.findOne(
      "api::venta.venta",
      ventaId,
      {
        populate: "*",
      },
    );
    //console.log(`Venta: `, ventaOriginal);
    //const productos = ctxBody.Productos;
    const productosActualizados = [];

    for (const producto of ventaOriginal["Productos"]) {
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
          __component: "productos.productos",
          productoItem: id,
          cantidad: cantidad,
          cantidadOriginal: cantidad, // 🔥 ACÁ se guarda bien
          total: producto.total,
          ganancia_por_item: producto.ganancia_por_item,
        });
      }
    }
    console.log("Producto actualizado: ", productosActualizados)
    await strapi.entityService.update("api::venta.venta", ventaId, {
      data: {
        Productos: productosActualizados,
      },
    });

  },
  async beforeUpdate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    const { params } = event;
    const ventaId = params.where.id;

    const ventaOriginal = await strapi.entityService.findOne(
      "api::venta.venta",
      ventaId,
      {
        populate: "*",
      },
    );
    //console.log(ventaOriginal);
    //console.log("ctxBody", ctxBody);
    //console.log("TIPO DE MONEDA 1", ctxBody.tipo_de_moneda)
    if (
      ctxBody.tipo_de_moneda.connect.length === 0 &&
      ctxBody.tipo_de_moneda.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un "Tipo de moneda"`);
    }
    //console.log("TIPO DE MONEDA 2", ctxBody.tipo_de_moneda.connect)
    //console.log("TIPO DE MONEDA 2", ctxBody.tipo_de_moneda.disconnect)
    if (
      ctxBody.tipo_de_moneda.connect.length > 0 &&
      (ctxBody.tipo_de_moneda.disconnect && ctxBody.tipo_de_moneda.disconnect.length > 0)
      
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

    for (const producto of ctxBody.Productos) {
      console.log(producto);
    }

    /*throw new errors.ApplicationError(
      `No se puede editar una venta una vez creada.`,
    );*/
  },
};
