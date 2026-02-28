import React from 'react'
import {useTranslation} from 'react-i18next'

import type {ModuleConfigValue} from '../../../shared/module/module-dependency'
import type {ModuleConfigField} from '../../../shared/module/module-config'
import {StringFieldInput} from './string-field-input'
import {BooleanFieldInput} from './boolean-field-input'
import {NumberFieldInput} from './number-field-input'
import {ResourceFieldInput} from './resource-field-input'

interface IConfigInput {
  fieldName: string
  field: ModuleConfigField
  value: ModuleConfigValue
  onChange: (e: ModuleConfigValue) => void
  onReset: () => void
}

const FieldInput: React.FC<IConfigInput> = ({fieldName, value, field, onChange, onReset}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  switch (field.type) {
    case 'string': {
      return (
        <StringFieldInput
          value={(typeof value === 'string') ? value : undefined}
          field={field}
          onChange={onChange}
          onReset={onReset}
        />
      )
    }
    case 'resource': {
      return (
        <ResourceFieldInput
          value={typeof value === 'object' ? value : null}
          field={field}
          onChange={onChange}
          onReset={onReset}
        />
      )
    }
    case 'boolean': {
      return (
        <BooleanFieldInput
          value={(typeof value === 'boolean') ? value : undefined}
          field={field}
          onChange={onChange}
          onReset={onReset}
        />
      )
    }
    case 'number': {
      return (
        <NumberFieldInput
          value={(typeof value === 'number') ? value : undefined}
          field={field}
          onChange={onChange}
          onReset={onReset}
        />
      )
    }
    // TODO(christoph): Add more types
    default:
      return <p>{t('module_config.field_input.invalid_field', {fieldName})}</p>
  }
}

export {
  FieldInput,
}
