import React from 'react'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {getPathForApp, AppPathEnum} from '../../common/paths'
import useCurrentAccount from '../../common/use-current-account'
import QuickStartPane from '../launcher-modal-panes/quickstart-pane'
import EighthWallTemplatesPane from '../launcher-modal-panes/8th-wall-templates-pane'
import MyProjectsPane from '../launcher-modal-panes/my-projects-pane'
import useActions from '../../common/use-actions'
import actions from '../../launcher/launcher-actions'
import {TabModal} from '../../uiWidgets/tab-modal'

const NewProjectModal = ({app}) => {
  const history = useHistory()
  const account = useCurrentAccount()
  const {t} = useTranslation(['cloud-editor-pages'])
  const {clearConsoleApps, clearReadMes} = useActions(actions)

  React.useEffect(() => () => {
    clearConsoleApps()
    clearReadMes()
  }, [])

  const launcherTabs = [
    {
      name: t('editor_page.project_picker_modal.quick_start_pane.title'),
      key: 'quick-start',
      component: <QuickStartPane app={app} />,
    },
    {
      name: t('editor_page.project_picker_modal.8th_wall_templates_pane.title'),
      key: '8thwall',
      component: <EighthWallTemplatesPane app={app} />,
    },
    {
      name: t('editor_page.project_picker_modal.my_projects.title'),
      key: 'personal',
      component: <MyProjectsPane app={app} />,
    },
  ]

  const handleCancel = () => {
    history.push(getPathForApp(account, app, AppPathEnum.project))
  }

  return (
    <TabModal
      tabs={launcherTabs}
      onClose={handleCancel}
    />
  )
}

export default NewProjectModal
