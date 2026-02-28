import React from 'react'
import {useTranslation} from 'react-i18next'

import type {ModuleConfigFieldPatch, StringConfigField} from '../../../shared/module/module-config'
import {tinyViewOverride} from '../../static/styles/settings'
import {BoldButton} from '../../ui/components/bold-button'
import {StandardInlineTextField} from '../../ui/components/standard-inline-text-field'
import {createThemedStyles} from '../../ui/theme'
import {FieldBuilderLabel} from './field-builder-label'
import {useId} from '../../hooks/use-id'

const useStyles = createThemedStyles({
  inputPadding: {
    marginBottom: '1rem',
  },
  clearButton: {
    marginLeft: '4.5rem',
    [tinyViewOverride]: {
      marginLeft: 0,
    },
  },
})

interface IStringFieldBuilder {
  field: StringConfigField
  onUpdate: (update: ModuleConfigFieldPatch) => void
}

const StringFieldBuilder: React.FC<IStringFieldBuilder> = ({field, onUpdate}) => {
  const idBase = `config-builder-${field.fieldName}-${useId()}-`
  const defaultId = `${idBase}default`
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <div>
      <FieldBuilderLabel field={field} onUpdate={onUpdate} />
      <div className={classes.inputPadding}>
        <StandardInlineTextField
          id={defaultId}
          label={t('module_config.string_field_builder.default')}
          value={field.default || ''}
          onChange={e => onUpdate({default: e.target.value})}
          height='small'
        />
      </div>
      {field.default !== undefined &&
        <BoldButton
          color='blue'
          className={classes.clearButton}
          onClick={() => onUpdate({default: undefined})}
        >{t('module_config.string_field_builder.clear_default')}
        </BoldButton>
        }
    </div>
  )
}

export {
  StringFieldBuilder,
}
