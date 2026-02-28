import React from 'react'
import {useTranslation} from 'react-i18next'

import type {StringConfigField} from '../../../shared/module/module-config'
import {BoldButton} from '../../ui/components/bold-button'
import {StandardTextField} from '../../ui/components/standard-text-field'
import SpaceBelow from '../../ui/layout/space-below'

interface IStringFieldInput {
  field: StringConfigField
  value: string | undefined
  onChange: (newValue: string) => void
  onReset: () => void
}

const StringFieldInput: React.FC<IStringFieldInput> = ({field, value, onChange, onReset}) => {
  const id = `module-input-${field.fieldName}`
  const {t} = useTranslation(['common'])

  const isSet = value !== undefined

  return (
    <div>
      <SpaceBelow>
        <StandardTextField
          id={id}
          value={value || ''}
          placeholder={field.default}
          style={{display: 'block'}}
          onChange={e => onChange(e.target.value)}
          label={field.label || field.fieldName}
          height='small'
          boldLabel
        />
      </SpaceBelow>
      {isSet && <BoldButton onClick={onReset} color='blue'>{t('button.reset')}</BoldButton>}
    </div>
  )
}

export {
  StringFieldInput,
}
