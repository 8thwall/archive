import * as React from 'react'

import WebAppOperationContainer from '../web-app-operations/components/web-app-oper-container'
import {getSelectedAccount} from '../../accounts'
import {useSelector} from '../../hooks'
import type {IAccount, IApp, IPublicAccount, IPublicApp} from '../../common/types/models'

interface ICreateWebApp {
  fromAccount?: IAccount | IPublicAccount
  fromApp?: IApp | IPublicApp
  isMyAccount?: boolean
}

const CreateWebApp: React.FunctionComponent<ICreateWebApp> =
({fromAccount, fromApp, isMyAccount}) => {
  const account = useSelector(state => getSelectedAccount(state))
  return (
    <WebAppOperationContainer
      fromAccount={fromAccount}
      fromApp={fromApp}
      isMyAccount={isMyAccount}
      account={account}
    />
  )
}

export default CreateWebApp
