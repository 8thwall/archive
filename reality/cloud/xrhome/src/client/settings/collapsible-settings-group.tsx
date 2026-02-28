import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {Header} from 'semantic-ui-react'

import '../static/styles/collapsible-settings-group.scss'

interface ISettingsGroupProps {
  children: any
  header?: string | React.ReactNode
  showCollapseAll: boolean
  onExpandAllClick: () => void
  onCollapseAllClick: () => void
}

/**
 * Setting component which provides an option for all settings in the group
 * to be expanded or collapsed.
 */
const CollapsibleSettingsGroup: React.FunctionComponent<ISettingsGroupProps> = ({
  children,
  header = '',
  showCollapseAll,
  onExpandAllClick,
  onCollapseAllClick,
}) => {
  const {t} = useTranslation(['common'])

  return (
    <div className='collapsible-settings-group'>
      <div className='group-header'>
        <Header>{header}</Header>
        {showCollapseAll &&
          <button type='button' onClick={() => onCollapseAllClick()}>
            {t('button.collapsible_settings_group.collapse_all')}
          </button>}
        {!showCollapseAll &&
          <button type='button' onClick={() => onExpandAllClick()}>
            {t('button.collapsible_settings_group.expand_all')}
          </button>
      }
      </div>

      {children}
    </div>
  )
}

export default CollapsibleSettingsGroup
