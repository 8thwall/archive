import React from 'react'
import {useRouteMatch} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {useSelector} from '../../hooks'
import Accordion from '../../widgets/accordion'
import CollapsibleSettingsGroup from '../../settings/collapsible-settings-group'
import {isSelfHostingEnabled} from '../../../shared/account-utils'
import {getRouteAccount, getRouteApp} from '../../common/paths'
import AppKeyDisplay from '../widgets/app-key-display'
import {AppSetting, AppSettingsGroup} from './app-settings-types'
import {useCollapsibleSettingsGroup} from '../../settings/use-collapsible-settings-group'
import {Icon} from '../../ui/components/icon'

const useStyles = createUseStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25em',
  },
})

const SelfHostingSettings: React.FunctionComponent = React.memo(() => {
  const {t} = useTranslation(['app-pages'])
  const match = useRouteMatch()
  const account = useSelector(state => getRouteAccount(state, match))
  const app = useSelector(state => getRouteApp(state, match))
  const classes = useStyles()

  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(AppSettingsGroup.SELF_HOSTING)

  return (
    <CollapsibleSettingsGroup
      header={(
        <div className={classes.header}>
          {t('project_settings_page.self_hosting_settings.header')}
          {!isSelfHostingEnabled(account) && <Icon stroke='lock' color='gray3' />}
        </div>
      )}
      showCollapseAll={areAllSettingsExpanded}
      onExpandAllClick={expandAllSettings}
      onCollapseAllClick={collapseAllSettings}
    >
      <Accordion>
        <Accordion.Title
          active={expandedSettings.has(AppSetting.APP_KEY)}
          onClick={() => toggleSetting(AppSetting.APP_KEY)}
          a8='click;xrhome-project-settings;my-app-key-accordian'
        >
          {t('project_settings_page.self_hosting_settings.title.appkey')}
        </Accordion.Title>
        <Accordion.Content>
          <AppKeyDisplay app={app} account={account} />
        </Accordion.Content>
      </Accordion>
    </CollapsibleSettingsGroup>
  )
})

export default SelfHostingSettings
