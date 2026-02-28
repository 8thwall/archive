import React from 'react'
import {useTranslation} from 'react-i18next'

import {FloatingTrayButton} from '../ui/components/floating-tray-button'
import {mango, mint} from '../static/styles/settings'
import {SuperSyncButton} from '../git/components/super-sync-button'
import {Icon} from '../ui/components/icon'
import {useGitProgress} from '../git/hooks/use-current-git'

interface IStudioSyncButton {
}

const StudioSyncButton: React.FC<IStudioSyncButton> = () => {
  const {t} = useTranslation(['cloud-studio-pages', 'common'])
  const [syncStatus, setSyncStatus] = React.useState('')
  const gitProgress = useGitProgress()

  React.useEffect(() => {
    if (gitProgress.sync === 'START') {
      setSyncStatus(t('scene_page.build_control_tray.button.status_syncing',
        {ns: 'cloud-studio-pages'}))
    } else if (gitProgress.sync === 'DONE') {
      setSyncStatus(t('scene_page.build_control_tray.button.status_success',
        {ns: 'cloud-studio-pages'}))
    }
  }, [gitProgress])

  return (
    <SuperSyncButton
      renderButton={({disabled, onClick, loading, hasConflict}) => (
        <FloatingTrayButton
          a8='click;studio;project-sync-button'
          isDisabled={disabled}
          onClick={onClick}
          color={hasConflict ? 'warning' : 'success'}
          fauxProgressBar={loading}
          progressBarColor={hasConflict ? mango : mint}
          grow
        >
          {!loading && hasConflict && <Icon stroke='record' color='warning' />}
          {loading ? syncStatus : t('button.sync', {ns: 'common'})}
        </FloatingTrayButton>
      )}
      showSyncMessage={false}
    />
  )
}

export {StudioSyncButton}
