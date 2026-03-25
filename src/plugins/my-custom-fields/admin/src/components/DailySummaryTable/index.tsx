type Props = {
  data: any[];
};

const DailySummaryTable = ({ data }: Props) => {
  if (!data || data.length === 0) return <p>No hay datos</p>;

  return (
    <div>
      <h3>Resumen diario</h3>

      <table>
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
    </div>
  );
};

export { DailySummaryTable };