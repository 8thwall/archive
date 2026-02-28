import React from 'react'
import uuid from 'uuid/v4'
import {useTranslation} from 'react-i18next'

import {getEnvVariableKeyError} from '@nia/reality/shared/gateway/validate-function-config'

import {MAX_IDENTIFIER_LENGTH} from '@nia/reality/shared/gateway/limits'

import {tinyViewOverride} from '../../static/styles/settings'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {createThemedStyles} from '../../ui/theme'
import {PrimaryButton} from '../../ui/components/primary-button'
import {useId} from '../../hooks/use-id'
import type {EnvVariableConfig} from '../../../shared/gateway/gateway-types'
import {LinkButton} from '../../ui/components/link-button'

const useStyles = createThemedStyles(theme => ({
  'newEnvVariableForm': {
    'margin': '1rem 0',
    'padding': '1rem',
    'border': `1px solid ${theme.subtleBorder}`,
    'borderRadius': '0.2rem',
    'position': 'relative',
    '&:focus-within': {
      'border': `1px solid ${theme.sfcBorderFocus}`,
    },
  },
  'defaultInput': {
    maxWidth: '304px',
    width: '100%',
    display: 'inline',
  },
  'row': {
    display: 'flex',
    [tinyViewOverride]: {
      flexDirection: 'column',
      alignItems: 'normal',
    },
    gridGap: '1rem',
    alignItems: 'end',
    marginBottom: '1rem',
  },
  'nextButtonContainer': {
    maxWidth: '120px',
  },
  'cancelContainer': {
    'margin': '0.25rem 1rem',
    'padding': 0,
  },
  'errorText': {
    color: theme.fgError,
  },
  'envVariableValueLabel': {
    display: 'inline-flex',
    flexDirection: 'row',
  },
}))

interface INewEnvVariableForm {
  configEnvVariables: EnvVariableConfig
  onSubmit: (newEnvVariable: EnvVariableConfig) => void
  onCancel: () => void
}

const NewEnvVariableForm: React.FC<INewEnvVariableForm> = ({
  configEnvVariables, onSubmit, onCancel,
}) => {
  const classes = useStyles()
  const newEnvVariableId = useId()

  const [variableKey, setVariableKey] = React.useState<string>('')
  const [variableBlurred, setVariableBlurred] = React.useState(false)

  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const envVariableLabelText = t('editor_page.new_env_variable_form.key')
  const variableErrorText = getEnvVariableKeyError(variableKey)

  const variableError = variableBlurred &&
    t(variableErrorText, {fieldName: envVariableLabelText, maxLength: MAX_IDENTIFIER_LENGTH})

  const nameCollides = !!configEnvVariables && Object.keys(configEnvVariables).some(savedKey => (
    savedKey === variableKey
  ))

  const canSubmit = !nameCollides && !!variableKey && !variableErrorText

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) {
      return
    }

    // Environment variables are always literalslot parameters
    onSubmit({[variableKey]: {type: 'literalslot', slotId: uuid(), label: ''}})
  }

  return (
    <form onSubmit={handleSubmit} className={classes.newEnvVariableForm}>
      <div className={classes.row}>
        <div className={classes.defaultInput}>
          <StandardTextField
            label={envVariableLabelText}
            id={`new-variable-name-${newEnvVariableId}`}
            value={variableKey}
            height='small'
            onChange={e => setVariableKey(e.target.value)}
            onFocus={() => setVariableBlurred(false)}
            onBlur={() => setVariableBlurred(true)}
          />
        </div>
        <div className={classes.nextButtonContainer}>
          <PrimaryButton
            type='submit'
            height='small'
            spacing='wide'
            disabled={!canSubmit}
          >
            {t('button.next', {ns: 'common'})}
          </PrimaryButton>
        </div>
        <div className={classes.cancelContainer}>
          <LinkButton
            onClick={onCancel}
          >
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
        </div>
      </div>
      {nameCollides && <div>{t('editor_page.new_env_variable_form.name_in_use')}</div>}
      {variableError && <div className={classes.errorText}>{variableError}</div>}
    </form>
  )
}
export {
  NewEnvVariableForm,
}
