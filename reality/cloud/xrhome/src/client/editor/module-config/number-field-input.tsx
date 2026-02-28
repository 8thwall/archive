import React from 'react'
import {useTranslation} from 'react-i18next'

import type {NumberConfigField} from '../../../shared/module/module-config'
import {NumberInput} from './number-input'
import {BoldButton} from '../../ui/components/bold-button'
import SpaceBelow from '../../ui/layout/space-below'

interface INumberFieldInput {
  field: NumberConfigField
  value: number | undefined
  onChange: (newValue: number) => void
  onReset: () => void
}

const NumberFieldInput: React.FC<INumberFieldInput> = ({field, value, onChange, onReset}) => {
  const id = `module-input-${field.fieldName}`
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const isSet = value !== undefined

  const validateValue = (inputValue: number) => {
    if (inputValue > field.max) {
      return t('module_config.number_field_input.validate.above_max', {fieldMax: field.max})
    }
    if (inputValue < field.min) {
      return t('module_config.number_field_input.validate.below_min', {fieldMin: field.min})
    }

    return null
  }

  return (
    <div>
      <SpaceBelow>
        <NumberInput
          id={id}
          value={value}
          onChange={onChange}
          validate={v => validateValue(v)}
          placeholder={field.default}
          boldLabel
        >
          {field.label || field.fieldName}
        </NumberInput>
      </SpaceBelow>
      {isSet && (
        <BoldButton onClick={onReset} color='blue'>
          {t('button.reset', {ns: 'common'})}
        </BoldButton>
      )}
    </div>
  )
}

export {
  NumberFieldInput,
}
