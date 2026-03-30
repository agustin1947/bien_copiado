type Props = {
  resumen: any;
};

const CashSummary = ({ resumen }: Props) => {
  if (!resumen) return null;

  const { entradas, salidas } = resumen;

  const saldoARS = entradas.totalEnPesosEfectivo - salidas.totalEnPesosEfectivo;

  const saldoUSD = entradas.totalEnDolaresEfectivo - salidas.totalEnDolaresEfectivo;

  const formatCurrency = (value: any) => {
    return Number(value || 0).toLocaleString('es-AR');
  };
  return (
    <>
      <h3 className="title_h3">Resumen Caja (Efectivo)</h3>

      <table className="table w-100">
        <thead>
          <tr>
            <th>Moneda</th>
            <th>Entradas</th>
            <th>Salidas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ARS</td>
            <td>{formatCurrency(entradas.totalEnPesosEfectivo)}</td>
            <td>{formatCurrency(salidas.totalEnPesosEfectivo)}</td>
            <td>{formatCurrency(saldoARS)}</td>
          </tr>

          <tr>
            <td>USD</td>
            <td>{formatCurrency(entradas.totalEnDolaresEfectivo)}</td>
            <td>{formatCurrency(salidas.totalEnDolaresEfectivo)}</td>
            <td>{formatCurrency(saldoUSD)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export { CashSummary };
