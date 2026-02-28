import React from 'react'
import {useTranslation} from 'react-i18next'

import type {ModuleConfig, ModuleConfigField} from '../../../shared/module/module-config'
import {tinyViewOverride} from '../../static/styles/settings'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {createThemedStyles} from '../../ui/theme'
import {PrimaryButton} from '../../ui/components/primary-button'
import {deriveFieldLabel} from './derive-field-label'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import {DeleteButton} from './delete-button'
import {StandardDropdownField} from '../../ui/components/standard-dropdown-field'
import {useId} from '../../hooks/use-id'

const useStyles = createThemedStyles(theme => ({
  newFieldForm: {
    'margin': '1rem 0',
    'padding': '1rem 1rem 1rem 1.5rem',
    'border': `1px solid ${theme.subtleBorder}`,
    'borderRadius': '0.5rem',
    'position': 'relative',
    '&:focus-within': {
      'border': `1px solid ${theme.sfcBorderFocus}`,
    },
  },
  defaultInput: {
    maxWidth: '304px',
    width: '100%',
  },
  row: {
    display: 'flex',
    [tinyViewOverride]: {
      flexDirection: 'column',
      alignItems: 'normal',
    },
    gridGap: '1rem',
    alignItems: 'end',
    marginBottom: '1rem',
  },
  nextButton: {
    maxWidth: '120px',
    width: '100%',
  },
  deleteButton: {
    position: 'absolute',
    right: '0.5rem',
    top: '1rem',
  },
}))

const initializeForType = (type: ModuleConfigField['type']) => {
  switch (type) {
    case 'boolean':
      return {type, default: false}
    // TODO(christoph): Do we want to autofill these defaults? More thought needed.
    // case 'number':
    //   return {type, default: 0}
    // case 'string':
    //   return {type, default: ''}
    default:
      return {type}
  }
}

interface INewFieldForm {
  currentConfig: ModuleConfig
  onSubmit: (newField: ModuleConfigField) => void
  onCancel: () => void
}

const NewFieldForm: React.FC<INewFieldForm> = ({onSubmit, onCancel, currentConfig}) => {
  const classes = useStyles()
  const newFieldId = useId()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const [fieldName, setFieldName] = React.useState<string>('')
  const [fieldType, setFieldType] = React.useState<ModuleConfigField['type']>('string')

  const nameCollides = !!currentConfig.fields?.[fieldName]

  const canSubmit = !nameCollides && !!fieldName

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) {
      return
    }

    onSubmit({...initializeForType(fieldType), fieldName, label: deriveFieldLabel(fieldName)})
  }

  const fieldNameLabel = (
    <>
      {t('module_config.new_field_form.parameter')}
      <TooltipIcon wide content={t('module_config.new_field_form.parameter_tooltip')} />
    </>
  )

  return (
    <form onSubmit={handleSubmit} className={classes.newFieldForm}>
      <div className={classes.row}>
        <div className={classes.defaultInput}>
          <StandardTextField
            label={fieldNameLabel}
            id={`new-field-name-${newFieldId}`}
            value={fieldName}
            placeholder='myParameter'
            height='small'
            onChange={e => setFieldName(e.target.value)}
          />
        </div>
        <div className={classes.defaultInput}>
          <StandardDropdownField
            id={`new-field-type-${newFieldId}`}
            label={t('module_config.new_field_form.type')}
            height='small'
            value={fieldType}
            onChange={value => setFieldType(value as typeof fieldType)}
            options={[
              {content: t('module_config.new_field_form.type.string'), value: 'string'},
              {content: t('module_config.new_field_form.type.number'), value: 'number'},
              {content: t('module_config.new_field_form.type.boolean'), value: 'boolean'},
              {content: t('module_config.new_field_form.type.resource'), value: 'resource'},
            ]}
          />
        </div>
        <PrimaryButton
          type='submit'
          height='small'
          className={classes.nextButton}
          disabled={!canSubmit}
        >{t('button.next', {ns: 'common'})}
        </PrimaryButton>
      </div>
      <DeleteButton
        aria-label={t('button.cancel', {ns: 'common'})}
        className={classes.deleteButton}
        onClick={onCancel}
      />
      {nameCollides && <div>{t('module_config.new_field_form.parameter_name_collision')}</div>}
    </form>
  )
}

export {
  NewFieldForm,
}
