import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {FloatingTray} from '../ui/components/floating-tray'
import {FloatingTrayButton} from '../ui/components/floating-tray-button'
import {PublishButton} from '../editor/publish-button'
import {useLandPublishState} from '../editor/hooks/use-land-publish-state'
import type {IApp} from '../common/types/models'
import {useOpenGits} from '../git/hooks/use-open-gits'
import {doesRepoNeedSync} from '../git/git-checks'
import {StudioBuildButton} from './studio-build-button'
import {StudioLandButton} from './studio-land-button'
import {StudioSyncButton} from './studio-sync-button'
import {useSceneContext} from './scene-context'

const useStyles = createUseStyles({
  trayContainer: {
    flex: '1 0 auto',
  },
})

interface IBuildControlTray {
  app: IApp
}

const BuildControlTray: React.FC<IBuildControlTray> = ({app}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const openRepos = useOpenGits()
  const needsSync = openRepos.some(repoState => doesRepoNeedSync(repoState))
  const classes = useStyles()
  const ctx = useSceneContext()

  const {
    landPublishState,
    publish,
    onRemoteLand,
  } = useLandPublishState(app)

  const isDesktop = Build8.PLATFORM_TARGET === 'desktop'
  return (
    <div className={classes.trayContainer}>
      <FloatingTray fillContainer nonInteractive={ctx.isDraggingGizmo}>
        {!isDesktop && <StudioBuildButton />}
        { needsSync
          ? (
            <StudioSyncButton />
          )
          : (
            <StudioLandButton
              onRemoteLand={onRemoteLand}
            />
          )
      }
        <PublishButton
          renderButton={({disabled}) => (
            <FloatingTrayButton
              a8='click;studio;project-publish-button'
              isDisabled={disabled}
              color='purple'
              grow
            >
              {t('editor_page.button.publish')}
            </FloatingTrayButton>
          )}
          publish={publish}
          landPublishState={landPublishState}
        />
      </FloatingTray>
    </div>
  )
}

export {
  BuildControlTray,
}
