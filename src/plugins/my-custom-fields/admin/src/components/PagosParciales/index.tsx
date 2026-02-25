import { useEffect, useState } from 'react';

const PagosParciales = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const pathname = window.location.pathname;
  const segments = window.location.pathname.split('/');
  const documentId = segments[segments.length - 1];
  const [entity, setEntity] = useState<any>(null);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [totalPagado, setTotalPagado] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEntity = async () => {
      let api = "services";
      if(pathname.includes("api::cuenta-corriente.cuenta-corriente")) {
        api = "cuenta-corrientes";
      }
      
      fetch(`/api/${api}?populate=*&filters[documentId][$eq]=${documentId}&sort[id]=desc`)
        .then((res) => res.json())
        .then((data) => {
          if (!data?.data) {
            console.error('No hay pagos parciales');
            return;
          }
          setEntity(data.data[0]);
        })
        .catch((err) => {
          console.error('Error el service', err);
        });
    };
    if (documentId) {
      fetchEntity();
    }
  }, [documentId]);

  useEffect(() => {
    if (!entity?.id) return;
    setLoading(false);

    let api = `/api/ingresos?populate=*&filters[n_orden_st][$eq]=${entity?.id}&sort[id]=desc`;
    if(pathname.includes("api::cuenta-corriente.cuenta-corriente")) {
      api = `/api/ingresos?populate=*&filters[n_orden_cc][$eq]=${entity?.id}&sort[id]=desc`;
    }
    const fetchIngresos = () => {
      fetch(api)
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

  }, [entity]);

  useEffect(() => {
    const totalPagado = ingresos.reduce((acc, ingreso) => {
      return acc + Number(ingreso.total || 0);
    }, 0);
    setTotalPagado(totalPagado);
    setLoading(false);
  }, [ingresos]);

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <h1 className="h1">Pagos Parciales</h1>
      <br />
      <table border={1} className="table w-100">
        <thead>
          <tr>
            <th>Id</th>
            <th>Título</th>
            <th>Fecha de ingreso</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.length === 0 && (
            <tr>
              <td colSpan={4}>No se registran pagos.</td>
            </tr>
          )}
          {ingresos.length > 0 &&
            ingresos.map((ingreso) => (
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
      <br />
      {ingresos.length > 0 && (
        <table className="table w-100">
          <thead>
            <tr>
              <th>Total pagado</th>
              <th>Falta por pagar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b style={{ color: 'green' }}>${totalPagado}</b>
              </td>
              <td>
                <b style={{ color: 'red' }}>${entity?.total - totalPagado}</b>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export { PagosParciales };
