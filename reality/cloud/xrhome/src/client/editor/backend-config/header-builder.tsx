import React from 'react'

import {useTranslation} from 'react-i18next'

import {
  getSlotLabelError, getLiteralError, getPrefixError,
} from '@nia/reality/shared/gateway/validate-function-config'

import {MAX_IDENTIFIER_LENGTH, MAX_LITERAL_LENGTH} from '@nia/reality/shared/gateway/limits'

import {createThemedStyles} from '../../ui/theme'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import type {ParameterValue} from '../../../shared/gateway/gateway-types'
import {useId} from '../../hooks/use-id'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {DeleteButton} from '../module-config/delete-button'
import {combine} from '../../common/styles'
import {
  BackendConfigAction, patchHeadersAction, deleteHeaderAction,
} from './backend-config-builder-reducer'
import {SpaceBetween} from '../../ui/layout/space-between'
import {useGitProgress} from '../../git/hooks/use-current-git'

const useStyles = createThemedStyles(theme => ({
  headerContainer: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.2rem',
    background: theme.mainEditorPane,
    padding: '1rem',
    margin: '0.5rem 0',
  },
  headerInfo: {
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

interface IHeaderBuilder {
  name: string
  value: ParameterValue
  dispatch?: React.Dispatch<BackendConfigAction>
  routeId?: string
}

const HeaderBuilder: React.FC<IHeaderBuilder> = ({
  name, value, dispatch = null, routeId = '',
}) => {
  const gitProgress = useGitProgress()
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const headerId = useId()

  const readOnly = !dispatch

  const displayTypes: Record<ParameterValue['type'], string> = {
    'literal': t('editor_page.new_header_form.string'),
    'literalslot': t('editor_page.new_header_form.user_defined_string'),
    'secretslot': t('editor_page.new_header_form.user_defined_secret'),
    'passthrough': t('editor_page.new_header_form.passthrough'),
    'secret': t('editor_page.new_header_form.secret'),
  }

  const [valueFocused, setValueFocused] = React.useState(false)
  const [valueTouched, setValueTouched] = React.useState(false)
  const [labelFocused, setLabelFocused] = React.useState(false)
  const [labelTouched, setLabelTouched] = React.useState(false)
  const [prefixFocused, setPrefixFocused] = React.useState(false)
  const [prefixTouched, setPrefixTouched] = React.useState(false)

  const isSlot = value.type === 'literalslot' || value.type === 'secretslot'
  const isLiteral = value.type === 'literal'

  const slotLabelText = t('editor_page.header_builder.label')
  const valueLabelText = t('editor_page.header_builder.value')
  const prefixLabelText = t('editor_page.header_builder.prefix')

  const [didSave, setDidSave] = React.useState(false)

  React.useEffect(() => {
    if (gitProgress.save === 'START') {
      setDidSave(true)
    }
  }, [gitProgress.save])

  const shouldShowError = (touched: boolean, focused: boolean) => (didSave || touched) && !focused

  const literalValueError = isLiteral && shouldShowError(valueTouched, valueFocused) &&
    t(getLiteralError(value.value), {fieldName: valueLabelText, maxLength: MAX_LITERAL_LENGTH})
  const labelError = isSlot && shouldShowError(labelTouched, labelFocused) &&
    t(getSlotLabelError(value.label), {fieldName: slotLabelText, maxLength: MAX_IDENTIFIER_LENGTH})
  const prefixError = value.type === 'secretslot' &&
    shouldShowError(prefixTouched, prefixFocused) &&
    t(getPrefixError(value.prefix), {fieldName: prefixLabelText, maxLength: MAX_IDENTIFIER_LENGTH})

  const onChange = (e) => {
    if (isSlot) {
      dispatch(patchHeadersAction({[name]: {...value, label: e.target.value}}, routeId))
    }
    if (isLiteral) {
      dispatch(patchHeadersAction({[name]: {...value, value: e.target.value}}, routeId))
    }
  }

  return (
    <div className={classes.headerContainer}>
      <div className={combine(classes.headerInfo, readOnly && classes.readOnly)}>
        <span>
          {name}&nbsp;{`(${displayTypes[value.type]})`}
        </span>
        {!readOnly &&
          <DeleteButton
            aria-label={t('button.delete', {ns: 'common'})}
            onClick={() => { dispatch(deleteHeaderAction(name, routeId)) }}
          />
        }
      </div>
      <SpaceBetween>
        {isSlot &&
          <div className={classes.inputBlock}>
            <StandardTextField
              id={`label-${headerId}`}
              label={(
                <>
                  {slotLabelText}
                  <TooltipIcon content={t('editor_page.header_builder.label_tooltip')} />
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
        {isLiteral &&
          <div className={classes.inputBlock}>
            <StandardTextField
              id={`value-${headerId}`}
              label={valueLabelText}
              boldLabel
              value={value.value || ''}
              onFocus={() => {
                setValueTouched(true)
                setValueFocused(true)
              }}
              onChange={onChange}
              height='small'
              disabled={readOnly}
              onBlur={() => setValueFocused(false)}
              errorMessage={literalValueError}
            />
          </div>}
        {value.type === 'secretslot' && (!readOnly || value.prefix) &&
          <div className={classes.inputBlock}>
            <StandardTextField
              id={`prefix-${headerId}`}
              label={(
                <>
                  {prefixLabelText}
                  <TooltipIcon content={t('editor_page.header_builder.prefix_tooltip')} />
                </>
              )}
              boldLabel
              value={value.prefix || ''}
              onFocus={() => {
                setPrefixTouched(true)
                setPrefixFocused(true)
              }}
              onChange={(e) => {
                const newPrefix = e.target.value || undefined
                dispatch(patchHeadersAction({[name]: {...value, prefix: newPrefix}}, routeId))
              }}
              height='small'
              disabled={readOnly}
              onBlur={() => setPrefixFocused(false)}
              errorMessage={prefixError}
            />
          </div>}
        {value.type === 'passthrough' &&
          <p>{t('editor_page.header_builder.passthrough_description')}</p>
        }
      </SpaceBetween>
    </div>
  )
}

export {
  HeaderBuilder,
}
