import { useState } from 'react';

interface SelectOption {
  id: number;
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
  onChange: (event: { target: { name: string; type: string; value: number } }) => void;
  onOptionSelect?: (selectedId: number, option: SelectOption) => void;
  type?: string;
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
  onOptionSelect,
  type,
  className = '',
}: GenericSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === value);

  return (
    <div>
      {label && (
        <label htmlFor={name} className="label-customize">
          {label}
        </label>
      )}
      <div>
        <div onClick={() => setIsOpen((prev) => !prev)}>
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        {isOpen && (
          <ul>
            {options.length > 0 &&
              options
                .filter((option) => option.id !== value)
                .map((option) => (
                  <li
                    key={option.id}
                    value={option.id}
                    onClick={() => {
                      setIsOpen(false);

                      onChange({
                        target: {
                          name,
                          type: type || 'number',
                          value: option.id,
                        },
                      });

                      if (onOptionSelect) {
                        onOptionSelect(option.id, option);
                      }
                    }}
                  >
                    {option.label}
                  </li>
                ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export { GenericSearchableSelect };
