import { useEffect, useState } from 'react';
import { GenericSearchableSelect } from '../GenericSearchableSelect';

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

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/reporte/years');
        const data = await res.json();
        console.log(data);
        setYearsOptions(data);
      } catch (error) {
        console.error('Error cargando años', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  return (
    <div>
      <GenericSearchableSelect
        name="year"
        label="Año"
        options={yearsOptions}
        value={year ?? ''}
        disabled={loading}
        required={true}
        placeholder="Seleccionar año"
        onChange={(option: any) => {
          console.log(option.target.value);
          setYear(option?.target?.value || null);
        }}
      />

      <GenericSearchableSelect
        name="month"
        label="Mes"
        options={MONTHS}
        value={month ?? ''}
        disabled={!year}
        required={true}
        placeholder="Seleccionar mes"
        onChange={(option: any) => {
          console.log(option.target.value);
          setMonth(option?.target?.value || null);
        }}
      />
    </div>
  );
};

export { FiltersByYearAndMonth };
