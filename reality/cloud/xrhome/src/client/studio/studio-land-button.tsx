import React from 'react'
import {useTranslation} from 'react-i18next'

import useCurrentApp from '../common/use-current-app'
import {LandButton} from '../git/components/land-button'
import {FloatingTrayButton} from '../ui/components/floating-tray-button'
import {mint} from '../static/styles/settings'
import {isAppLicenseType} from '../../shared/app-utils'
import useCurrentAccount from '../common/use-current-account'
import expanseHistoryActions from './actions/expanse-history-actions'
import useActions from '../common/use-actions'
import {useCurrentGit} from '../git/hooks/use-current-git'
import type {LandType} from '../editor/hooks/use-land-publish-state'

interface IStudioLandButton {
  onRemoteLand: (landType: LandType, commitId: string) => Promise<void>
}

const StudioLandButton: React.FC<IStudioLandButton> = ({onRemoteLand}) => {
  const app = useCurrentApp()
  const account = useCurrentAccount()
  const {t} = useTranslation(['cloud-editor-pages', 'cloud-studio-pages', 'common'])
  const [landStatus, setLandStatus] = React.useState('')
  const {uploadExpanseHistoryBeforeLand} = useActions(expanseHistoryActions)
  const repo = useCurrentGit(git => git.repo)

  const handleBeforeExpanseLand = async () => {
    await uploadExpanseHistoryBeforeLand(repo)
  }

  return (
    <LandButton
      renderButton={({disabled, onClick, canLand, loading}) => (
        <FloatingTrayButton
          a8='click;studio;project-land-button'
          isDisabled={disabled}
          onClick={() => {
            setLandStatus(t('scene_page.build_control_tray.button.status_landing',
              {'ns': 'cloud-studio-pages'}))
            onClick()
          }}
          color={(canLand || loading) ? 'success' : 'default'}
          fauxProgressBar={loading}
          progressBarColor={mint}
          grow
        >
          {loading ? landStatus : t('button.land', {'ns': 'common'})}
        </FloatingTrayButton>
      )}
      secondaryButtonText={t('editor_page.button.land_files_and_publish')}
      disableSecondaryButton={isAppLicenseType(app) && !account.publicFeatured}
      onRemoteLandComplete={(landType, commitId) => {
        setLandStatus(t('scene_page.build_control_tray.button.status_success',
          {'ns': 'cloud-studio-pages'}))
        onRemoteLand(landType, commitId)
      }}
      showNumChanges={false}
      onBeforeExpanseLand={handleBeforeExpanseLand}
    />
  )
}

export {StudioLandButton}
