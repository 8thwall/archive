import React from 'react'
import {Link} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'react-i18next'

import {getPathForAccount, AccountPathEnum} from '../../common/paths'
import {listWebUpgradeAccounts} from '../../../shared/account-utils'

const useStyles = createUseStyles({
  startPlanLink: {
    whiteSpace: 'nowrap',
  },
})

const SelfHostingUpsell = ({account}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const listAccountsToUpgrade =
    listWebUpgradeAccounts(t('project_settings_page.self_hosting_upsell.or'))

  return (
    <p>
      {t('project_settings_page.self_hosting_upsell.need_appkey')}{' '}
      {/* eslint-disable-next-line local-rules/i18n-nesting */}
      <Trans
        ns='app-pages'
        i18nKey='project_settings_page.self_hosting_upsell.upgrade_no_trial'
      >
        <Link
          to={getPathForAccount(account, AccountPathEnum.account)}
          className={classes.startPlanLink}
        >
          Start your {{listAccountsToUpgrade}} plan
        </Link> to access your App Key.
      </Trans>
    </p>
  )
}

export default SelfHostingUpsell
