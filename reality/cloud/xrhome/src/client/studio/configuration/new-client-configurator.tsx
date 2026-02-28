import React from 'react'

import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../../ui/theme'
import {useStudioMenuStyles} from '../ui/studio-menu-styles'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {SrOnly} from '../../ui/components/sr-only'
import {Keys} from '../common/keys'
import {VALID_CLIENT_NAME_REGEX} from '../../git/g8-common'
import {LinkButton} from '../../ui/components/link-button'
import {FloatingPanelButton} from '../../ui/components/floating-panel-button'

const useStyles = createThemedStyles(theme => ({
  textInput: {
    padding: '0.35em',
  },
  buttonRow: {
    display: 'flex',
    gap: '0.5em',
  },
  cancelButton: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  error: {
    color: theme.fgError,
    textAlign: 'center',
  },
}))

interface INewClientConfigurator {
  onSave: (name: string) => void
  onCancel: () => void
  label?: string
  clients: Set<string>
  prefill?: string
  divider?: boolean
  disabled?: boolean
  submitButtonLabel?: string
}

const validateNameFormat = (name: string) => name.match(VALID_CLIENT_NAME_REGEX)

const getTranslationKey = (clientName: string, clients: Set<string>) => {
  if (clientName === undefined || !validateNameFormat(clientName)) {
    return 'source_control_configurator.create_new_client.invalid_name'
  } else if (clients.has(clientName)) {
    return 'source_control_configurator.create_new_client.duplicate_name'
  } else {
    return ''
  }
}

const NewClientConfigurator: React.FC<INewClientConfigurator> = (
  {onSave, onCancel, clients, prefill, disabled, label, submitButtonLabel, divider = true}
) => {
  const {t} = useTranslation(['cloud-studio-pages', 'common'])
  const [newClientName, setNewClientName] = React.useState(prefill || '')
  const [errorKey, setErrorKey] = React.useState(getTranslationKey(newClientName, clients))
  const [isDirty, setIsDirty] = React.useState(!!prefill)
  const classes = useStyles()
  const studioClasses = useStudioMenuStyles()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(newClientName)
        setNewClientName('')
      }}
      onReset={() => {
        setNewClientName('')
        onCancel()
      }}
    >
      <div className={classes.textInput}>
        <StandardTextField
          id='create-new-client'
          label={(
            <SrOnly>
              {label || t('source_control_configurator.create_new_client.label')}
            </SrOnly>
          )}
          height='tiny'
          value={newClientName}
          disabled={disabled}
          onChange={(e) => {
            setNewClientName(e.target.value)
            setErrorKey(getTranslationKey(e.target.value, clients))
          }}
          ref={element => element && element.focus()}
          onKeyDown={(e) => {
            if (e.key === Keys.ESCAPE) {
              setNewClientName('')
              setErrorKey('')
              onCancel()
            }
            if (!isDirty) {
              setIsDirty(true)
            }
          }}
        />
      </div>
      {(isDirty && errorKey) && (
        <div className={classes.error}>
          {t(errorKey)}
        </div>
      )}
      {divider && <div className={studioClasses.divider} />}
      <div className={classes.buttonRow}>
        <div className={classes.cancelButton}>
          <LinkButton type='reset' disabled={disabled}>
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
        </div>
        <FloatingPanelButton
          type='submit'
          spacing='wide'
          disabled={disabled || errorKey.length > 0}
        >
          {submitButtonLabel || t('button.create', {ns: 'common'})}
        </FloatingPanelButton>
      </div>
    </form>
  )
}

export {
  NewClientConfigurator,
}
