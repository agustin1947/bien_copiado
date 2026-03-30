type Props = {
  resumen: any;
};

const MonthlyPaymentTotals = ({ resumen }: Props) => {
  if (!resumen) return null;

  const { entradas, salidas } = resumen;

  const formatCurrency = (value: any) => {
    return Number(value || 0).toLocaleString('es-AR');
  };

  return (
    <>
      <h3 className="title_h3">Totales por medio de pago</h3>

      <table className="table w-100">
        <thead>
          <tr>
            <th>Medio</th>
            <th>Entradas ARS</th>
            <th>Salidas ARS</th>
            <th>Entradas USD</th>
            <th>Salidas USD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Efectivo</td>
            <td>{formatCurrency(entradas.totalEnPesosEfectivo)}</td>
            <td>{formatCurrency(salidas.totalEnPesosEfectivo)}</td>
            <td>{formatCurrency(entradas.totalEnDolaresEfectivo)}</td>
            <td>{formatCurrency(salidas.totalEnDolaresEfectivo)}</td>
          </tr>

          <tr>
            <td>Transferencia</td>
            <td>{formatCurrency(entradas.totalEnPesosTransferencia)}</td>
            <td>{formatCurrency(salidas.totalEnPesosTransferencia)}</td>
            <td>{formatCurrency(entradas.totalEnDolaresTransferencia)}</td>
            <td>{formatCurrency(salidas.totalEnDolaresTransferencia)}</td>
          </tr>

          <tr>
            <td>Débito</td>
            <td>{formatCurrency(entradas.totalEnPesosTarjetaDeDebito)}</td>
            <td>{formatCurrency(salidas.totalEnPesosTarjetaDeDebito)}</td>
            <td>{formatCurrency(entradas.totalEnDolaresTarjetaDeDebito)}</td>
            <td>{formatCurrency(salidas.totalEnDolaresTarjetaDeDebito)}</td>
          </tr>

          <tr>
            <td>Crédito</td>
            <td>{formatCurrency(entradas.totalEnPesosTarjetaDeCredito)}</td>
            <td>{formatCurrency(salidas.totalEnPesosTarjetaDeCredito)}</td>
            <td>{formatCurrency(entradas.totalEnDolaresTarjetaDeCredito)}</td>
            <td>{formatCurrency(salidas.totalEnDolaresTarjetaDeCredito)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export { MonthlyPaymentTotals };
