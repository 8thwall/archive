import React from 'react'
import uuid from 'uuid/v4'

import {useTranslation} from 'react-i18next'

import {getHeaderNameError} from '@nia/reality/shared/gateway/validate-function-config'

import {MAX_IDENTIFIER_LENGTH} from '@nia/reality/shared/gateway/limits'

import {tinyViewOverride} from '../../static/styles/settings'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {createThemedStyles} from '../../ui/theme'
import {PrimaryButton} from '../../ui/components/primary-button'
import {StandardDropdownField} from '../../ui/components/standard-dropdown-field'
import {useId} from '../../hooks/use-id'
import type {HeadersConfig, ParameterValue} from '../../../shared/gateway/gateway-types'
import {LinkButton} from '../../ui/components/link-button'

const useStyles = createThemedStyles(theme => ({
  newHeaderForm: {
    'margin': '1rem 0',
    'padding': '1rem',
    'border': `1px solid ${theme.subtleBorder}`,
    'borderRadius': '0.2rem',
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
  nextButtonContainer: {
    maxWidth: '120px',
  },
  cancelContainer: {
    'margin': '0.25rem 1rem',
    'padding': 0,
  },
  errorText: {
    color: theme.fgError,
  },
}))

const createInitialParameterValue = (type: ParameterValue['type']) => {
  switch (type) {
    case 'literal':
      return {type, value: ''}
    case 'secret':
      return {type, secretId: ''}
    case 'secretslot':
    case 'literalslot':
      return {type, slotId: uuid(), label: ''}
    case 'passthrough':
      return {type}
    default:
      throw new Error(`Unknown parameter type: ${type}`)
  }
}

interface INewHeaderForm {
  currentConfig: HeadersConfig
  backendType: 'proxy' | 'function'
  onSubmit: (newHeader: HeadersConfig) => void
  onCancel: () => void
}

const NewHeaderForm: React.FC<INewHeaderForm> = ({
  onSubmit, onCancel, currentConfig, backendType,
}) => {
  const classes = useStyles()
  const newHeaderId = useId()
  const [headerName, setHeaderName] = React.useState<string>('')
  const [headerType, setHeaderType] = React.useState<ParameterValue['type']>('literalslot')
  const [headerBlurred, setHeaderBlurred] = React.useState(false)

  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const headerLabelText = t('editor_page.new_header_form.header')
  const headerErrorText = getHeaderNameError(headerName)

  const headerError = headerBlurred &&
    t(headerErrorText, {fieldName: headerLabelText, maxLength: MAX_IDENTIFIER_LENGTH})

  const nameCollides = Object.keys(currentConfig).some(headerKey => (
    headerKey.toLowerCase() === headerName.toLowerCase()
  ))

  const canSubmit = !nameCollides && !!headerName && !headerErrorText

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) {
      return
    }

    onSubmit({[headerName]: createInitialParameterValue(headerType)})
  }

  const functionSlotOptions = [
    {content: t('editor_page.new_header_form.user_defined_string'), value: 'literalslot'},
  ]

  const proxySlotOptions = [
    {content: t('editor_page.new_header_form.user_defined_string'), value: 'literalslot'},
    {content: t('editor_page.new_header_form.user_defined_secret'), value: 'secretslot'},
    {content: t('editor_page.new_header_form.string'), value: 'literal'},
    {content: t('editor_page.new_header_form.passthrough'), value: 'passthrough'},
  ]

  return (
    <form onSubmit={handleSubmit} className={classes.newHeaderForm}>
      <div className={classes.row}>
        <div className={classes.defaultInput}>
          <StandardDropdownField
            id={`new-header-type-${newHeaderId}`}
            label={t('editor_page.new_header_form.type')}
            height='small'
            value={headerType}
            onChange={value => setHeaderType(value as typeof headerType)}
            options={backendType === 'function' ? functionSlotOptions : proxySlotOptions}
            disabled={backendType === 'function'}
          />
        </div>
        <div className={classes.defaultInput}>
          <StandardTextField
            label={headerLabelText}
            id={`new-header-name-${newHeaderId}`}
            value={headerName}
            height='small'
            onChange={e => setHeaderName(e.target.value)}
            onFocus={() => setHeaderBlurred(false)}
            onBlur={() => setHeaderBlurred(true)}
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
      {nameCollides && <div>{t('editor_page.new_header_form.name_in_use')}</div>}
      {headerError && <div className={classes.errorText}>{headerError}</div>}
    </form>
  )
}

export {
  NewHeaderForm,
}
