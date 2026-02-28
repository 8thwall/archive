import React from 'react'
import {useTranslation} from 'react-i18next'

import type {IAccount} from '../common/types/models'
import CollapsibleSettingsGroup from '../settings/collapsible-settings-group'
import {useCollapsibleSettingsGroup} from '../settings/use-collapsible-settings-group'
import {isPlatformApiEnabled} from '../../shared/account-utils'
import ImageTargetApiBox from '../image-targets/image-target-api-box'
import {useSelector} from '../hooks'

interface IPlatformApiSection {
  account: IAccount
}

enum Setting {
  IMAGE_TARGET
}

const settingsSet = new Set([Setting.IMAGE_TARGET])

const PlatformApiSection: React.FC<IPlatformApiSection> = ({account}) => {
  const {t} = useTranslation(['account-pages'])
  const keys = useSelector(
    s => s.apiKeys.byAccountUuid[account.uuid]?.map(u => s.apiKeys.entities[u])
  )

  const {
    expandedSettings,
    areAllSettingsExpanded,
    toggleSetting,
    expandAllSettings,
    collapseAllSettings,
  } = useCollapsibleSettingsGroup(settingsSet)

  if (!keys || (keys.length === 0 && !isPlatformApiEnabled(account))) {
    return null
  }

  return (
    <CollapsibleSettingsGroup
      header={t('plan_billing_page.platform_api_section.header')}
      showCollapseAll={areAllSettingsExpanded}
      onExpandAllClick={expandAllSettings}
      onCollapseAllClick={collapseAllSettings}
    >
      <ImageTargetApiBox
        account={account}
        active={expandedSettings.has(Setting.IMAGE_TARGET)}
        onClick={() => { toggleSetting(Setting.IMAGE_TARGET) }}
      />
    </CollapsibleSettingsGroup>
  )
}

export default PlatformApiSection
