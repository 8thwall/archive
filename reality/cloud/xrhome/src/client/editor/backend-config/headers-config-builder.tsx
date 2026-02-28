import React from 'react'

import {useTranslation} from 'react-i18next'

import {MAX_HEADER_COUNT} from '@nia/reality/shared/gateway/limits'

import {createThemedStyles} from '../../ui/theme'
import type {HeadersConfig} from '../../../shared/gateway/gateway-types'
import {useId} from '../../hooks/use-id'
import {Icon} from '../../ui/components/icon'
import {NewHeaderForm} from './new-header-form'
import {HeaderBuilder} from './header-builder'
import {BackendConfigAction, patchHeadersAction} from './backend-config-builder-reducer'
import {TextNotification} from '../../ui/components/text-notification'

const useStyles = createThemedStyles(theme => ({
  groupHeading: {
    fontSize: '14px',
    fontWeight: '400',
    position: 'relative',
    color: theme.fgMuted,
  },
  groupSection: {
    background: theme.mainEditorPane,
  },
  newHeader: {
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
    'gap': '0.25rem',
    'textDecoration': 'underline',
  },
  headersContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

interface IHeadersConfigBuilder {
  headerFields: HeadersConfig
  backendType: 'proxy' | 'function'
  dispatch?: React.Dispatch<BackendConfigAction>
  routeId?: string
}

const HeadersConfigBuilder: React.FC<IHeadersConfigBuilder> = ({
  headerFields, dispatch = null, routeId = '', backendType,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const [addingHeader, setAddingHeader] = React.useState(false)

  const headersCount = (headerFields && Object.keys(headerFields).length) || 0
  const headerGroupId = useId()

  const isDefault = !routeId
  const readOnly = !dispatch

  const headerSummaryText = isDefault
    ? t('editor_page.header_config_builder.default_headers')
    : t('editor_page.header_config_builder.additional_headers')

  const showNewHeaderButton = !readOnly && !addingHeader && headersCount < MAX_HEADER_COUNT

  return (
    <details className={classes.groupSection} open={isDefault}>
      <summary
        className={classes.groupHeading}
      >
        <span>{`${headerSummaryText} (${headersCount})`}</span>
      </summary>

      {headerFields && (
        <div className={classes.headersContainer}>
          {Object.entries(headerFields).map(([header, parameterValue]) => (
            <HeaderBuilder
              key={`${header}-${headerGroupId}`}
              name={header}
              value={parameterValue}
              dispatch={dispatch}
              routeId={routeId}
            />
          ))}
        </div>
      )}

      {addingHeader && (
        <NewHeaderForm
          currentConfig={headerFields}
          onSubmit={(newHeader) => {
            dispatch(patchHeadersAction(newHeader, routeId))
            setAddingHeader(false)
          }}
          onCancel={() => { setAddingHeader(false) }}
          backendType={backendType}
        />
      )}
      {showNewHeaderButton && (
        <button
          type='button'
          className={classes.newHeader}
          onClick={() => { setAddingHeader(true) }}
        >
          <Icon stroke='plus' /> {t('editor_page.header_config_builder.new_header')}
        </button>
      )}
      {headersCount >= MAX_HEADER_COUNT && (
        <TextNotification type='danger'>
          {t('editor_page.header_config_builder.max_headers', {maxHeaders: MAX_HEADER_COUNT})}
        </TextNotification>
      )}
    </details>
  )
}

export {
  HeadersConfigBuilder,
}
