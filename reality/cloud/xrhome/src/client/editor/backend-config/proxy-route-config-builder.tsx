import React from 'react'
import {useTranslation} from 'react-i18next'

import type {DeepReadonly} from 'ts-essentials'

import {
  getRouteUrlError, getRouteNameError,
} from '@nia/reality/shared/gateway/validate-function-config'

import {MAX_IDENTIFIER_LENGTH, MAX_URL_LENGTH} from '@nia/reality/shared/gateway/limits'

import {createThemedStyles} from '../../ui/theme'
import {StandardSelectField} from '../../ui/components/standard-select-field'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import {HeadersConfigBuilder} from './headers-config-builder'
import {StandardFieldLabel} from '../../ui/components/standard-field-label'
import type {RouteConfig, RouteMethod} from '../../../shared/gateway/gateway-types'
import {useId} from '../../hooks/use-id'
import {StandardTextInput} from '../../ui/components/standard-text-input'
import {tinyViewOverride} from '../../static/styles/settings'
import {DeleteButton} from '../module-config/delete-button'
import {
  BackendConfigAction, patchProxyFieldAction, deleteRouteAction,
} from './backend-config-builder-reducer'
import {useGitProgress} from '../../git/hooks/use-current-git'
import {BackendUsageExample} from './backend-usage-example'

const useStyles = createThemedStyles(theme => ({
  groupSection: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.5rem',
    background: theme.mainEditorPane,
    margin: '1rem 0',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  routeFields: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    margin: '0.25rem 0',
  },
  routeName: {
    flex: 2,
    minWidth: '120px',
    maxWidth: '300px',
  },
  routeMethod: {
    flex: 2,
    minWidth: '120px',
    maxWidth: '300px',
  },
  routeUrl: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '180px',
    maxWidth: '620px',
    [tinyViewOverride]: {
      flexBasis: '100%',
    },
  },
  routeUrlField: {
    display: 'flex',
  },
  baseUrl: {
    flex: '0 1 auto',
    alignSelf: 'center',
    color: theme.fgMuted,
    fontStyle: 'italic',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    padding: '0 0.25rem 0 0',
    maxWidth: '40%',
    whiteSpace: 'nowrap',
  },
  routeUrlInput: {
    flex: '1 1 auto',
  },
  deleteButton: {
    position: 'absolute',
    right: '1.5rem',
  },
  errorText: {
    color: theme.fgError,
  },
}))

const ROUTE_OPTIONS: RouteMethod[] = ['GET', 'PATCH', 'HEAD', 'POST', 'PUT', 'DELETE']

interface IProxyRouteConfigBuilder {
  route: DeepReadonly<RouteConfig>
  baseUrl?: string
  importPath: string
  dispatch?: React.Dispatch<BackendConfigAction>
}

const ProxyRouteConfigBuilder: React.FC<IProxyRouteConfigBuilder> = ({
  route, baseUrl, importPath, dispatch = null,
}) => {
  const {name, url: routeUrl, headers, methods} = route
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const gitProgress = useGitProgress()
  const routeId = useId()
  const [urlFocused, setUrlFocused] = React.useState(false)
  const [urlTouched, setUrlTouched] = React.useState(false)
  const [nameFocused, setNameFocused] = React.useState(false)
  const [nameTouched, setNameTouched] = React.useState(false)

  const routeUrlText = t('editor_page.route_config_builder.route_url')
  const routeNameText = t('editor_page.route_config_builder.method_name')

  const [didSave, setDidSave] = React.useState(false)

  React.useEffect(() => {
    if (gitProgress.save === 'START') {
      setDidSave(true)
    }
  }, [gitProgress.save])

  const shouldShowUrlError = (didSave || urlTouched) && !urlFocused
  const shouldShowNameError = (didSave || nameTouched) && !nameFocused

  const urlError = shouldShowUrlError &&
    t(getRouteUrlError(route.url, baseUrl), {fieldName: routeUrlText, maxLength: MAX_URL_LENGTH})
  const nameError = shouldShowNameError &&
    t(getRouteNameError(route.name), {fieldName: routeNameText, maxLength: MAX_IDENTIFIER_LENGTH})

  const readOnly = !dispatch

  const routeUrlId = `route-url-${routeId}`

  const onUpdateField = (value: Partial<RouteConfig>) => {
    dispatch(patchProxyFieldAction(value, route.id))
  }

  return (
    <div className={classes.groupSection}>
      {!readOnly &&
        <DeleteButton
          className={classes.deleteButton}
          onClick={() => { dispatch(deleteRouteAction(route.id)) }}
          aria-label={t('button.delete', {ns: 'common'})}
        />
      }
      <div className={classes.routeFields}>
        <div className={classes.routeUrl}>
          <label htmlFor={routeUrlId}>
            <StandardFieldLabel
              label={(
                <>
                  {routeUrlText}
                  <TooltipIcon
                    content={t('editor_page.route_config_builder.route_url_tooltip')}
                  />
                </>
              )}
              bold
              disabled={readOnly}
            />
            <div className={classes.routeUrlField}>
              {baseUrl && <span className={classes.baseUrl}>{baseUrl}</span>}
              <div className={classes.routeUrlInput}>
                <StandardTextInput
                  id={routeUrlId}
                  value={routeUrl}
                  onChange={(e) => { onUpdateField({url: e.target.value}) }}
                  onFocus={() => {
                    setUrlTouched(true)
                    setUrlFocused(true)
                  }}
                  onBlur={() => setUrlFocused(false)}
                  disabled={readOnly}
                />
              </div>
            </div>
          </label>
          {urlError && <p className={classes.errorText}>{urlError}</p>}
        </div>
        <div className={classes.routeMethod}>
          <StandardSelectField
            id={`select-method-${routeId}`}
            onChange={(e) => { onUpdateField({methods: [e.target.value as RouteMethod]}) }}
            value={methods[0] || 'GET'}
            label={(
              <>
                {t('editor_page.route_config_builder.method')}
                <TooltipIcon
                  content={t('editor_page.route_config_builder.method_tooltip')}
                />
              </>
            )}
            boldLabel
            disabled={readOnly}
          >
            {ROUTE_OPTIONS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </StandardSelectField>
        </div>
        <div className={classes.routeName}>
          <StandardTextField
            id={`route-name-${routeId}`}
            label={(
              <>
                {routeNameText}
                <TooltipIcon
                  content={t('editor_page.route_config_builder.method_name_tooltip')}
                />
              </>
            )}
            value={name}
            boldLabel
            starredLabel={!readOnly}
            onChange={(e) => {
              onUpdateField({name: e.target.value})
            }}
            onFocus={() => {
              setNameTouched(true)
              setNameFocused(true)
            }}
            onBlur={() => setNameFocused(false)}
            disabled={readOnly}
            errorMessage={nameError}
          />
        </div>
        {!readOnly && <BackendUsageExample route={route} importPath={importPath} />}
      </div>
      <HeadersConfigBuilder
        headerFields={headers}
        dispatch={dispatch}
        routeId={route.id}
        backendType='proxy'
      />
    </div>
  )
}

export {
  ProxyRouteConfigBuilder,
}
