import React from 'react'
import {useHistory} from 'react-router-dom'

import {getPathForDependency} from '../common/paths'
import useCurrentAccount from '../common/use-current-account'
import {createThemedStyles} from '../ui/theme'
import {PrimaryButton} from '../ui/components/primary-button'
import {LinkButton} from '../ui/components/link-button'
import MainErrorMessage from '../home/error-message'
import {ModuleCreateForm} from './module-create-form'
import useCurrentApp from '../common/use-current-app'
import {ModuleActionsContext} from '../editor/modules/module-actions-context'
import {useCurrentGit} from '../git/hooks/use-current-git'
import type {IModule} from '../common/types/models'
import type {ModuleTarget} from '../../shared/module/module-target'
import useActions from '../common/use-actions'
import moduleGitActions from '../git/module-git-actions'
import {useAbandonableFunction} from '../hooks/use-abandonable-function'
import ProjectModulesIcon from '../apps/widgets/project-modules-icon'

const useStyles = createThemedStyles(theme => ({
  moduleCreateView: {
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'flex-start',
    'height': '100%',
    'alignSelf': 'stretch',
  },
  scrollingContainer: {
    'display': 'flex',
    'alignSelf': 'stretch',
    'overflowY': 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.scrollbarTrackBackground,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.scrollbarThumbColor,
      borderRadius: '20px',
      border: `1px solid ${theme.scrollbarThumbColor}`,
    },
  },
  formWrapper: {
    padding: '4rem 3rem 1rem 3rem',
    gap: '10rem',
    margin: '0 auto',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  heading: {
    display: 'flex',
    padding: '2rem 3rem 0 3rem',
    gap: '0.5rem',
  },
  headingText: {
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
    fontFamily: 'inherit',
    fontStyle: 'normal',
    fontSize: '14px',
    fontWeight: '700',
  },
  headingIcon: {
    width: '30px',
    height: '30px',
  },
  actions: {
    marginTop: '2rem',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '2rem',
  },
}))

interface IModuleCreateView {
  onClose: () => void
  isSelfHosted?: boolean
}

const ModuleCreateView: React.FC<IModuleCreateView> = ({onClose, isSelfHosted}) => {
  const classes = useStyles()
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const history = useHistory()
  const handle = useCurrentGit(git => git.repo?.handle)

  const [isImporting, setIsImporting] = React.useState(false)

  const {addDependency} = React.useContext(ModuleActionsContext)
  const {bootstrapModuleRepo, initializeModuleRepo} = useActions(moduleGitActions)

  const abandonAddDependency = useAbandonableFunction(addDependency)

  const handleCreate = async (module: IModule) => {
    setIsImporting(true)

    await bootstrapModuleRepo(module.repoId)
    await initializeModuleRepo(module.repoId)
    const targetOverride: ModuleTarget = handle && {type: 'development', handle}

    await abandonAddDependency(
      module.uuid,
      {type: 'branch', branch: 'master'},
      module.name,
      targetOverride
    )
    setIsImporting(false)
    onClose()
    if (!isSelfHosted) {
      history.push(getPathForDependency(account, app, module.name))
    }
  }

  return (
    <div className={classes.moduleCreateView}>
      <div className={classes.heading}>
        <MainErrorMessage />
        <ProjectModulesIcon className={classes.headingIcon} />
        <div className={classes.headingText}>
          Create New Module
        </div>
      </div>
      <div className={classes.scrollingContainer}>
        <div className={classes.formWrapper}>
          <ModuleCreateForm
            onCreate={handleCreate}
            inputContainerClassName={classes.formContainer}
            renderActions={(canSubmit, isCreating) => (
              <div className={classes.actions}>
                <LinkButton
                  onClick={onClose}
                >
                  Cancel
                </LinkButton>
                <PrimaryButton
                  type='submit'
                  disabled={!canSubmit}
                  loading={isImporting || isCreating}
                  spacing='wide'
                >
                  Create
                </PrimaryButton>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}

export {ModuleCreateView}
