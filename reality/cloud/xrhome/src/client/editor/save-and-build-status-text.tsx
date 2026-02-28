import React from 'react'
import {useTranslation} from 'react-i18next'

import useSocket from '../common/use-socket'
import {useGitProgress} from '../git/hooks/use-current-git'
import type {SocketSpecifier} from '../websockets/websocket-pool'
import {useChangeEffect} from '../hooks/use-change-effect'
import {useGitsNeedsSave} from '../git/hooks/use-open-gits'

interface CIBuildStatusText {
  specifier: SocketSpecifier
}

const SaveAndBuildStatusText: React.FunctionComponent<CIBuildStatusText> = ({
  specifier,
}) => {
  const gitProgress = useGitProgress()
  const needsSave = useGitsNeedsSave()
  const {t} = useTranslation(['cloud-editor-pages'])
  const saveProgress = gitProgress?.save

  const timeoutRef = React.useRef(null)
  const [buildStatus, setBuildStatus] = React.useState('')

  const triggerTimeout = (timeout) => {
    clearTimeout(timeoutRef.current)
    timeout.current = setTimeout(() => {
      setBuildStatus('')
    }, 5000)
  }

  const getSaveMessage = (needSave, progress) => {
    switch (progress) {
      case 'UNSPECIFIED':
      case 'DONE':
        if (needSave) {
          return t('editor_page.save_msg.ready_to_build')
        }
        return t('editor_page.save_msg.no_changes_to_build')
      case 'START':
        return t('editor_page.save_msg.saving_project')
      default:
        return ''
    }
  }

  const handler = (msg) => {
    switch (msg.action) {
      case 'BUILD_REQUEST':
        setBuildStatus(t('editor_page.action_msg.building_in_cloud'))
        break
      case 'NEW_BUILD':
        triggerTimeout(timeoutRef)
        switch (msg.buildStatus) {
          case 'ERROR':
            setBuildStatus(t('editor_page.action_msg.build_failed'))
            break
          case 'WARNING':
            setBuildStatus(t('editor_page.action_msg.build_successful_with_warnings'))
            break
          case 'OK':
            setBuildStatus(t('editor_page.action_msg.build_successful'))
            break
          default:
        }
        break
      default:
    }
  }

  useSocket(specifier, handler)
  React.useEffect(() => () => clearTimeout(timeoutRef.current), [])
  useChangeEffect(([prevSaveProgress]) => {
    if (saveProgress === 'DONE' && prevSaveProgress === 'START') {
      clearTimeout(timeoutRef.current)
      setBuildStatus(t('editor_page.action_msg.sending_to_cloud'))
    }
  }, [saveProgress])

  return (
    <small className='top-pane-label'>
      {buildStatus || getSaveMessage(needsSave, saveProgress)}
    </small>
  )
}

export default SaveAndBuildStatusText
