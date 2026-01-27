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
      ventaId
    );
    console.log("VENTA ORIGINAL: ", ventaOriginal)
    
    const fechaIngreso = ventaOriginal["fecha_de_ingreso"];
    console.log("FECHA DE INGRESO: ", fechaIngreso);
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];
    console.log("FECHA DE HOY", hoyStr);
    
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
        if (cantidad === 0) {
          throw new errors.ApplicationError(
            `La cantidad de ${productoDb.nombre} no puede ser cero`,
          );
        }
        diferenciaCantidad = cantidadOriginal - cantidad;
        stockNuevo = productoDb.stock + diferenciaCantidad;
      }

      await strapi.entityService.update("api::producto.producto", id, {
        data: {
          stock: stockNuevo,
        },
      });

      // ❗❗ producto.id es el id del componente en el que se grabo el producto.
      productosActualizados.push({
        id: producto.id,
        __component: "productos.productos",
        productoItem: id,
        cantidad: cantidad,
        cantidadOriginal: cantidad,
        total: producto.total,
        ganancia_por_item: producto.ganancia_por_item,
      });
    }
    
    await strapi.entityService.update("api::venta.venta", ventaId, {
      data: {
        Productos: productosActualizados,
        __internal_update: true,
      },
    });
  },
};
