import React from 'react'
import {useTranslation} from 'react-i18next'

import type {ModuleConfigField, ModuleConfigFieldPatch} from '../../../shared/module/module-config'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {createThemedStyles} from '../../ui/theme'
import {useId} from '../../hooks/use-id'

const useStyles = createThemedStyles(theme => ({
  typeInput: {
    maxWidth: '300px',
    width: '100%',
    fontWeight: '700',
    margin: '2rem 0rem',
  },
  typeLabel: {
    color: theme.fgMain,
    fontWeight: '700',
  },
}))

interface IFieldBuilderLabel {
  field: ModuleConfigField
  onUpdate: (update: ModuleConfigFieldPatch) => void
}

const FieldBuilderLabel: React.FC<IFieldBuilderLabel> = ({field, onUpdate}) => {
  const labelId = `config-builder-${field.fieldName}-label-${useId()}`
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  const getParameterTypeLabel = () => {
    switch (field.type) {
      case 'boolean':
        return t('module_config.field_builder_label.parameter_type_label.boolean')
      case 'number':
        return t('module_config.field_builder_label.parameter_type_label.number')
      case 'resource':
        return t('module_config.field_builder_label.parameter_type_label.resource')
      case 'string':
        return t('module_config.field_builder_label.parameter_type_label.string')
      default:
        return ''
    }
  }

  const parameterTypeLabel = getParameterTypeLabel()

  return (
    <div>
      <span className={classes.typeLabel}>
        {parameterTypeLabel}
      </span>
      <div className={classes.typeInput}>
        <StandardTextField
          id={labelId}
          value={field.label}
          style={{display: 'block'}}
          onChange={e => onUpdate({label: e.target.value})}
          label={t('module_config.field_builder_label.label')}
          height='small'
        />
      </div>
    </div>
  )
}

export {
  FieldBuilderLabel,
}
