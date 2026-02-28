import * as React from 'react'
import {useTranslation} from 'react-i18next'

import {isEntryWebAccount} from '../../../shared/account-utils'
import type {IAccount} from '../../common/types/models'
import useTextStyles from '../../styles/text-styles'
import {TooltipIcon} from '../../widgets/tooltip-icon'

interface IProjectTitleLabelOld {
  subtitle: string
  account: IAccount
}

const ProjectTitleLabel: React.FC<IProjectTitleLabelOld> = ({subtitle, account}) => {
  const {t} = useTranslation(['app-pages'])
  const textStyles = useTextStyles()
  return (
    <label htmlFor='appTitle'>
      <h3 className={textStyles.miniHeading}>{t('project_settings_page.project_title_label')}
        {isEntryWebAccount(account) && <span className={textStyles.requiredField}> *</span>}
      </h3>
      <TooltipIcon content={subtitle} />
    </label>
  )
}

export default ProjectTitleLabel
