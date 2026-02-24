interface SelectOption {
  id: number | string;
  label: string;
}

interface GenericSelectProps {
  name: string;
  label?: string;
  options: SelectOption[];
  value?: string | number;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

const GenericSearchableSelect = ({
  name,
  label,
  options,
  value,
  disabled = false,
  required = false,
  placeholder = 'Seleccione una opción',
  onChange,
  className = '',
}: GenericSelectProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="label-customize">
          {label}
        </label>
      )}

      <select
        name={name}
        id={name}
        value={value ?? ''}
        disabled={disabled}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`input-customize ${className}`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export { GenericSearchableSelect };
