export default {
  routes: [
    {
      method: "GET",
      path: "/reportes/years",
      handler: "reporte.getYears",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/reportes/caja-mensual",
      handler: "reporte.cajaMensual",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/reportes/caja-mensual/export",
      handler: "reporte.exportCajaMensual",
      config: {
        auth: false,
      },
    },
  ],
};
