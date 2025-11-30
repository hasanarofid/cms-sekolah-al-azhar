'use client'

import Select from 'react-select'

interface Select2Option {
  value: string
  label: string
}

interface Select2Props {
  value?: string
  onChange?: (value: string) => void
  options: Select2Option[]
  placeholder?: string
  isSearchable?: boolean
  isDisabled?: boolean
  className?: string
  error?: string
  name?: string
}

// Custom styles untuk match dengan design admin panel
const customStyles: any = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '42px',
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    borderWidth: '1px',
    borderRadius: '0.5rem',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#111827',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#111827',
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 9999,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#eff6ff'
      : 'white',
    color: state.isSelected ? 'white' : '#111827',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: state.isSelected ? '#3b82f6' : '#dbeafe',
    },
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
}

export function Select2({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  isSearchable = true,
  isDisabled = false,
  className = '',
  error,
  name,
}: Select2Props) {
  const selectedOption = options.find((opt) => opt.value === value) || null

  const handleChange = (selected: Select2Option | null) => {
    if (onChange) {
      onChange(selected?.value || '')
    }
  }

  return (
    <div className={className}>
      <Select<Select2Option>
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        styles={customStyles}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        classNamePrefix="select2"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

