import React from 'react'

import {useTranslation} from 'react-i18next'

import {getSlotLabelError} from '@nia/reality/shared/gateway/validate-function-config'

import {MAX_IDENTIFIER_LENGTH} from '@nia/reality/shared/gateway/limits'

import {createThemedStyles} from '../../ui/theme'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import type {ParameterValue} from '../../../shared/gateway/gateway-types'
import {useId} from '../../hooks/use-id'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {combine} from '../../common/styles'
import {
  BackendConfigAction, patchEnvVariablesAction, deleteEnvVariableAction,
} from './backend-config-builder-reducer'
import {SpaceBetween} from '../../ui/layout/space-between'
import {useGitProgress} from '../../git/hooks/use-current-git'
import {DeleteButton} from '../module-config/delete-button'

const useStyles = createThemedStyles(theme => ({
  envVariableContainer: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.2rem',
    background: theme.mainEditorPane,
    padding: '1rem',
    margin: '0.5rem 0',
  },
  envVariableInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  inputBlock: {
    maxWidth: '300px',
    width: '100%',
  },
  readOnly: {
    color: theme.fgMuted,
  },
}))

interface IEnvVariableBuilder {
  name: string
  value: ParameterValue
  dispatch?: React.Dispatch<BackendConfigAction>
}

const EnvVariableBuilder: React.FC<IEnvVariableBuilder> = ({name, value, dispatch = null}) => {
  const gitProgress = useGitProgress()
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const envVariableId = useId()

  const readOnly = !dispatch

  const literalSlotType = t('editor_page.env_variable_builder.user_defined_string')

  const [labelFocused, setLabelFocused] = React.useState(false)
  const [labelTouched, setLabelTouched] = React.useState(false)

  const isSlot = value.type === 'literalslot'
  const slotLabelText = t('editor_page.env_variable_builder.label')
  const [didSave, setDidSave] = React.useState(false)

  React.useEffect(() => {
    if (gitProgress.save === 'START') {
      setDidSave(true)
    }
  }, [gitProgress.save])
  const shouldShowError = (touched: boolean, focused: boolean) => (didSave || touched) && !focused
  const labelError = isSlot && shouldShowError(labelTouched, labelFocused) &&
    t(getSlotLabelError(value.label), {fieldName: slotLabelText, maxLength: MAX_IDENTIFIER_LENGTH})

  const onChange = (e) => {
    if (isSlot) {
      dispatch(patchEnvVariablesAction({[name]: {...value, label: e.target.value}}))
    }
  }

  return (
    <div className={classes.envVariableContainer}>
      <div className={combine(classes.envVariableInfo, readOnly && classes.readOnly)}>
        <span>
          {name}&nbsp;{`(${literalSlotType})`}
        </span>
        {!readOnly &&
          <DeleteButton
            aria-label={t('button.delete', {ns: 'common'})}
            onClick={() => { dispatch(deleteEnvVariableAction(name)) }}
          />
        }
      </div>
      <SpaceBetween>
        {isSlot &&
          <div className={classes.inputBlock}>
            <StandardTextField
              id={`label-${envVariableId}`}
              label={(
                <>
                  {slotLabelText}
                  <TooltipIcon content={t('editor_page.env_variable_builder.label_tooltip')} />
                </>
              )}
              boldLabel
              value={value.label}
              onFocus={() => {
                setLabelTouched(true)
                setLabelFocused(true)
              }}
              onChange={onChange}
              height='small'
              disabled={readOnly}
              onBlur={() => setLabelFocused(false)}
              errorMessage={labelError}
            />
          </div>}
      </SpaceBetween>
    </div>
  )
}

export {
  EnvVariableBuilder,
}
