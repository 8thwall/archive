import React from 'react'
import capitalize from 'lodash/capitalize'
import {useTranslation, Trans} from 'react-i18next'

import {combine} from '../common/styles'
import useActions from '../common/use-actions'
import useCurrentAccount from '../common/use-current-account'
import {bodySanSerif, cherry, editorMonospace} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import {TooltipIcon} from '../widgets/tooltip-icon'
import moduleActions from './actions'
import {MODULE_NAME_PATTERN} from '../../shared/module/module-constants'
import type {IModule} from '../common/types/models'
import {useAbandonableFunction} from '../hooks/use-abandonable-function'
import {Icon} from '../ui/components/icon'

const useStyles = createThemedStyles(theme => ({
  moduleIdMessage: {
    paddingBottom: '1rem',
  },
  isRequired: {
    color: cherry,
    paddingLeft: '0.25rem',
  },
  labelText: {
    fontFamily: bodySanSerif,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '24px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
  },
  moduleIdPrefix: {
    border: 'none',
    color: theme.fgMuted,
  },
  moduleInput: {
    border: 'none',
    flex: '1 1 auto',
    color: theme.fgMain,
  },
  moduleInputContainer: {
    '&::placeholder': {
      color: theme.fgMuted,
      fontWeight: 400,
      fontFamily: bodySanSerif,
    },
    '&>*': {
      padding: '0.7rem 1rem',
      background: 'transparent',
    },
    '&>*:not(:first-child)': {
      borderLeft: theme.createFormDivider,
    },
    'border': theme.createFormBorder,
    'background': theme.createFormBackground,
    'borderRadius': '4px',
    'display': 'flex',
  },
  menlo: {
    fontFamily: editorMonospace,
  },
  error: {
    outline: `${cherry} auto`,
    background: '#DD006505',
  },
  errorText: {
    color: theme.fgError,
  },
}))

const deriveTitleFromId = (moduleId: string) => moduleId.split('-').map(capitalize).join(' ')

interface IModuleCreateView {
  onCreate: (module: IModule) => void
  renderActions: (canSubmit: boolean, isCreating: boolean) => React.ReactNode
  inputContainerClassName: string
}

const ModuleCreateForm: React.FC<IModuleCreateView> = (
  {onCreate, renderActions, inputContainerClassName}
) => {
  const classes = useStyles()
  const account = useCurrentAccount()
  const {t} = useTranslation(['module-pages'])

  const {createModule} = useActions(moduleActions)
  const [moduleId, setModuleId] = React.useState('')
  const [didBlurId, setDidBlurId] = React.useState(false)
  const [moduleTitle, setModuleTitle] = React.useState('')
  const [isTitleChanged, setIsTitleChanged] = React.useState(false)
  const visibleTitle = isTitleChanged ? moduleTitle : deriveTitleFromId(moduleId)
  const moduleIdErrorId = 'module-id-error'
  const moduleIdError = !MODULE_NAME_PATTERN.test(moduleId)
  const [isCreating, setIsCreating] = React.useState(false)

  const canSubmit = moduleId && visibleTitle && !moduleIdError && !isCreating

  const abandonCreateModule = useAbandonableFunction(createModule)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    const module = await abandonCreateModule(account.uuid, {
      title: visibleTitle,
      name: moduleId,
    })
    if (module) {
      onCreate(module)
    }
    setIsCreating(false)
  }

  const showError = moduleIdError && didBlurId
  return (
    <form onSubmit={handleSubmit}>
      <div className={inputContainerClassName}>
        <label className={classes.label} htmlFor='module-id-input'>
          <div className={classes.labelText}>
            {t('create_module_page.create_form.label.module_id')}
            <b className={classes.isRequired}>*</b>
          </div>
          <span className={combine(
            classes.moduleInputContainer,
            showError && classes.error
          )}
          >
            <span className={classes.moduleIdPrefix}>
              <Trans
                ns='module-pages'
                i18nKey='create_module_page.create_form.id_prefix.import_module_as'
              >import <b>module</b> as
              </Trans>
            </span>
            <input
              id='module-id-input'
              type='text'
              name='module-id'
              placeholder='module-id'
              className={combine(classes.moduleInput, classes.menlo)}
              value={moduleId}
              onChange={e => setModuleId(e.target.value)}
              onFocus={() => setDidBlurId(false)}
              onBlur={() => setDidBlurId(true)}
              required
              aria-invalid={!!moduleIdError}
              aria-errormessage={showError ? moduleIdErrorId : undefined}
            />
          </span>
        </label>
        {showError &&
          <span id={moduleIdErrorId} className={classes.errorText}>
            <Icon stroke='danger' inline />
            {t('create_module_page.create_form.error.invalid_module_id')}
          </span>
          }
        <div className={classes.moduleIdMessage}>
          <Trans
            ns='module-pages'
            i18nKey='create_module_page.create_form.module_id_description'
          >
            The module identifier appears in your workspace url and can be used to reference your
            module in project code. <b>It cannot be changed.</b>
          </Trans>
        </div>
        <div className={classes.inputContainer}>
          <label
            className={classes.label}
            htmlFor='module-title-input'
          >
            <div className={classes.labelText}>
              {t('create_module_page.create_form.label.module_title')}
              <b className={classes.isRequired}>*</b>
              <TooltipIcon content={t('create_module_page.create_form.tooltip')} />
            </div>
            <div className={classes.moduleInputContainer}>
              <input
                id='module-title-input'
                type='text'
                name='module-title'
                placeholder={t('create_module_page.create_form.placeholder.module_title')}
                className={classes.moduleInput}
                value={visibleTitle}
                onChange={(e) => {
                  setModuleTitle(e.target.value)
                  setIsTitleChanged(true)
                }}
                required
              />
            </div>
          </label>
        </div>
      </div>
      {renderActions(canSubmit, isCreating)}
    </form>
  )
}

export {ModuleCreateForm}
