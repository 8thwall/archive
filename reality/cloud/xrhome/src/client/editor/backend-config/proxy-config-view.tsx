import React from 'react'
import {useTranslation} from 'react-i18next'

import {basename} from 'path'

import type {DeepReadonly} from 'ts-essentials'

import {getBaseUrlError} from '@nia/reality/shared/gateway/validate-function-config'

import {MAX_URL_LENGTH, MAX_ROUTES_PER_MODULE} from '@nia/reality/shared/gateway/limits'

import {createThemedStyles} from '../../ui/theme'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import {PrimaryButton} from '../../ui/components/primary-button'
import {HeadersConfigBuilder} from './headers-config-builder'
import {ProxyRouteConfigBuilder} from './proxy-route-config-builder'
import {
  BackendConfigAction, newRouteAction, patchProxyFieldAction,
} from './backend-config-builder-reducer'
import type {ProxyDefinition} from '../../../shared/gateway/gateway-types'
import {useGitProgress} from '../../git/hooks/use-current-git'
import {Popup} from '../../ui/components/popup'
import {maybeRemoveImplicitExtension} from '../editor-file-location'
import {TextNotification} from '../../ui/components/text-notification'

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
  defaultContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  defaultUrlInput: {
    width: '100%',
    maxWidth: '300px',
  },
  defaultHeadersContainer: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.2rem',
    padding: '1rem',
    backgroundColor: theme.mainEditorPane,
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
}))

interface IProxyConfigView {
  config: DeepReadonly<ProxyDefinition>
  dispatch?: React.Dispatch<BackendConfigAction>
  onEditBackend?: () => void
  configPath?: string
  otherRoutesCount?: number
}

const ProxyConfigView: React.FC<IProxyConfigView> = ({
  config, dispatch = null, onEditBackend = null, configPath = '', otherRoutesCount = 0,
}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const classes = useStyles()
  const gitProgress = useGitProgress()

  const backendImportPath = maybeRemoveImplicitExtension(configPath)

  const readOnly = !dispatch

  const {title, description, baseUrl, headers, routes} = config

  const totalRoutes = otherRoutesCount + routes.length
  const maxRoutesReached = totalRoutes >= MAX_ROUTES_PER_MODULE

  const [urlFocused, setUrlFocused] = React.useState(false)
  const [urlTouched, setUrlTouched] = React.useState(false)
  const [didSave, setDidSave] = React.useState(false)

  React.useEffect(() => {
    if (gitProgress.save === 'START') {
      setDidSave(true)
    }
  }, [gitProgress.save])

  const baseUrlText = t('editor_page.backend_config_builder.base_url')

  const shouldShowUrlError = (didSave || urlTouched) && !urlFocused

  const baseUrlError = shouldShowUrlError &&
  t(getBaseUrlError(baseUrl), {fieldName: baseUrlText, maxLength: MAX_URL_LENGTH})

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
        <div className={classes.defaultContainer}>
          <div className={classes.defaultUrlInput}>
            <StandardTextField
              id='base-url-input'
              label={(
                <>
                  {baseUrlText}
                  <TooltipIcon
                    content={t('editor_page.backend_config_builder.base_url_tooltip')}
                  />
                </>
              )}
              boldLabel
              starredLabel={!readOnly}
              value={baseUrl}
              onChange={(e) => { dispatch(patchProxyFieldAction({baseUrl: e.target.value})) }}
              onFocus={() => {
                setUrlTouched(true)
                setUrlFocused(true)
              }}
              onBlur={() => setUrlFocused(false)}
              disabled={readOnly}
              errorMessage={baseUrlError}
            />
          </div>
          {!readOnly &&
            <Popup
              content={(
                <TextNotification type='danger'>
                  {t('editor_page.backend_config_builder.max_routes', {
                    maxRoutes: MAX_ROUTES_PER_MODULE,
                  })}
                </TextNotification>
              )}
              alignment='right'
              popupDisabled={!maxRoutesReached}
            >
              <PrimaryButton
                onClick={() => dispatch(newRouteAction())}
                disabled={maxRoutesReached}
              >
                {t('editor_page.backend_config_builder.new_route')}
              </PrimaryButton>
            </Popup>
          }
        </div>
        <div className={classes.defaultHeadersContainer}>
          <HeadersConfigBuilder
            headerFields={headers}
            dispatch={dispatch}
            backendType='proxy'
          />
        </div>
      </div>
      {routes.map(route => (
        <ProxyRouteConfigBuilder
          key={route.id}
          route={route}
          baseUrl={baseUrl}
          importPath={backendImportPath}
          dispatch={dispatch}
        />
      ))}
    </div>
  )
}

export {
  ProxyConfigView,
}
