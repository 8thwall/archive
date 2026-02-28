import React from 'react'
import {useTranslation} from 'react-i18next'

import type {ModuleConfigFieldPatch, BooleanConfigField} from '../../../shared/module/module-config'
import {createThemedStyles} from '../../ui/theme'
import {tinyViewOverride} from '../../static/styles/settings'
import {FieldBuilderLabel} from './field-builder-label'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {StandardRadioButton} from '../../ui/components/standard-radio-group'
import {combine} from '../../common/styles'
import {useId} from '../../hooks/use-id'

const useStyles = createThemedStyles({
  padding: {
    marginTop: '1.5rem !important',
  },
  defaultInput: {
    fontWeight: '700',
    maxWidth: '300px',
    width: '100%',
  },
  setDefaultText: {
    fontWeight: '700',
  },
  row: {
    display: 'flex',
    marginTop: '1rem',
    gridGap: '1.5rem',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
})

interface IBooleanFieldBuilder {
  field: BooleanConfigField
  onUpdate: (update: ModuleConfigFieldPatch) => void
}

const BooleanFieldBuilder: React.FC<IBooleanFieldBuilder> = ({field, onUpdate}) => {
  const idBase = `config-builder-${field.fieldName}-${useId()}-`
  const trueDefaultId = `${idBase}default-true`
  const falseDefaultId = `${idBase}default-false`
  const trueDescriptionId = `${idBase}description-true`
  const falseDescriptionId = `${idBase}description-false`
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <div>
      <FieldBuilderLabel field={field} onUpdate={onUpdate} />
      <span className={classes.setDefaultText}>
        {t('module_config.boolean_field_builder.set_default')}
      </span>
      <div className={classes.row}>
        <StandardRadioButton
          id={trueDefaultId}
          label={t('module_config.boolean_field_builder.true')}
          checked={field.default === true}
          onChange={() => onUpdate({default: true})}
        />
        <StandardRadioButton
          id={falseDefaultId}
          label={t('module_config.boolean_field_builder.false')}
          checked={field.default === false}
          onChange={() => onUpdate({default: false})}
        />
      </div>
      <div className={combine(classes.padding, classes.row)}>
        <div className={classes.defaultInput}>
          <StandardTextField
            id={trueDescriptionId}
            label={t('module_config.boolean_field_builder.label_true')}
            value={field.trueDescription || ''}
            onChange={e => onUpdate({trueDescription: e.target.value})}
            height='small'
          />
        </div>
        <div className={classes.defaultInput}>
          <StandardTextField
            id={falseDescriptionId}
            label={t('module_config.boolean_field_builder.label_false')}
            value={field.falseDescription || ''}
            onChange={e => onUpdate({falseDescription: e.target.value})}
            height='small'
          />
        </div>
      </div>
    </div>
  )
}

export {
  BooleanFieldBuilder,
}
