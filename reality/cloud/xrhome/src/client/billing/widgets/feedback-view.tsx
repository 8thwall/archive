/* eslint-disable quote-props */
import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {brandBlack, gray1, gray2, gray3, gray4, gray6} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import {PrimaryButton} from '../../ui/components/primary-button'
import {StandardTextAreaField} from '../../ui/components/standard-text-area-field'
import SpaceBelow from '../../ui/layout/space-below'

const useStyles = createUseStyles({
  feedbackHeader: {
    whiteSpace: 'nowrap',
    fontWeight: 700,
    fontSize: '1.7em',
    margin: '0',
  },
  feedbackOptions: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.7em',
    marginBottom: '1em',
  },
  feedbackOption: {
    color: brandBlack,
    borderColor: 'transparent',
    backgroundColor: gray1,
    borderRadius: '0.2em',
    padding: '0.5em 1em',
    fontWeight: 400,
    letterSpacing: '0.03em',
    '&:hover': {
      cursor: 'pointer',
    },
    '&.selected': {
      color: 'white',
      backgroundColor: gray4,
      fontWeight: 400,
    },
  },
  feedbackForm: {
    width: '100%',
    '& textarea::placeholder': {
      color: `${gray3} !important`,
    },
  },
  feedbackActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '1em',
    gap: '0.5em',
  },
  buttonLink: {
    padding: '0 1em',
  },
  bodyText: {
    fontSize: '1.125em',
    padding: '1em 0',
    lineHeight: '1.5em',
  },
  questionHeader: {
    textAlign: 'center',
    fontSize: '1.4em',
    color: gray6,
    margin: '1em 2em 0',
  },
  divider: {
    borderTop: `1px solid ${gray2}`,
  },
})

interface IFeedbackView {
  onFeedbackClick: (feedbackName: string, feedbackDetail: string) => void
  isCreditSubscriptionCancel?: boolean
}

const FeedbackView: React.FunctionComponent<IFeedbackView> = ({
  onFeedbackClick, isCreditSubscriptionCancel = false,
}) => {
  const {t} = useTranslation(['account-pages'])
  const [feedbackName, setFeedbackName] = React.useState(null)
  const [showFeedbackDetail, setShowFeedbackDetail] = React.useState(false)
  const [feedbackDetail, setFeedbackDetail] = React.useState('')
  const [feedbackDetailPlaceHolder, setFeedbackDetailPlaceHolder] = React.useState('')
  const classes = useStyles()
  const disableSubmit = isCreditSubscriptionCancel
    ? !feedbackName
    : (!feedbackName || feedbackDetail.length === 0)
  const textAreaRef = React.useRef(null)
  const textAreaFocus = () => textAreaRef.current?.focus()

  const FEEDBACK_MAX_LENGTH = 512
  const FEEDBACK_INITIAL_ROWS = 8

  const shareDetail = (name, placeholder) => {
    setFeedbackName(name)
    setShowFeedbackDetail(true)
    setFeedbackDetailPlaceHolder(placeholder)
    textAreaFocus()
  }

  const onFeedbackDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackDetail(e.target.value)
  }

  const handleSubmitFeedback = () => {
    onFeedbackClick(feedbackName, feedbackDetail)
  }

  const FEEDBACK_OPTIONS = [
    {
      name: 'Don\'t use enough',
      title: 'plan_billing_page.feedback_view.name.dont_use_enough',
      placeholder: 'plan_billing_page.feedback_view.placeholder.dont_use_enough',
    },
    {
      name: 'Too difficult for my skill level',
      title: 'plan_billing_page.feedback_view.name.too_difficult',
      placeholder: 'plan_billing_page.feedback_view.placeholder.too_difficult',
    },
    {
      name: 'Not enough resources',
      title: 'plan_billing_page.feedback_view.name.not_enough_resources',
      placeholder: 'plan_billing_page.feedback_view.placeholder.not_enough_resources',
    },
    {
      name: 'Found other product',
      title: 'plan_billing_page.feedback_view.name.found_other_product',
      placeholder: 'plan_billing_page.feedback_view.placeholder.found_other_product',
    },
    {
      name: 'Bug issues',
      title: 'plan_billing_page.feedback_view.name.bug_issues',
      placeholder: 'plan_billing_page.feedback_view.placeholder.bug_issues',
    },
    {
      name: 'Missing functionality',
      title: 'plan_billing_page.feedback_view.name.missing_functionality',
      placeholder: 'plan_billing_page.feedback_view.placeholder.missing_functionality',
    },
  ]

  return (
    <>
      <SpaceBelow>
        <h2 className={classes.feedbackHeader}>
          {t('plan_billing_page.feedback_view.main_reason_for_canceling')}
        </h2>
      </SpaceBelow>
      <div className={classes.feedbackOptions}>
        {FEEDBACK_OPTIONS.map(option => (
          <button
            type='button'
            className={combine(classes.feedbackOption,
              (feedbackName === option.name) && 'selected')
              }
            onClick={() => shareDetail(option.name, option?.placeholder)}
            key={option.name}
          >
            {t(option.title)}
          </button>
        ))}
      </div>
      {showFeedbackDetail &&
        <div className={classes.feedbackForm}>
          <StandardTextAreaField
            id='feedback-text-field'
            label=''
            maxLength={FEEDBACK_MAX_LENGTH}
            rows={FEEDBACK_INITIAL_ROWS}
            placeholder={t(feedbackDetailPlaceHolder)}
            autoFocus
            value={feedbackDetail}
            onChange={onFeedbackDetailChange}
            ref={textAreaRef}
          />
        </div>
        }
      <div className={classes.feedbackActions}>
        <PrimaryButton
          spacing='wide'
          onClick={handleSubmitFeedback}
          disabled={disableSubmit}
        >
          {t('plan_billing_page.feedback_view.button.submit')}
        </PrimaryButton>
      </div>
    </>
  )
}

export {
  FeedbackView,
}
