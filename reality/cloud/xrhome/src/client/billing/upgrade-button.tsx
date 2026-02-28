import * as React from 'react'
import {Button} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import proSparklesSvg from '../static/icons/sparkles.svg'
import {getPathForAccount, AccountPathEnum} from '../common/paths'

const UpgradeButton = ({account}) => {
  const {t} = useTranslation(['account-pages'])
  return (
    <Button
      color='green'
      className='upgrade-button'
      as={Link}
      compact
      to={getPathForAccount(account, AccountPathEnum.account)}
    >
      {t('account_pages.button.upgrade')}
      <img className='image right icon' src={proSparklesSvg} />
    </Button>
  )
}

export default UpgradeButton
