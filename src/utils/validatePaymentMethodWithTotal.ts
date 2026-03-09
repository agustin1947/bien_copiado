export const validatePaymentMethodWithTotal = async (items, total) => {
  if (items.length === 0) {
    return {
      error: true,
      message: `Debe seleccionar una forma de pago`,
    };
  }
  let totalPaymentMethod = 0;
  for (const item of items) {
    if (
      !item.forma_de_pago ||
      (item.forma_de_pago.connect && item.forma_de_pago.connect.length === 0)
    ) {
      return {
        error: true,
        message: `Debe seleccionar una forma de pago para cada item.`,
      };
    }
    totalPaymentMethod += Number(item.total || 0);
  }

  if (totalPaymentMethod !== total) {
    return {
      error: true,
      message: `No conciden el total de la venta, con los montos de las formas de pago.`,
    };
  }

  return {
    error: false,
  };
};
