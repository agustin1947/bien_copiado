export default ({ strapi }) => ({
  async getCajaMensual({ year, month, localId }) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const where: any = {
      fecha_de_ingreso: { $gte: start, $lte: end },
    };
    let local = null;
    if (localId) {
      where.local = { id: localId };

      local = await strapi.db.query("api::local.local").findOne({
        where: {
          id: localId,
        },
      });
      
    }
    // 1. Traer datos
    const [ventas, ingresos, gastos, gastosDiarios] = await Promise.all([
      strapi.db.query("api::venta.venta").findMany({
        where,
        populate: ["tipo_de_moneda", "formas_de_pago"],
      }),
      strapi.db.query("api::ingreso.ingreso").findMany({
        where,
        populate: ["tipo_de_moneda", "forma_de_pago"],
      }),
      strapi.db.query("api::gasto.gasto").findMany({
        where,
        populate: ["tipo_de_moneda", "forma_de_pago"],
      }),
      strapi.db.query("api::gasto-diario.gasto-diario").findMany({
        where,
        populate: ["tipo_de_moneda", "forma_de_pago"],
      }),
    ]);

    // 2. Normalizar
    const ventasNormalizadas = normalizarEntradas(ventas);
    const entradas = [...ventasNormalizadas, ...ingresos];
    const salidas = [...gastos, ...gastosDiarios];

    // 3. Totales generales
    const entradasTotales = calcularTotales(entradas);
    const salidasTotales = calcularTotales(salidas);

    // 4. AGRUPAR POR DÍA 👇 (LO IMPORTANTE)
    const porDia = agruparPorDia(entradas, salidas);

    return {
      resumen: {
        entradas: entradasTotales,
        salidas: salidasTotales,
      },
      porDia,
      local: local
    };
  },
});

const normalizarEntradas = (entradas) => {
  const resultado = [];

  for (const item of entradas) {
    if (item.formas_de_pago && item.formas_de_pago.length > 0) {
      for (const pago of item.formas_de_pago) {
        resultado.push({
          ...item,
          total: pago.total,
          forma_de_pago: pago.forma_de_pago,
        });
      }
    } else {
      resultado.push(item);
    }
  }

  return resultado;
};

const calcularTotales = (merged) => {
  // Objeto base de totales
  const totales = {
    totalEnPesos: 0,
    totalEnDolares: 0,
    totalEnPesosEfectivo: 0,
    totalEnPesosTransferencia: 0,
    totalEnPesosTarjetaDeCredito: 0,
    totalEnPesosTarjetaDeDebito: 0,
    totalEnDolaresEfectivo: 0,
    totalEnDolaresTransferencia: 0,
    totalEnDolaresTarjetaDeCredito: 0,
    totalEnDolaresTarjetaDeDebito: 0,
  };

  for (const item of merged) {
    //const cleaned = item.total.replace(/^"|"$/g, "").trim();
    //const normalized = cleaned.replace(",", ".");
    //const totalTmp = parseFloat(normalized);
    //const total = isNaN(totalTmp) ? 0 : parseFloat(totalTmp.toFixed(2));//item.total || 0;
    const total = isNaN(item.total) ? 0 : parseFloat(item.total);
    const moneda = item.tipo_de_moneda?.codigo || "ARS";
    const forma = normalizeText(item.forma_de_pago?.nombre || "efectivo");

    if (moneda === "ARS") {
      totales.totalEnPesos += total;

      switch (forma) {
        case "efectivo":
          totales.totalEnPesosEfectivo += total;
          break;
        case "transferencia":
          totales.totalEnPesosTransferencia += total;
          break;
        case "tarjetadecredito":
          totales.totalEnPesosTarjetaDeCredito += total;
          break;
        case "tarjetadedebito":
          totales.totalEnPesosTarjetaDeDebito += total;
          break;
      }
    } else if (moneda === "USD") {
      totales.totalEnDolares += total;

      switch (forma) {
        case "efectivo":
          totales.totalEnDolaresEfectivo += total;
          break;
        case "transferencia":
          totales.totalEnDolaresTransferencia += total;
          break;
        case "tarjetadecredito":
          totales.totalEnDolaresTarjetaDeCredito += total;
          break;
        case "tarjetadedebito":
          totales.totalEnDolaresTarjetaDeDebito += total;
          break;
      }
    }
  }

  return totales;
};

const normalizeText = (text: string) => {
  return text
    ?.replace(/^["']|["']$/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
};

const agruparPorDia = (entradas, salidas) => {
  const map = {};

  const add = (item, tipo) => {
    const fecha = item.fecha_de_ingreso?.split("T")[0];

    if (!map[fecha]) {
      map[fecha] = {
        fecha,
        ingresosARS: 0,
        egresosARS: 0,
        ingresosUSD: 0,
        egresosUSD: 0,
      };
    }

    const moneda = item.tipo_de_moneda?.codigo || "ARS";
    const total = item.total || 0;

    if (tipo === "entrada") {
      if (moneda === "USD") map[fecha].ingresosUSD += total;
      else map[fecha].ingresosARS += total;
    } else {
      if (moneda === "USD") map[fecha].egresosUSD += total;
      else map[fecha].egresosARS += total;
    }
  };

  entradas.forEach((e) => add(e, "entrada"));
  salidas.forEach((s) => add(s, "salida"));

  return Object.values(map).sort((a: any, b: any) =>
    a.fecha.localeCompare(b.fecha),
  );
};
