import React from 'react'
import {useTranslation} from 'react-i18next'

import {useCurrentGit, useGitProgress} from '../git/hooks/use-current-git'
import {getEditorSocketSpecifier} from '../common/hosting-urls'
import useCurrentApp from '../common/use-current-app'
import useSocket from '../common/use-socket'
import {useChangeEffect} from '../hooks/use-change-effect'
import {EditorSaveButton} from '../editor/editor-save-button'
import {FloatingTrayButton} from '../ui/components/floating-tray-button'
import {Icon} from '../ui/components/icon'
import {cherry, mango} from '../static/styles/settings'

const SAVING = 'scene_page.build_control_tray.button.status_saving'
const BUILDING = 'scene_page.build_control_tray.button.status_building'
const SUCCESS = 'scene_page.build_control_tray.button.status_success'
const WARNING = 'scene_page.build_control_tray.button.status_warning'
const FAILED = 'scene_page.build_control_tray.button.status_failed'

const StudioBuildButton: React.FC = () => {
  const app = useCurrentApp()
  const git = useCurrentGit()
  const gitProgress = useGitProgress()
  const saveProgress = gitProgress?.save
  const {t} = useTranslation(['cloud-studio-pages', 'cloud-editor-pages'])

  const timeoutRef = React.useRef(null)
  const [buildStatus, setBuildStatus] = React.useState('')
  const [progress, setProgress] = React.useState(0)

  const triggerTimeout = (timeout) => {
    clearTimeout(timeoutRef.current)
    timeout.current = setTimeout(() => {
      setBuildStatus('')
      setProgress(0)
    }, 2000)
  }
  const clientSocketSpecifier = getEditorSocketSpecifier({git, app}, 'current-client')

  const handler = (msg) => {
    switch (msg.action) {
      case 'BUILD_REQUEST':
        setBuildStatus(BUILDING)
        setProgress(80)
        break
      case 'NEW_BUILD':
        // if the build was not successful, we persist the status until the next time the
        //  user tries to build again
        if (msg.buildStatus !== 'ERROR') {
          triggerTimeout(timeoutRef)
        }

        switch (msg.buildStatus) {
          case 'ERROR':
            setBuildStatus(FAILED)
            break
          case 'WARNING':
            setBuildStatus(WARNING)
            setProgress(100)
            break
          case 'OK':
            setBuildStatus(SUCCESS)
            setProgress(100)
            break
          default:
            setBuildStatus('')
            setProgress(0)
        }
        break
      default:
    }
  }

  useSocket(clientSocketSpecifier, handler)
  React.useEffect(() => () => clearTimeout(timeoutRef.current), [])
  useChangeEffect(([prevSaveProgress]) => {
    if (saveProgress === 'START') {
      setBuildStatus(SAVING)
      setProgress(25)
    } else if (saveProgress === 'DONE' && prevSaveProgress === 'START') {
      clearTimeout(timeoutRef.current)
      setBuildStatus(BUILDING)
      setProgress(50)
    }
  }, [saveProgress])

  const getBuildButtonColor = (needSave: boolean) => {
    if (buildStatus === FAILED) {
      return 'danger'
    }
    if (needSave || buildStatus) {
      return 'warning'
    }
    return 'default'
  }

  const getProgressBarColor = () => {
    if (buildStatus === FAILED) {
      return cherry
    }
    return mango
  }

  const buildText = Build8.PLATFORM_TARGET === 'desktop'
    ? t('editor_page.log_container.button.cloud_build', {ns: 'cloud-editor-pages'})
    : t('editor_page.log_container.button.build', {ns: 'cloud-editor-pages'})

  return (
    <EditorSaveButton
      ignoreExpanse
      renderButton={({disabled, onClick, needSave}) => (
        <FloatingTrayButton
          a8='click;studio;project-build-button'
          isDisabled={disabled}
          onClick={onClick}
          color={getBuildButtonColor(needSave)}
          progressBarWidth={progress}
          progressBarColor={getProgressBarColor()}
          grow
        >
          {needSave && !buildStatus && <Icon stroke='record' color='warning' />}
          {buildStatus
            ? t(buildStatus, {ns: 'cloud-studio-pages'})
            : buildText}
        </FloatingTrayButton>
      )}
      app={app}
    />
  )
}

export {StudioBuildButton}
