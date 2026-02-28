import * as React from 'react'
import {Dimmer} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {Loader} from '../../ui/components/loader'
import useActions from '../../common/use-actions'
import {tinyViewOverride} from '../../static/styles/settings'
import {CancelCreditPlanConfirm} from './cancel-credit-plan-confirm'
import {FeedbackView} from '../widgets/feedback-view'
import CompleteFeedbackView from '../widgets/complete-feedback-view'
import useCurrentAccount from '../../common/use-current-account'
import {getActiveCreditGrant} from '../../../shared/feature-utils'
import {StaticBanner} from '../../ui/components/banner'
import featureActions from '../feature-actions'
import {StandardModal} from '../../editor/standard-modal'

enum CancelModalState {
  LOADING = 1,
  CONFIRM_EOC = 2,
  COMPLETE_EOC = 3,
  ERROR = 4,
  COMPLETE_FEEDBACK = 5,
}

const CLOSABLE_MODAL_STATES = new Set([
  CancelModalState.CONFIRM_EOC,
  CancelModalState.COMPLETE_FEEDBACK,
  CancelModalState.ERROR,
])

const useStyles = createUseStyles({
  modalContainer: {
    padding: '3em',
    textAlign: 'center',
    [tinyViewOverride]: {
      padding: '1.5em',
    },
  },
  loaderContainer: {
    height: '5em',
  },
})

interface ICancelCreditPlanModal {
  onClose: () => void
  submitCancelPlanFeedback: (feedbackName, feedbackDetail, setupCall) => void
}

const CancelCreditPlanModal: React.FC<ICancelCreditPlanModal> = (
  {onClose, submitCancelPlanFeedback}
) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const account = useCurrentAccount()
  const [modalViewState, setModalViewState] = React.useState(CancelModalState.CONFIRM_EOC)
  const [isLoading, setLoading] = React.useState(false)
  const closable = CLOSABLE_MODAL_STATES.has(modalViewState)
  const {cancelAccountFeatureSubscription} = useActions(featureActions)
  const activeCreditGrant = getActiveCreditGrant(account.Features)

  const handleClose = () => {
    setModalViewState(CancelModalState.CONFIRM_EOC)
    onClose()
  }

  const handleShareFeedback = async (feedbackName: string, feedbackDetail: string) => {
    setLoading(true)
    await submitCancelPlanFeedback(feedbackName, feedbackDetail, false)
    setModalViewState(CancelModalState.COMPLETE_FEEDBACK)
    setLoading(false)
  }

  const onConfirmDowngrade = async () => {
    setModalViewState(CancelModalState.LOADING)
    try {
      await cancelAccountFeatureSubscription({
        account,
        featureName: activeCreditGrant.featureName,
        optionName: activeCreditGrant.optionName,
      })
      setModalViewState(CancelModalState.COMPLETE_EOC)
    } catch {
      setModalViewState(CancelModalState.ERROR)
    }
  }

  const renderModalState = () => {
    switch (modalViewState) {
      case CancelModalState.CONFIRM_EOC:
        return (
          <CancelCreditPlanConfirm
            onCloseClick={handleClose}
            onConfirmClick={onConfirmDowngrade}
          />
        )
      case CancelModalState.COMPLETE_EOC:
        return (
          <FeedbackView onFeedbackClick={handleShareFeedback} isCreditSubscriptionCancel />
        )
      case CancelModalState.COMPLETE_FEEDBACK:
        return <CompleteFeedbackView isCreditSubscription />
      case CancelModalState.LOADING:
        return (
          <div className={classes.loaderContainer}>
            <Loader>{t('plan_billing_page.cancel_plan_modal.loader.canceling')}</Loader>
          </div>
        )
      case CancelModalState.ERROR:
      default:
        return (
          <StaticBanner type='danger'>
            {t('plan_billing_page.cancel_plan_modal.error')}
          </StaticBanner>
        )
    }
  }

  return (
    <StandardModal
      onClose={closable ? handleClose : undefined}
      closeOnDimmerClick={closable}
      size='small'
    >
      <div className={classes.modalContainer}>
        {renderModalState()}
      </div>
      <Dimmer active={isLoading}>
        <Loader />
      </Dimmer>
    </StandardModal>
  )
}

export default CancelCreditPlanModal
