import React from 'react'
import {Popup, List} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

interface IRoleInfoPopupProps {
  trigger: React.ReactNode
}

const RoleInfoPopup: React.FunctionComponent<IRoleInfoPopupProps> = ({trigger}) => {
  const {t} = useTranslation(['account-pages'])

  const rolePopupContent = [
    {
      role: 'Devs',
      content: t('team_page.role_info_popup.devs.content'),
    },
    {
      role: 'Admins',
      content: t('team_page.role_info_popup.admins.content'),
    },
    {
      role: 'Owners',
      content: t('team_page.role_info_popup.owners.content'),
    },
  ]

  const contentListItems = rolePopupContent.map(li => (
    <List.Item key={li.role}>{li.content}</List.Item>
  ))

  return (
    <Popup basic wide trigger={trigger}>
      <Popup.Content>
        <List>{contentListItems}</List>
      </Popup.Content>
    </Popup>
  )
}

export default RoleInfoPopup
