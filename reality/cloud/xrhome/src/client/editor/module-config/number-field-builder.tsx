import React from 'react'
import {useTranslation} from 'react-i18next'

import type {ModuleConfigFieldPatch, NumberConfigField} from '../../../shared/module/module-config'
import {NumberInput} from './number-input'
import {createThemedStyles} from '../../ui/theme'
import {FieldBuilderLabel} from './field-builder-label'
import {useId} from '../../hooks/use-id'

const useStyles = createThemedStyles({
  grid: {
    display: 'grid',
    gap: '1rem',
  },
  inlineLabel: {
    minWidth: '3.5rem',
  },
})

interface INumberFieldBuilder {
  field: NumberConfigField
  onUpdate: (update: ModuleConfigFieldPatch) => void
}

const NumberFieldBuilder: React.FC<INumberFieldBuilder> = ({field, onUpdate}) => {
  const idBase = `config-builder-${field.fieldName}-${useId()}-`
  const defaultId = `${idBase}default`
  const minId = `${idBase}min`
  const maxId = `${idBase}max`
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  const validateMin = (currentDefault: number, potentialMin: number) => {
    if (potentialMin > currentDefault) {
      return t('module_config.number_field_builder.validate.min')
    }

    return null
  }
  const validateMax = (currentDefault: number, currentMin: number, potentialMax: number) => {
    if (potentialMax < currentDefault) {
      return t('module_config.number_field_builder.validate.max_not_less_than_default')
    }

    if (potentialMax <= currentMin) {
      return t('module_config.number_field_builder.validate.max_greater_than_min')
    }

    return null
  }

  return (
    <div>
      <FieldBuilderLabel field={field} onUpdate={onUpdate} />
      <div className={classes.grid}>
        <NumberInput
          id={defaultId}
          value={field.default}
          inline
          width='small'
          height='tiny'
          onChange={value => onUpdate({default: value})}
        >
          <span className={classes.inlineLabel}>
            {t('module_config.number_field_builder.default')}
          </span>
        </NumberInput>
        <NumberInput
          id={minId}
          value={field.min}
          inline
          width='small'
          height='tiny'
          onChange={value => onUpdate({min: value})}
          validate={(newMin: number) => validateMin(field.default, newMin)}
        >
          <span className={classes.inlineLabel}>{t('module_config.number_field_builder.min')}</span>
        </NumberInput>
        <NumberInput
          id={maxId}
          value={field.max}
          inline
          width='small'
          height='tiny'
          onChange={value => onUpdate({max: value})}
          validate={(newMax: number) => validateMax(field.default, field.min, newMax)}
        >
          <span className={classes.inlineLabel}>{t('module_config.number_field_builder.max')}</span>
        </NumberInput>
      </div>
    </div>
  )
}

export {
  NumberFieldBuilder,
}
