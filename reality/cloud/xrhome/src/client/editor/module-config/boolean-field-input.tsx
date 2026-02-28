import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {BooleanConfigField} from '../../../shared/module/module-config'
import {BoldButton} from '../../ui/components/bold-button'
import {StandardToggleField} from '../../ui/components/standard-toggle-field'
import SpaceBelow from '../../ui/layout/space-below'

const useStyles = createUseStyles({
  description: {
    paddingTop: '0.5rem',
    wordBreak: 'break-word',
  },
})

interface IBooleanFieldInput {
  field: BooleanConfigField
  value: boolean | undefined
  onChange: (newValue: boolean) => void
  onReset: () => void
}

const BooleanFieldInput: React.FC<IBooleanFieldInput> = ({field, value, onChange, onReset}) => {
  const id = `module-input-${field.fieldName}`
  const classes = useStyles()
  const isSet = value !== undefined
  const curState = isSet ? value : !!field.default
  const descriptionText = curState ? field?.trueDescription : field?.falseDescription
  const {t} = useTranslation(['common'])

  return (
    <div>
      <SpaceBelow>
        <StandardToggleField
          id={id}
          label={field.label || field.fieldName}
          checked={curState}
          onChange={onChange}
          showStatus
          boldLabel
        />
        {!!descriptionText &&
          <p className={classes.description}>{descriptionText}</p>
        }
      </SpaceBelow>
      {isSet && <BoldButton onClick={onReset} color='blue'>{t('button.reset')}</BoldButton>}
    </div>
  )
}

export {
  BooleanFieldInput,
}
