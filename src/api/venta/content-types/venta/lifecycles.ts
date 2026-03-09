import { errors } from "@strapi/utils";
const { ApplicationError } = errors;
import { factories } from "@strapi/strapi";
import { validatePaymentMethodWithTotal } from "../../../../utils/validatePaymentMethodWithTotal";

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

    if (!ctxBody.formas_de_pago || ctxBody.formas_de_pago.length === 0) {
      throw new errors.ApplicationError(`Debe seleccionar una "Forma de pago"`);
    }

    const validatePayment = await validatePaymentMethodWithTotal(
      ctxBody.formas_de_pago,
      ctxBody.total,
    );
    if (validatePayment.error) {
      throw new errors.ApplicationError(`${validatePayment.message}`);
    }

    for (const producto of ctxBody.Productos) {
      if (!producto.productoItem) {
        throw new errors.ApplicationError(
          `Debe seleccionar un producto en cada item.`,
        );
      }
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
      if (cantidad === 0) {
        throw new errors.ApplicationError(
          `La cantidad del producto ${nombreProducto} no puede ser 0.`,
        );
      }

      if (cantidad > stock) {
        throw new errors.ApplicationError(
          `La cantidad supera el stock, usted dispone de ${stock} unidades de ${nombreProducto}`,
        );
      }
    }
    (strapi as any).io.emit("refresh", "actualizado");
  },
  async afterCreate(event) {
    const ventaId = event.result.id;

    const ventaOriginal = await strapi.entityService.findOne(
      "api::venta.venta",
      ventaId,
      {
        populate: "*",
      },
    );

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
          idProductoOriginal: id,
        });
      }
    }

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
    );

    const fechaIngreso = ventaOriginal["fecha_de_ingreso"];
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];

    if (hoyStr > fechaIngreso) {
      throw new errors.ApplicationError(
        "No se puede editar la venta después del día de ingreso.",
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
    
    const validatePayment = await validatePaymentMethodWithTotal(
      ctxBody.formas_de_pago,
      ctxBody.total,
    );
    if (validatePayment.error) {
      throw new errors.ApplicationError(`${validatePayment.message}`);
    }
  },
  async afterUpdate(event) {
    const ventaId = event.result.id;

    if (event.params?.data?.__internal_update) {
      return;
    }

    const ventaOriginal = await strapi.entityService.findOne(
      "api::venta.venta",
      ventaId,
      {
        populate: "*",
      },
    );

    const productosActualizados = [];

    for (const producto of ventaOriginal["Productos"]) {
      const cantidad = producto.cantidad;
      const id = parseInt(producto.productoItem);
      const cantidadOriginal = producto.cantidadOriginal;
      const idProductoOriginal = producto.idProductoOriginal;

      const productoDb = await strapi.entityService.findOne(
        "api::producto.producto",
        id,
      );

      // 🟢 1- PRODUCTO NUEVO
      if (idProductoOriginal == null) {
        if (!productoDb || productoDb.stock < cantidad) {
          throw new errors.ApplicationError(
            `La cantidad supera el stock, usted dispone de ${productoDb?.stock ?? 0} unidades`,
          );
        }

        await strapi.entityService.update("api::producto.producto", id, {
          data: {
            stock: productoDb.stock - cantidad,
          },
        });

        productosActualizados.push({
          ...producto,
          cantidadOriginal: cantidad,
          idProductoOriginal: id,
        });

        continue;
      }

      if (id !== idProductoOriginal) {
        throw new errors.ApplicationError(`No puede cambiar de producto.`);
      }

      // 🟢 2- PRODUCTO SIN EDITAR
      if (cantidad === cantidadOriginal) {
        productosActualizados.push(producto);
        continue;
      }

      // 🟢 3- PRODUCTO EDITADO
      let diferenciaCantidad = 0;
      let stockNuevo = 0;

      /** actualizo stock */
      if (cantidad > cantidadOriginal) {
        diferenciaCantidad = cantidad - cantidadOriginal;
        if (productoDb.stock < diferenciaCantidad) {
          throw new errors.ApplicationError(
            `La cantidad supera el stock, usted dispone de ${productoDb.stock} unidades de ${productoDb.nombre}`,
          );
        }
        stockNuevo = productoDb.stock - diferenciaCantidad;
      } else {
        diferenciaCantidad = cantidadOriginal - cantidad;
        stockNuevo = productoDb.stock + diferenciaCantidad;
      }

      await strapi.entityService.update("api::producto.producto", id, {
        data: {
          stock: stockNuevo,
        },
      });

      if (cantidad !== 0) {
        // Si la cantidad es igual a 0 el producto sera eliminado de la venta.
        productosActualizados.push({
          // ❗❗ producto.id es el id del componente en el que se grabo el producto.
          id: producto.id,
          __component: "productos.productos",
          productoItem: id,
          cantidad: cantidad,
          cantidadOriginal: cantidad,
          total: producto.total,
          ganancia_por_item: producto.ganancia_por_item,
        });
      }
    }

    await strapi.entityService.update("api::venta.venta", ventaId, {
      data: {
        Productos: productosActualizados,
        __internal_update: true,
      },
    });
  },
  async beforeDelete(event) {
    const ventaId = event.params.where.id;
    const venta = await strapi.entityService.findOne(
      "api::venta.venta",
      ventaId,
      {
        populate: {
          Productos: true,
        },
      },
    );

    if (!venta || !venta["Productos"]?.length) return;

    for (const producto of venta["Productos"]) {
      const cantidadOriginal = producto.cantidadOriginal;
      const productoId = parseInt(producto.productoItem);

      if (!cantidadOriginal || !productoId) continue;

      const productoDb = await strapi.entityService.findOne(
        "api::producto.producto",
        productoId,
      );

      if (!productoDb) continue;

      await strapi.entityService.update("api::producto.producto", productoId, {
        data: {
          stock: productoDb.stock + cantidadOriginal,
        },
      });
    }
  },
};
