import React from 'react'
import {Form} from 'semantic-ui-react'

import '../static/styles/app-basic-info.scss'

interface IBasicTextField {
  inputId: string
  inputName: string
  value: string
  labelText: string
  className?: string
  disabled?: boolean
  placeholder?: string
  isTextArea?: boolean
  maxLength?: number
  onChange: any
  subtitle?: string
}

const BasicTextField: React.FC<IBasicTextField> = ({
  inputId,
  inputName,
  labelText,
  value,
  className = '',
  disabled = false,
  placeholder = '',
  isTextArea = false,
  maxLength = 100,
  onChange,
  subtitle = '',
}) => {
  const InputTag = isTextArea ? 'textarea' : 'input'
  return (
    <Form.Field className={className || 'basic-info-field'}>
      <label htmlFor={inputId}>
        {labelText}
        {subtitle && <span className='subtitle'>{subtitle}</span>}
        <InputTag
          id={inputId}
          name={inputName}
          type='text'
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          rows={Math.ceil(maxLength / 80)}
          onChange={onChange}
        />
      </label>
    </Form.Field>
  )
}

export default BasicTextField
