/* eslint-disable quote-props */
import * as React from 'react'
import {createUseStyles} from 'react-jss'

import type {IApp, IAccount} from '../../common/types/models'
import {isSelfHostingEnabled} from '../../../shared/account-utils'
import SelfHostingUpsell from './self-hosting-upsell'
import CopyableLine from '../../widgets/copyable-line'

const useStyles = createUseStyles({
  upsellWrapper: {
    paddingTop: '1rem',
  },
})

interface IAppKeyDisplay {
  app: IApp
  account: IAccount
}

const AppKeyDisplay: React.FunctionComponent<IAppKeyDisplay> = ({app, account}) => {
  const classes = useStyles()
  const {appKey} = app
  const hasAccess = isSelfHostingEnabled(account)

  return (
    <>
      <CopyableLine text={appKey} disabled={!hasAccess} />

      {!hasAccess &&
        <div className={classes.upsellWrapper}><SelfHostingUpsell account={account} /></div>
      }
    </>
  )
}

export default AppKeyDisplay
