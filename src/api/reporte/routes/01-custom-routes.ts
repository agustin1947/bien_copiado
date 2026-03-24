export default {
  routes: [
    {
      method: 'GET',
      path: '/reporte/years',
      handler: 'reporte.getYears',
      config: {
        auth: false,
      },
    },
  ],
};