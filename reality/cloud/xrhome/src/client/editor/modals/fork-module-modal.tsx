import * as React from 'react'

import {capitalize} from 'lodash'

import {createUseStyles} from 'react-jss'

import {useTranslation} from 'react-i18next'

import {StandardModal} from '../standard-modal'
import {StandardModalActions} from '../standard-modal-actions'
import {StandardModalHeader} from '../standard-modal-header'
import {BasicModalContent} from '../basic-modal-content'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {bodySanSerif, cherry} from '../../static/styles/settings'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import {MODULE_NAME_PATTERN} from '../../../shared/module/module-constants'
import {LinkButton} from '../../ui/components/link-button'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {SpaceBetween} from '../../ui/layout/space-between'
import useCurrentAccount from '../../common/use-current-account'
import {useSelector} from '../../hooks'
import {useDependencyContext} from '../dependency-context'

const useStyles = createUseStyles({
  centerText: {
    textAlign: 'center',
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
  isRequired: {
    color: cherry,
    paddingLeft: '0.25rem',
  },
})

const deriveTitleFromId = (moduleName: string) => moduleName.split('-').map(capitalize).join(' ')

interface IForkModuleModal {
  forkModule: (moduleName: string, moduleTitle: string) => void
  sourceAlias: string
  onClose: () => void
  loading: boolean
}

const ForkModuleModal: React.FC<IForkModuleModal> = ({
  forkModule, sourceAlias, onClose, loading,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  const account = useCurrentAccount()
  const dependencyContext = useDependencyContext()

  const aliasMatchesWorkspaceModule = useSelector(
    s => s.modules.byAccountUuid[account.uuid]
      ?.map(i => s.modules.entities[i])
      ?.some(e => e.name === sourceAlias)
  )

  const [didBlurAlias, setDidBlurAlias] = React.useState(false)
  const initialAlias = aliasMatchesWorkspaceModule ? '' : sourceAlias
  const [moduleName, setModuleName] = React.useState(initialAlias)
  const [moduleTitle, setModuleTitle] = React.useState(deriveTitleFromId(initialAlias))
  const [isTitleChanged, setIsTitleChanged] = React.useState(false)
  const visibleTitle = isTitleChanged ? moduleTitle : deriveTitleFromId(moduleName)

  const moduleAliasFormatError = !MODULE_NAME_PATTERN.test(moduleName)
  const moduleNameDuplicateError = useSelector(
    s => s.modules.byAccountUuid[account.uuid]
      ?.map(i => s.modules.entities[i])
      ?.some(e => e.name === moduleName)
  )

  const aliasConflictError = moduleName !== sourceAlias &&
    !!dependencyContext.aliasToPath[moduleName]

  const getModuleErrorText = () => {
    if (loading) {
      return ''
    }
    if (didBlurAlias) {
      if (moduleAliasFormatError) {
        return t('editor_page.dependency_pane.fork_module_modal.error.format_error')
      } else if (moduleNameDuplicateError) {
        return t('editor_page.dependency_pane.fork_module_modal.error.duplicate_name_error')
      } else if (aliasConflictError) {
        return t('editor_page.dependency_pane.fork_module_modal.error.duplicate_alias_error')
      }
    }
    return ''
  }

  return (
    <StandardModal
      size='small'
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          forkModule(moduleName, moduleTitle)
        }}
      >
        <StandardModalHeader>
          <h2>
            {t('editor_page.dependency_pane.fork_module_modal.title')}
          </h2>
        </StandardModalHeader>
        <BasicModalContent>
          <SpaceBetween
            direction='vertical'
            wide
          >
            <div className={classes.centerText}>
              <p>
                {t('editor_page.dependency_pane.fork_module_modal.header_description')}
              </p>
            </div>
            <StandardTextField
              id='module-id-input'
              required
              label={(
                <div className={classes.labelText}>
                  {t('editor_page.dependency_pane.fork_module_modal.module_id.label')}
                  <b className={classes.isRequired}>*</b>
                  <TooltipIcon
                    content={t('editor_page.dependency_pane.fork_module_modal.popup.module_alias')}
                  />
                </div>
              )}
              placeholder={t('editor_page.dependency_pane.fork_module_modal.module_id.placeholder')}
              errorMessage={getModuleErrorText()}
              onChange={e => setModuleName(e.target.value)}
              onFocus={() => setDidBlurAlias(false)}
              onBlur={() => setDidBlurAlias(true)}
              value={moduleName}
              disabled={loading}
            />
            <StandardTextField
              id='module-title-input'
              label={(
                <div className={classes.labelText}>
                  {t('editor_page.dependency_pane.fork_module_modal.module_title.label')}
                  <b className={classes.isRequired}>*</b>
                  <TooltipIcon
                    content={t('editor_page.dependency_pane.fork_module_modal.popup.module_title')}
                  />
                </div>
              )}
              placeholder={t(
                'editor_page.dependency_pane.fork_module_modal.module_title.placeholder'
              )}
              onChange={(e) => {
                setModuleTitle(e.target.value)
                setIsTitleChanged(true)
              }}
              value={visibleTitle}
              disabled={loading}
            />
          </SpaceBetween>
        </BasicModalContent>
        <StandardModalActions>
          <LinkButton
            onClick={onClose}
            disabled={loading}
          >
            {t('editor_page.dependency_pane.fork_module_modal.button.cancel')}
          </LinkButton>
          <TertiaryButton
            type='submit'
            disabled={moduleAliasFormatError || moduleNameDuplicateError || aliasConflictError}
            loading={loading}
          >
            {t('editor_page.dependency_pane.fork_module_modal.button.fork')}
          </TertiaryButton>
        </StandardModalActions>
      </form>
    </StandardModal>
  )
}

export default ForkModuleModal
