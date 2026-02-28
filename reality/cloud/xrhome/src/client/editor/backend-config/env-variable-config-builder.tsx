import React from 'react'
import {useTranslation} from 'react-i18next'

import {MAX_ENV_VARIABLE_COUNT} from '@nia/reality/shared/gateway/limits'

import {createThemedStyles} from '../../ui/theme'
import {Icon} from '../../ui/components/icon'
import {BackendConfigAction, patchEnvVariablesAction} from './backend-config-builder-reducer'
import {TextNotification} from '../../ui/components/text-notification'
import type {EnvVariableConfig} from '../../../shared/gateway/gateway-types'
import {NewEnvVariableForm} from './new-env-variable-form'
import {EnvVariableBuilder} from './env-variable-builder'
import {useId} from '../../hooks/use-id'

const useStyles = createThemedStyles(theme => ({
  groupHeading: {
    fontSize: '14px',
    fontWeight: '600',
    position: 'relative',
    color: theme.fgMuted,
  },
  groupSection: {
    background: theme.mainEditorPane,
  },
  newEnironmentVariable: {
    'border': '0',
    'background': 'transparent',
    'cursor': 'pointer',
    'fontFamily': 'inherit',
    'fontSize': '14px',
    'fontWeight': '400',
    'color': theme.fgBlue,
    'padding': 0,
    'margin': '1rem 0 0 0',
    '&:disabled': {
      'color': theme.controlInactive,
    },
    'display': 'flex',
    'flexDirection': 'inline',
    'gap': '0.25rem',
    'textDecoration': 'underline',
  },
  envVariablesContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

interface IEnvVariablesConfigBuilder {
  envVariableFields: EnvVariableConfig
  dispatch?: React.Dispatch<BackendConfigAction>
}

const EnvVariablesConfigBuilder: React.FC<IEnvVariablesConfigBuilder> = ({
  envVariableFields, dispatch = null,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const [addingEnvVariable, setAddingEnvVariable] = React.useState(false)

  const envVariablesCount = (envVariableFields && Object.keys(envVariableFields).length) || 0
  const envVariableGroupId = useId()

  const readOnly = !dispatch

  const envVariablesText = t('editor_page.env_variable_config_builder.env_variables')
  const showNewEnvVariableButton = !readOnly && !addingEnvVariable &&
    (envVariablesCount < MAX_ENV_VARIABLE_COUNT)

  return (
    <details className={classes.groupSection} open>
      <summary
        className={classes.groupHeading}
      ><span>{`${envVariablesText} (${envVariablesCount})`}</span>
      </summary>
      {envVariableFields && (
        <div className={classes.envVariablesContainer}>
          {Object.entries(envVariableFields).map(([envVariable, parameterValue]) => (
            <EnvVariableBuilder
              key={`${envVariable}_${envVariableGroupId}`}
              name={envVariable}
              value={parameterValue}
              dispatch={dispatch}
            />
          ))}
        </div>
      )

      }
      {addingEnvVariable && (
        <NewEnvVariableForm
          configEnvVariables={envVariableFields}
          onSubmit={(newEnvVariable) => {
            dispatch(patchEnvVariablesAction(newEnvVariable))
            setAddingEnvVariable(false)
          }}
          onCancel={() => { setAddingEnvVariable(false) }}
        />

      )}
      {showNewEnvVariableButton && (
        <button
          type='button'
          className={classes.newEnironmentVariable}
          onClick={() => { setAddingEnvVariable(true) }}
        >
          <Icon stroke='plus' /> {t('editor_page.env_variable_config_builder.new_env_variable')}
        </button>
      )}
      {envVariablesCount >= MAX_ENV_VARIABLE_COUNT && (
        <TextNotification type='danger'>
          {t('editor_page.env_variable_config_builder.max_env_variables',
            {maxEnvVariables: MAX_ENV_VARIABLE_COUNT})}
        </TextNotification>
      )}
    </details>
  )
}

export {
  EnvVariablesConfigBuilder,
}
