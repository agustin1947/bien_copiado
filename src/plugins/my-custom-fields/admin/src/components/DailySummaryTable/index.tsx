type Props = {
  data: any[];
};

const DailySummaryTable = ({ data }: Props) => {
  if (!data || data.length === 0) return <p>No hay datos</p>;
  
  const formatCurrency = (value: any) => {
    return Number(value || 0).toLocaleString('es-AR');
  };

  return (
    <>
      <h3 className="title_h3">Resumen diario</h3>

      <table className="table w-100">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Entradas ARS</th>
            <th>Salidas ARS</th>
            <th>Entradas USD</th>
            <th>Salidas USD</th>
          </tr>
        </thead>
        <tbody>
          {data.map((day) => (
            <tr key={day.fecha}>
              <td>{new Date(day.fecha).toLocaleDateString('es-AR')}</td>
              <td>{formatCurrency(day.ingresosARS)}</td>
              <td>{formatCurrency(day.egresosARS)}</td>
              <td>{formatCurrency(day.ingresosUSD)}</td>
              <td>{formatCurrency(day.egresosUSD)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export { DailySummaryTable };
