import React, {useState} from 'react'
import {Dimmer} from 'semantic-ui-react'

import {ManageActiveAccountPlan} from './manage-active-account-plan'
import {isBasic} from '../../../shared/account-utils'
import useCurrentAccount from '../../common/use-current-account'
import {useSelector} from '../../hooks'
import {Loader} from '../../ui/components/loader'
import useActions from '../../common/use-actions'
import {UnauthorizedManageAccountPlan} from './unauthorized-manage-account-plan'
import accountActions from '../../accounts/account-actions'
import CancelPlanModal from '../cancel-plan-modal'
import {isBillingRole} from '../../../shared/roles-utils'
import {useCurrentUser} from '../../user/use-current-user'
import {StandardContainer} from '../../ui/components/standard-container'
import SpaceBelow from '../../ui/layout/space-below'

const AccountPlanContainer = () => {
  const account = useCurrentAccount()
  const user = useCurrentUser()
  const deleteScheduledPlanPending = useSelector(state => state.billing.deleteScheduledPlanPending)
  const cancelPendingPlanPending = useSelector(state => state.billing.cancelPendingPlanPending)
  const showLoader =
    deleteScheduledPlanPending ||
    cancelPendingPlanPending
  const {submitCancelPlanFeedback} = useActions(accountActions)
  const userRole = account.Users[0].role
  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false)

  if (isBasic(account)) {
    return null
  }

  let content
  if (!isBillingRole(userRole)) {
    content = <UnauthorizedManageAccountPlan />
  } else {
    content = <ManageActiveAccountPlan onDowngradeClick={() => setOpenCancelModal(true)} />
  }

  const handleSubmitCancelPlanFeedback = (feedbackName, feedbackDetail, setupCall) => (
    submitCancelPlanFeedback(
      account.uuid,
      feedbackName,
      feedbackDetail,
      setupCall,
      {crmId: user['custom:crmId'], email: user.email}
    )
  )

  return (
    <SpaceBelow>
      <StandardContainer padding='large'>
        {/* TODO(alvinportillo): Work with design to decide on real loading state */}
        <Dimmer page inverted active={showLoader}>
          <Loader />
        </Dimmer>
        {content}
        <CancelPlanModal
          open={openCancelModal}
          onClose={() => setOpenCancelModal(false)}
          submitCancelPlanFeedback={handleSubmitCancelPlanFeedback}
        />
      </StandardContainer>
    </SpaceBelow>
  )
}

export default AccountPlanContainer
