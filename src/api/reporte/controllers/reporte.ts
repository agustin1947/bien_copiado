export default {
  async getYears(ctx) {
    try {
      const result = await strapi.db
        .query("api::caja-diaria.caja-diaria")
        .findOne({
          orderBy: {
            fecha_de_ingreso: "asc",
          },
        });

      const yearStarted = result
        ? new Date(result.fecha_de_ingreso).getFullYear()
        : new Date().getFullYear();

      const currentYear = new Date().getFullYear();

      const years = Array.from(
        { length: currentYear - yearStarted + 1 },
        (_, i) => yearStarted + i,
      );

      const yearsFormatted = years.map((year, index) => ({
        id: year,
        label: String(year),
        data: year,
      }));

      ctx.body = yearsFormatted;
    } catch (error) {
      console.error(error);
      ctx.throw(500, "Error obteniendo años");
    }
  },
  async cajaMensual(ctx) {
    const { year, month, local } = ctx.query;

    const data = await strapi.service("api::reporte.caja").getCajaMensual({
      year: Number(year),
      month: Number(month),
      localId: Number(local),
    });

    ctx.body = data;
  },
  async exportCajaMensual(ctx) {
    try {
      const { year, month, local } = ctx.query;
      let name = `reporte_${month}_${year}`;

      const data = await strapi.service("api::reporte.caja").getCajaMensual({
        year: Number(year),
        month: Number(month),
        localId: local ? Number(local) : null,
      });
      
      if(data.local){
        name += `_${data.local.nombre}`
      }

      const csv = buildCsv(data, name);
      
      ctx.set("Content-Type", "text/csv");
      ctx.set(
        "Content-Disposition",
        `attachment; filename="${name}.csv"`,
      );

      ctx.body = csv;
    } catch (error) {
      console.error(error);
      ctx.throw(500, "Error exportando CSV");
    }
  },
};

const buildCsv = (data: any, title: any) => {
  let csv = "";
  csv += `${title}\n\n`;
  // =========================
  // 1. TOTALES POR MEDIO DE PAGO
  // =========================
  csv += "TOTALES POR MEDIO DE PAGO\n";
  csv += "MEDIO,ENTRADAS ARS,SALIDAS ARS,ENTRADAS USD,SALIDAS USD\n";

  const r = data.resumen;

  csv += `EFECTIVO,${r.entradas.totalEnPesosEfectivo},${r.salidas.totalEnPesosEfectivo},${r.entradas.totalEnDolaresEfectivo},${r.salidas.totalEnDolaresEfectivo}\n`;
  csv += `TRANSFERENCIA,${r.entradas.totalEnPesosTransferencia},${r.salidas.totalEnPesosTransferencia},${r.entradas.totalEnDolaresTransferencia},${r.salidas.totalEnDolaresTransferencia}\n`;
  csv += `TARJETA DEBITO,${r.entradas.totalEnPesosTarjetaDeDebito},${r.salidas.totalEnPesosTarjetaDeDebito},${r.entradas.totalEnDolaresTarjetaDeDebito},${r.salidas.totalEnDolaresTarjetaDeDebito}\n`;
  csv += `TARJETA CREDITO,${r.entradas.totalEnPesosTarjetaDeCredito},${r.salidas.totalEnPesosTarjetaDeCredito},${r.entradas.totalEnDolaresTarjetaDeCredito},${r.salidas.totalEnDolaresTarjetaDeCredito}\n`;

  // =========================
  // 2. RESUMEN POR DÍA
  // =========================
  csv += "\n\nRESUMEN POR DIA\n";
  csv += "FECHA,ENTRADAS ARS,SALIDAS ARS,ENTRADAS USD,SALIDAS USD\n";

  data.porDia.forEach((d: any) => {
    const [y, m, day] = d.fecha.split("-");
    const fechaFormateada = `${day}/${m}/${y}`;

    csv += `${fechaFormateada},${d.ingresosARS},${d.egresosARS},${d.ingresosUSD},${d.egresosUSD}\n`;
  });

  // =========================
  // 3. CAJA (SOLO EFECTIVO)
  // =========================
  csv += "\n\nRESUMEN CAJA (EFECTIVO)\n";
  csv += "MONEDA,ENTRADAS,SALIDAS\n";

  csv += `ARS,${r.entradas.totalEnPesosEfectivo},${r.salidas.totalEnPesosEfectivo}\n`;
  csv += `USD,${r.entradas.totalEnDolaresEfectivo},${r.salidas.totalEnDolaresEfectivo}\n`;

  return csv;
};