import React from 'react'
import {useTranslation} from 'react-i18next'

import {StandardInlineTextField} from '../../ui/components/standard-inline-text-field'
import {StandardTextField} from '../../ui/components/standard-text-field'

const BASE_PATTERN = '-?(0|([1-9][0-9]*))(\\.[0-9]*)?'
const INPUT_PATTERN = `${BASE_PATTERN}|`
const VALID_PATTERN = `^${BASE_PATTERN}$`

const isValidInput = (value: string) => !value || value.match(new RegExp(VALID_PATTERN))

const numberToText = (value: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return ''
  }
  return value.toString()
}

const textToNumber = (value: string) => {
  if (value === '') {
    return undefined
  }

  if (isValidInput(value)) {
    return parseFloat(value)
  }

  return NaN
}

interface INumberInput {
  id: string
  value: number | undefined
  onChange: (newValue: number) => void
  validate?: (value: number) => string | null
  placeholder?: number
  inline?: boolean
  width?: 'medium' | 'small'
  height?: 'medium' | 'small' | 'tiny'
  boldLabel?: boolean
  children?: React.ReactNode
}

const NumberInput: React.FC<INumberInput> = ({
  id, value, onChange, children, validate, placeholder, width = 'medium', height = 'small', inline,
  boldLabel,
}) => {
  const [valueText, setValueText] = React.useState(() => numberToText(value))
  const {t} = useTranslation(['cloud-editor-pages'])

  React.useEffect(() => {
    const currentVal = textToNumber(valueText)
    if (currentVal !== value) {
      setValueText(numberToText(value))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    setValueText(newText)
    const parsed = textToNumber(newText)
    if (!Number.isNaN(parsed)) {
      onChange(parsed)
    }
  }

  const errorMessage = isValidInput(valueText)
    ? validate?.(textToNumber(valueText))
    : <span>{t('module_config.number_input.error')}</span>

  const commonProps = {
    id,
    inputMode: 'numeric' as const,
    value: valueText,
    onChange: handleChange,
    pattern: INPUT_PATTERN,
    label: children,
    height,
    placeholder: typeof placeholder === 'number' ? placeholder.toString() : '',
    errorMessage,
    boldLabel,
  }

  return inline
    ? (
      <StandardInlineTextField
        {...commonProps}
        width={width}
      />)
    : (
      <StandardTextField
        {...commonProps}
      />
    )
}

export {
  NumberInput,
}
