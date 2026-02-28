import React from 'react'

import type {IPublicAccount, IPublicModule} from '../../common/types/models'

import {createThemedStyles} from '../../ui/theme'
import ProfileAvatarBlock from '../../browse/widgets/profile-avatar-block'
import {deriveModuleCoverImageUrl} from '../../../shared/module-cover-image'
import {headerSanSerif} from '../../static/styles/settings'
import {AspectRatio, COVER_IMAGE_ASPECT_RATIO} from '../../ui/layout/aspect-ratio'
import {LoadingImage} from '../../uiWidgets/loading-image'
import {getDisplayNameForModule} from '../../../shared/module/module-display-name'
import {ModuleVersionButton} from '../../modules/widgets/module-version-button'
import {useCurrentMemberAccount} from '../../common/use-current-member-account'
import {DevelopmentModeCheckBox} from '../development-mode-checkbox'
import {ClientDropdown} from '../client-dropdown'
import {useMultiRepoContext} from '../multi-repo-context'
import {RepoIdProvider} from '../../git/repo-id-context'
import useActions from '../../common/use-actions'
import dependencyActions from '../dependency-actions'

const useStyles = createThemedStyles({
  dependencyPaneHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: '0 1 117px',
  },
  centerColumn: {
    flex: '1 1 20rem',
  },
  rightColumn: {
    flex: '0 0 auto',
    display: 'flex',
    gap: '0.5em',
    alignItems: 'center',
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '0.25rem',
    objectFit: 'cover',
  },
  moduleTitle: {
    fontFamily: headerSanSerif,
    fontWeight: 700,
    fontSize: '1.25rem',
    display: 'inline',
    paddingRight: '1.5rem',
  },
})

interface IDependencyPaneHeader {
  module: IPublicModule
  account: IPublicAccount
  dependencyId: string
}

const DependencyPaneHeader: React.FC<IDependencyPaneHeader> = ({module, account, dependencyId}) => {
  const classes = useStyles()
  const memberAccount = useCurrentMemberAccount()
  const {fetchModuleTargets} = useActions(dependencyActions)

  const multiRepoContext = useMultiRepoContext()
  const isInDevelopment = multiRepoContext?.subRepoIds.has(module.repoId)

  return (
    <div className={classes.dependencyPaneHeader}>
      <div className={classes.leftColumn}>
        <AspectRatio ratio={COVER_IMAGE_ASPECT_RATIO}>
          <LoadingImage
            className={classes.coverImage}
            src={deriveModuleCoverImageUrl(module)}
            alt=''
          />
        </AspectRatio>
      </div>
      <div className={classes.centerColumn}>
        <div>
          <h1 className={classes.moduleTitle}>{getDisplayNameForModule(module)}</h1>
        </div>
        {module.description && <p>{module.description}</p>}
      </div>
      <div className={classes.rightColumn}>
        {memberAccount.uuid === module.AccountUuid
          ? (
            <>
              <DevelopmentModeCheckBox module={module} dependencyId={dependencyId} />
              {isInDevelopment &&
                <RepoIdProvider value={module.repoId}>
                  <ClientDropdown />
                </RepoIdProvider>
                }
              <ModuleVersionButton
                module={module}
                onDeploy={() => fetchModuleTargets({dependencyId, moduleId: module.uuid})}
              />
            </>
          )
          : <ProfileAvatarBlock account={account} />
        }
      </div>
    </div>
  )
}

export {
  DependencyPaneHeader,
}
