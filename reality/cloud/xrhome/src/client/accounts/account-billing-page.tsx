import * as React from 'react'

import PlanBillingPage from '../billing/plan-billing-page'
import Page from '../widgets/page'
import {connect} from '../common/connect'

interface IAccountBillingPage {}

const AccountBillingPage: React.FC<IAccountBillingPage> = () => (
  <Page headerVariant='workspace'>
    <PlanBillingPage />
  </Page>
)

export default connect()(AccountBillingPage)
