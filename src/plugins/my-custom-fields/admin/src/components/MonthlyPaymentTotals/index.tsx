type Props = {
  resumen: any;
};

const MonthlyPaymentTotals = ({ resumen }: Props) => {
  if (!resumen) return null;

  const { entradas, salidas } = resumen;

  return (
    <div>
      <h3>Totales por medio de pago</h3>

      <table>
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
            <td>{entradas.totalEnPesosEfectivo}</td>
            <td>{salidas.totalEnPesosEfectivo}</td>
            <td>{entradas.totalEnDolaresEfectivo}</td>
            <td>{salidas.totalEnDolaresEfectivo}</td>
          </tr>

          <tr>
            <td>Transferencia</td>
            <td>{entradas.totalEnPesosTransferencia}</td>
            <td>{salidas.totalEnPesosTransferencia}</td>
            <td>{entradas.totalEnDolaresTransferencia}</td>
            <td>{salidas.totalEnDolaresTransferencia}</td>
          </tr>

          <tr>
            <td>Débito</td>
            <td>{entradas.totalEnPesosTarjetaDeDebito}</td>
            <td>{salidas.totalEnPesosTarjetaDeDebito}</td>
            <td>{entradas.totalEnDolaresTarjetaDeDebito}</td>
            <td>{salidas.totalEnDolaresTarjetaDeDebito}</td>
          </tr>

          <tr>
            <td>Crédito</td>
            <td>{entradas.totalEnPesosTarjetaDeCredito}</td>
            <td>{salidas.totalEnPesosTarjetaDeCredito}</td>
            <td>{entradas.totalEnDolaresTarjetaDeCredito}</td>
            <td>{salidas.totalEnDolaresTarjetaDeCredito}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { MonthlyPaymentTotals };