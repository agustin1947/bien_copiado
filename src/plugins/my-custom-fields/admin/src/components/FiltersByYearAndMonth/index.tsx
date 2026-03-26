import { useEffect, useState } from 'react';
import { GenericSearchableSelect } from '../GenericSearchableSelect';
import { MonthlyPaymentTotals } from '../MonthlyPaymentTotals';
import { DailySummaryTable } from '../DailySummaryTable';
import { CashSummary } from '../CashSummary';

const MONTHS = [
  { id: 1, label: 'Enero', data: 1 },
  { id: 2, label: 'Febrero', data: 2 },
  { id: 3, label: 'Marzo', data: 3 },
  { id: 4, label: 'Abril', data: 4 },
  { id: 5, label: 'Mayo', data: 5 },
  { id: 6, label: 'Junio', data: 6 },
  { id: 7, label: 'Julio', data: 7 },
  { id: 8, label: 'Agosto', data: 8 },
  { id: 9, label: 'Septiembre', data: 9 },
  { id: 10, label: 'Octubre', data: 10 },
  { id: 11, label: 'Noviembre', data: 11 },
  { id: 12, label: 'Diciembre', data: 12 },
];

const FiltersByYearAndMonth = () => {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [yearsOptions, setYearsOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [locals, setLocals] = useState<any[]>([]);
  const [local, setLocal] = useState<number | null>(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/reportes/years');
        const data = await res.json();

        setYearsOptions(data);

        const currentYear = new Date().getFullYear();
        const yearExists = data.find((y: any) => y.data === currentYear);
        if (yearExists) {
          setYear(currentYear);
        } else if (data.length > 0) {
          setYear(data[data.length - 1].data);
        }

        const currentMonth = new Date().getMonth() + 1;
        setMonth(currentMonth);
      } catch (error) {
        console.error('Error cargando años', error);
      } finally {
        setLoading(false);
      }
    };

    const getLocals = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/locals');
        const data = await res.json();

        const localesFormatted = data.data.map((local: any) => ({
          id: local.id,
          label: local.nombre,
          data: local.id,
        }));

        setLocals(localesFormatted);
      } catch (error) {
        console.error('Error cargando Locales', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
    getLocals();
  }, []);

  useEffect(() => {
    if (year && month) {
      fetch(`/api/reportes/caja-mensual?year=${year}&month=${month}&local=${local}`)
        .then((res) => res.json())
        .then((data) => {
          setReportData(data);
        });
    }
  }, [year, month, local]);

  const handleExport = () => {
    const url = `/api/reportes/caja-mensual/export?year=${year}&month=${month}&local=${local}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="filters">
        <div className="filters_filter">
          <h3 className="title_h3">Año</h3>
          <GenericSearchableSelect
            name="year"
            options={yearsOptions}
            value={year ?? ''}
            disabled={loading}
            required={true}
            placeholder="Seleccionar Año"
            onChange={(option: any) => {
              setYear(Number(option?.target.value) || null);
            }}
          />
        </div>
        <div className="filters_filter">
          <h3 className="title_h3">Mes</h3>
          <GenericSearchableSelect
            name="month"
            options={MONTHS}
            value={month ?? ''}
            disabled={!year}
            required={true}
            placeholder="Seleccionar Mes"
            onChange={(option: any) => {
              setMonth(Number(option?.target.value) || null);
            }}
          />
        </div>
        <div className="filters_filter">
          <h3 className="title_h3">Local</h3>
          <GenericSearchableSelect
            name="locals"
            options={locals}
            value={local ?? ''}
            disabled={!year}
            required={true}
            placeholder="Seleccionar Local"
            onChange={(option: any) => {
              setLocal(Number(option?.target.value) || null);
            }}
            allowEmptyOption={true}
          />
        </div>
      </div>
      <div>
        <button className="boton-local boton-local--download" onClick={handleExport}>Exportar CSV</button>
      </div>
      {reportData && (
        <div className="reports">
          <div className="reports_table">
            <MonthlyPaymentTotals resumen={reportData.resumen} />
          </div>
          <div className="reports_table">
            <CashSummary resumen={reportData.resumen} />
          </div>
          <div className="reports_table">
            <DailySummaryTable data={reportData.porDia} />
          </div>
        </div>
      )}
    </>
  );
};

export { FiltersByYearAndMonth };
