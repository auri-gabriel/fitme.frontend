import React, { ChangeEvent } from 'react';

interface TextFieldProps {
  label: string;
  type?: string;
  name?: string;
  id?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  placeholder?: string;
  autoComplete?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  type = 'text',
  name,
  id,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}) => {
  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className='d-flex flex-column align-items-start w-100'>
      <label htmlFor={fieldId} className='form-label fs-5 mb-3'>
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`form-control${error ? ' is-invalid' : ''}`}
      />
      {error && <div className='invalid-feedback d-block mt-2'>{error}</div>}
    </div>
  );
};

export default TextField;
