import * as React from 'react'
import {Modal, Dimmer} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import actions from './billing-actions'
import {Icon} from '../ui/components/icon'
import {getCurrentBillingEndDate} from './billing-utils'
import {FeedbackView} from './widgets/feedback-view'
import {Loader} from '../ui/components/loader'
import CompleteFeedbackView from './widgets/complete-feedback-view'
import useActions from '../common/use-actions'
import {CancelPlanConfirm} from './cancel-plan-confirm'
import {useSelector} from '../hooks'
import {tinyViewOverride} from '../static/styles/settings'

enum DowngradeModalState {
  LOADING = 1,
  CONFIRM_EOC = 2,
  COMPLETE_EOC = 3,
  ERROR = 4,
  COMPLETE_FEEDBACK = 5,
}

const CLOSABLE_MODAL_STATES = new Set([
  DowngradeModalState.CONFIRM_EOC,
  DowngradeModalState.COMPLETE_FEEDBACK,
  DowngradeModalState.ERROR,
])

const useStyles = createUseStyles({
  modal: {
    overflow: 'hidden',
  },
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

interface ICancelPlanModal {
  open: boolean
  onClose: () => void
  submitCancelPlanFeedback: (feedbackName, feedbackDetail, setupCall) => void
}

const CancelPlanModal: React.FC<ICancelPlanModal> = (
  {open, onClose, submitCancelPlanFeedback}
) => {
  const {i18n, t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const [modalViewState, setModalViewState] = React.useState(DowngradeModalState.CONFIRM_EOC)
  const [isLoading, setLoading] = React.useState(false)
  const closable = CLOSABLE_MODAL_STATES.has(modalViewState)
  const cycleEndDate = useSelector(state => getCurrentBillingEndDate(state))
  const {downgradeEndOfCycle} = useActions(actions)

  const handleClose = () => {
    setModalViewState(DowngradeModalState.CONFIRM_EOC)
    onClose()
  }

  const handleShareFeedback = async (feedbackName, feedbackDetail) => {
    setLoading(true)
    await submitCancelPlanFeedback(feedbackName, feedbackDetail, false)
    setModalViewState(DowngradeModalState.COMPLETE_FEEDBACK)
    setLoading(false)
  }

  const onConfirmDowngrade = async () => {
    setModalViewState(DowngradeModalState.LOADING)
    try {
      await downgradeEndOfCycle()
      setModalViewState(DowngradeModalState.COMPLETE_EOC)
    } catch {
      setModalViewState(DowngradeModalState.ERROR)
    }
  }

  const renderModalState = () => {
    switch (modalViewState) {
      case DowngradeModalState.CONFIRM_EOC:
        return (
          <CancelPlanConfirm
            endDate={cycleEndDate ? Intl.DateTimeFormat(i18n.language).format(cycleEndDate) : ''}
            onCloseClick={handleClose}
            onConfirmClick={onConfirmDowngrade}
          />
        )
      case DowngradeModalState.COMPLETE_EOC:
        return (
          <FeedbackView onFeedbackClick={handleShareFeedback} />
        )
      case DowngradeModalState.COMPLETE_FEEDBACK:
        return <CompleteFeedbackView />
      case DowngradeModalState.LOADING:
        return (
          <div className={classes.loaderContainer}>
            <Loader>{t('plan_billing_page.cancel_plan_modal.loader.canceling')}</Loader>
          </div>
        )
      case DowngradeModalState.ERROR:
      default:
        return (
          <div>
            <Icon stroke='danger' color='danger' />&nbsp;
            {t('plan_billing_page.cancel_plan_modal.error')}
          </div>
        )
    }
  }

  return (
    <Modal
      open={open}
      onClose={closable ? handleClose : undefined}
      closeOnDimmerClick={closable}
      size='small'
      className={classes.modal}
    >
      <div className={classes.modalContainer}>
        {renderModalState()}
      </div>
      <Dimmer active={isLoading} inverted>
        <Loader />
      </Dimmer>
    </Modal>
  )
}

export default CancelPlanModal
