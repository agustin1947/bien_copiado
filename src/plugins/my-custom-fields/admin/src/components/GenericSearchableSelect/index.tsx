import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    console.log(search);
    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  }, [search, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div ref={containerRef}>
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
            <li>
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </li>
            {filteredOptions.length > 0 &&
              filteredOptions
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
                      setSearch('');
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
