import React from 'react'
import {useTranslation} from 'react-i18next'
import {basename} from 'path'
import type {DeepReadonly} from 'ts-essentials'
import type {FunctionDefinition, RouteConfig} from '@nia/reality/shared/gateway/gateway-types'
import {deriveRpcNameFromFileName} from '@nia/reality/shared/gateway/derive-rpc-name'

import {getEntryErrors} from '@nia/reality/shared/gateway/validate-function-config'

import {createThemedStyles} from '../../ui/theme'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import {type BackendConfigAction, patchFunctionFieldAction} from './backend-config-builder-reducer'
import {useGitProgress} from '../../git/hooks/use-current-git'
import {maybeRemoveImplicitExtension} from '../editor-file-location'
import {BackendUsageExample} from './backend-usage-example'
import {EnvVariablesConfigBuilder} from './env-variable-config-builder'

const useStyles = createThemedStyles(theme => ({
  container: {
    flex: '2 0 0',
    position: 'relative',
    padding: '1rem',
    color: theme.fgMain,
    overflow: 'auto',
  },
  configDefaults: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  defaultInput: {
    width: '100%',
    maxWidth: '300px',
  },
  headersContainer: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.2rem',
    padding: '1rem',
    backgroundColor: theme.mainEditorPane,
  },
  usageContainer: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.2rem',
    padding: '1rem',
    backgroundColor: theme.mainEditorPane,
    paddingBottom: '2rem',
  },
  editButton: {
    border: '0',
    padding: '0',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.fgMuted,
    textDecoration: 'underline',
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
  },
  envVariablesContainer: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.2rem',
    padding: '1rem',
    backgroundColor: theme.mainEditorPane,
  },
}))

interface IBackendConfigView {
  config: DeepReadonly<FunctionDefinition>
  dispatch?: React.Dispatch<BackendConfigAction>
  onEditBackend?: () => void
  configPath?: string
}

const FunctionConfigView: React.FC<IBackendConfigView> = ({
  config, dispatch = null, onEditBackend = null, configPath = '',
}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const classes = useStyles()
  const gitProgress = useGitProgress()

  const backendImportPath = maybeRemoveImplicitExtension(configPath)

  const readOnly = !dispatch

  const {title, description, envVariables, entry} = config

  const [entryFocused, setEntryFocused] = React.useState(false)
  const [entryTouched, setEntryTouched] = React.useState(false)
  const [didSave, setDidSave] = React.useState(false)

  React.useEffect(() => {
    if (gitProgress.save === 'START') {
      setDidSave(true)
    }
  }, [gitProgress.save])

  const entryText = t('editor_page.backend_config_builder.entry_path')

  const shouldShowEntryError = (didSave || entryTouched || entry) && !entryFocused

  const entryErrors = getEntryErrors(entry)
  const entryErrorsText = entryErrors.length > 0
    ? (`${entryErrors.map(err => t(err, {fieldName: entryText})).join('. ')}.`)
    : ''

  return (
    <div className={classes.container}>
      <h2>{title || basename(backendImportPath)}</h2>
      {onEditBackend &&
        <button
          type='button'
          className={classes.editButton}
          onClick={onEditBackend}
        >
          {t('button.edit', {ns: 'common'})}
        </button>}
      {description && <p>{description}</p>}
      <div className={classes.configDefaults}>
        <div className={classes.defaultInput}>
          <StandardTextField
            id='entry-path-input'
            label={(
              <>
                {entryText}
                <TooltipIcon
                  content={t('editor_page.backend_config_builder.entry_path_tooltip')}
                />
              </>
            )}
            boldLabel
            starredLabel={!readOnly}
            value={entry}
            onChange={(e) => { dispatch(patchFunctionFieldAction({entry: e.target.value})) }}
            onFocus={() => {
              setEntryTouched(true)
              setEntryFocused(true)
            }}
            onBlur={() => setEntryFocused(false)}
            placeholder='src/index.ts'
            disabled={readOnly}
            errorMessage={shouldShowEntryError && entryErrorsText}
          />
        </div>
        <div className={classes.envVariablesContainer}>
          <EnvVariablesConfigBuilder
            envVariableFields={envVariables}
            dispatch={dispatch}
          />
        </div>
        {!readOnly &&
          <div className={classes.usageContainer}>
            <BackendUsageExample
              route={{
                name: deriveRpcNameFromFileName(backendImportPath.split('backends/')[1]),
              } as DeepReadonly<RouteConfig>}
              importPath={backendImportPath}
            />
          </div>
        }
      </div>
    </div>
  )
}

export {
  FunctionConfigView,
}
