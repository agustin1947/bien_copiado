import type { Schema, Struct } from '@strapi/strapi';

export interface CuentaCorrienteCuentaCorrienteItems
  extends Struct.ComponentSchema {
  collectionName: 'components_cuenta_corriente_cuenta_corriente_items';
  info: {
    displayName: 'cuenta_corriente_items';
    icon: 'plus';
  };
  attributes: {
    cantidad: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-input-number-field'> &
      Schema.Attribute.DefaultTo<0>;
    cantidadOriginal: Schema.Attribute.Integer;
    ganancia_por_item: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.input-number-venta-ganancia-item'> &
      Schema.Attribute.DefaultTo<0>;
    idProductoOriginal: Schema.Attribute.Integer;
    productoItem: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-custom-field'>;
    total: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-input-number-total-field'> &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface FormasDePagoFormasDePago extends Struct.ComponentSchema {
  collectionName: 'components_formas_de_pago_formas_de_pagos';
  info: {
    displayName: 'Formas de pago';
    icon: 'plus';
  };
  attributes: {
    forma_de_pago: Schema.Attribute.Relation<
      'oneToOne',
      'api::forma-de-pago.forma-de-pago'
    >;
    total: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface GastosGastosItems extends Struct.ComponentSchema {
  collectionName: 'components_gastos_gastos_items';
  info: {
    displayName: 'gastos-items';
    icon: 'plus';
  };
  attributes: {
    cantidad: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.input-cantidad-gastos-item'>;
    nombre_producto_nuevo: Schema.Attribute.String;
    precio_por_unidad: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.input-precio-por-unidad-gastos-item'>;
    producto: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.select-customize-gasto'>;
    total_por_item: Schema.Attribute.Decimal &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.input-total-gastos-item'>;
  };
}

export interface ProductosProductos extends Struct.ComponentSchema {
  collectionName: 'components_productos_productos';
  info: {
    displayName: 'productos';
    icon: 'plus';
  };
  attributes: {
    cantidad: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-input-number-field'> &
      Schema.Attribute.DefaultTo<0>;
    cantidadOriginal: Schema.Attribute.Integer;
    ganancia_por_item: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.input-number-venta-ganancia-item'> &
      Schema.Attribute.DefaultTo<0>;
    idProductoOriginal: Schema.Attribute.Integer;
    productoItem: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-custom-field'>;
    total: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-input-number-total-field'> &
      Schema.Attribute.DefaultTo<0>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'cuenta-corriente.cuenta-corriente-items': CuentaCorrienteCuentaCorrienteItems;
      'formas-de-pago.formas-de-pago': FormasDePagoFormasDePago;
      'gastos.gastos-items': GastosGastosItems;
      'productos.productos': ProductosProductos;
    }
  }
}
