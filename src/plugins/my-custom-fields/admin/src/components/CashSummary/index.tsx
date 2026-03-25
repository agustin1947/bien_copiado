type Props = {
  resumen: any;
};

const CashSummary = ({ resumen }: Props) => {
  if (!resumen) return null;

  const { entradas, salidas } = resumen;

  const saldoARS =
    entradas.totalEnPesosEfectivo - salidas.totalEnPesosEfectivo;

  const saldoUSD =
    entradas.totalEnDolaresEfectivo - salidas.totalEnDolaresEfectivo;

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
            <td>{entradas.totalEnPesosEfectivo}</td>
            <td>{salidas.totalEnPesosEfectivo}</td>
            <td>{saldoARS}</td>
          </tr>

          <tr>
            <td>USD</td>
            <td>{entradas.totalEnDolaresEfectivo}</td>
            <td>{salidas.totalEnDolaresEfectivo}</td>
            <td>{saldoUSD}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export { CashSummary };