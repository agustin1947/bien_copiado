type Props = {
  data: any[];
};

const DailySummaryTable = ({ data }: Props) => {
  if (!data || data.length === 0) return <p>No hay datos</p>;

  return (
    <>
      <h3 className="title_h3">Resumen diario</h3>

      <table className="table w-100">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Ingresos ARS</th>
            <th>Egresos ARS</th>
            <th>Ingresos USD</th>
            <th>Egresos USD</th>
          </tr>
        </thead>
        <tbody>
          {data.map((day) => (
            <tr key={day.fecha}>
              <td>{day.fecha}</td>
              <td>{day.ingresosARS}</td>
              <td>{day.egresosARS}</td>
              <td>{day.ingresosUSD}</td>
              <td>{day.egresosUSD}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export { DailySummaryTable };