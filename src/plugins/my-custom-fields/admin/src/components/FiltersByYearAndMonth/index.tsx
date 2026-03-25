import { useState } from 'react';
import { GenericSearchableSelect } from '../GenericSearchableSelect';

const MONTHS = [
    {id: 1, label: "Enero", data:1},
    {id: 2, label: "Febrero", data:2},
    {id: 3, label: "Marzo", data:3},
    {id: 4, label: "Abril", data:4},
    {id: 5, label: "Mayo", data:5},
    {id: 6, label: "Junio", data:6},
    {id: 7, label: "Julio", data:7},
    {id: 8, label: "Agosto", data:8},
    {id: 9, label: "Septiembre", data:9},
    {id: 10, label: "Octubre", data:10},
    {id: 11, label: "Noviembre", data:11},
    {id: 12, label: "Diciembre", data:12},
];

const FiltersByYearAndMonth = () => {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  return (
    <div>
      <GenericSearchableSelect
        name=""
        label=""
        options={[]}
        value=""
        disabled={false}
        required={true}
        placeholder="Seleccionar año"
        onChange={(e) => {
          setYear(e.target.value);
        }}
      />

      <GenericSearchableSelect
        name=""
        label=""
        options={MONTHS}
        value=""
        disabled={false}
        required={true}
        placeholder="Seleccionar mes"
        onChange={(e) => {
          setMonth(e.target.value);
        }}
      />
    </div>
  );
};

export { FiltersByYearAndMonth };
