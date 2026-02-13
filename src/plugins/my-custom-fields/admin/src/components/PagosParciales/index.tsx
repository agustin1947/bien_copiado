import { useEffect, useState } from 'react';

const PagosParciales = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const segments = window.location.pathname.split('/');
  const documentId = segments[segments.length - 1];
  const [service, setService] = useState<any>(null);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [totalPagado, setTotalPagado] = useState(0);

  console.log('documentId: ', documentId);
  useEffect(() => {
    const fetchService = async () => {
      fetch(`/api/services?populate=*&filters[documentId][$eq]=${documentId}&sort[id]=desc`)
        .then((res) => res.json())
        .then((data) => {
          if (!data?.data) {
            console.error('No hay pagos parciales');
            return;
          }
          setService(data.data[0]);
        })
        .catch((err) => {
          console.error('Error el service', err);
        });
    };
    if (documentId) {
      fetchService();
    }
  }, [documentId]);

  useEffect(() => {
    if (!service?.id) return;
    const fetchIngresos = () => {
      fetch(`/api/ingresos?populate=*&filters[n_orden_st][$eq]=${service?.id}&sort[id]=desc`)
        .then((res) => res.json())
        .then((data) => {
          if (!data?.data) {
            console.error('No hay pagos ingresos');
            return;
          }
          setIngresos(data.data);
        })
        .catch((err) => {
          console.error('Error el service', err);
        });
    };

    fetchIngresos();

    console.log('service actualizado:', service);
  }, [service]);

  useEffect(() => {
    const totalPagado = ingresos.reduce((acc, ingreso) => {
      return acc + Number(ingreso.total || 0);
    }, 0);
    setTotalPagado(totalPagado);
  }, [ingresos]);

  return (
    <>
      <h1 className="h1">Pagos Parciales #{service?.id}</h1>
      <br />
      <table border={1} className="table w-100">
        <thead>
          <tr>
            <th>N° orden</th>
            <th>Título</th>
            <th>Fecha de ingreso</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso) => (
            <tr key={ingreso.id}>
              <td>{ingreso.id}</td>
              <td>{ingreso.titulo}</td>
              <td>
                {new Date(ingreso.fecha_de_ingreso + 'T00:00:00').toLocaleDateString('es-AR')}
              </td>
              <td>${ingreso.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      <table className="table w-100">
        <thead>
          <tr>
            <th>Total pagado</th>
            <th>Falta por pagar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${totalPagado}</td>
            <td>${service?.total - totalPagado}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export { PagosParciales };
