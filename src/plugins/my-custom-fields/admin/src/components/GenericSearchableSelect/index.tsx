import { useEffect, useMemo, useRef, useState } from 'react';
import arrow from './img/arrow.svg';

interface SelectOption {
  id: number;
  label: string;
  data: any;
}

interface GenericSelectProps {
  name: string;
  label?: string;
  options: SelectOption[];
  value?: string | number | null;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  onChange: (event: { target: { name: string; type: string; value: number } }) => void;
  onOptionSelect?: (selectedId: number, option: SelectOption) => void;
  type?: string;
  className?: string;
  allowEmptyOption?: boolean;
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
  allowEmptyOption = false,
}: GenericSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const optionsWithEmpty = useMemo(() => {
    if (!allowEmptyOption) return options;

    return [{ id: 0, label: placeholder, data: null }, ...options];
  }, [options, allowEmptyOption, placeholder]);

  const filteredOptions = useMemo(() => {
    if (!search) return optionsWithEmpty;
    console.log(search);
    return optionsWithEmpty.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  }, [search, optionsWithEmpty]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = optionsWithEmpty.find((option) => option.id === value);

  return (
    <div ref={containerRef} className="generic_searchable_select">
      {label && <div className="label-customize">{label}</div>}
      <div>
        <div
          className="generic_searchable_select__select input-customize"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <span>
            <img src={arrow} alt="arrow" className={`${isOpen ? 'arrow arrow_up' : 'arrow'}`} />
          </span>
        </div>
        {isOpen && (
          <ul className="generic_searchable_select__ul">
            <li>
              <input
                type="text"
                name="search"
                value={search}
                className="input-customize"
                placeholder="Buscar..."
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
                    className="generic_searchable_select__li"
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
