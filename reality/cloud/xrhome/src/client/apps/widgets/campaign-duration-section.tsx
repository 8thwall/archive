import * as React from 'react'
import {useTranslation, Trans} from 'react-i18next'

// TODO(pawel) react-dates and rx-time-picker rely on moment; find a moment-free solution
import moment from 'moment'
import {Button, Form} from 'semantic-ui-react'
import type {Moment} from 'moment'

import type {IApp} from '../../common/types/models'
import actions from '../../billing/apps-billing-actions'
import CampaignEndScheduler from './campaign-end-scheduler'
import useScheduledEndDate from '../../common/use-scheduled-end-date'
import {useSelector} from '../../hooks'
import {DeemphasizedButton} from '../../widgets/deemphasized-button'
import {FALLBACK_LOCALE} from '../../../shared/i18n/i18n-locales'
import {isBillingRole} from '../../../shared/roles-utils'
import useActions from '../../common/use-actions'
import {Tooltip} from '../../ui/components/tooltip'
import {CancelCommercialAppModal} from './cancel-commercial-app-modal'
import appsBillingActions from '../../billing/apps-billing-actions'
import {Loader} from '../../ui/components/loader'

interface ICampaignDurationSection {
  app: IApp
}

const getFormattedDateAndTime = (date, locale: string = FALLBACK_LOCALE) => {
  const dateOptions = {year: 'numeric', month: 'numeric', day: 'numeric'}
  const dateString = date.toLocaleDateString(locale, dateOptions)
  const timeOptions = {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  }
  const timeString = date.toLocaleTimeString(locale, timeOptions)

  return {dateString, timeString}
}

interface ICurrentCampaignDuration {
  app: IApp
}

const CurrentCampaignDuration: React.FunctionComponent<ICurrentCampaignDuration> = ({app}) => {
  const {i18n, t} = useTranslation(['app-pages'])
  const durationFragment = t('project_dashboard_page.white_label_subscription.label.duration')
  const getScheduledEndContent = () => {
    if (!app.endingAt) {
      return ''
    }
    const date = new Date(app.endingAt)
    const {dateString, timeString} = getFormattedDateAndTime(date, i18n.language)

    return (
      <p>
        {durationFragment}
        <Trans
          ns='app-pages'
          i18nKey='project_dashboard_page.project_duration.scheduled_project_end.msg'
          components={{1: <b />}}
          values={{time_string: timeString, date_string: dateString}}
        />
      </p>
    )
  }

  const subscriptions = useSelector(state => state.billing && state.billing.subscriptionsByApp)
  const subscription = subscriptions && subscriptions[app.appKey]
  const renewalDate = useScheduledEndDate()

  let content
  if (app.endingAt && subscription && subscription.cancel_at_period_end) {
    const endDate = new Date(subscription.current_period_end)
    const {dateString, timeString} = getFormattedDateAndTime(endDate, i18n.language)
    content = (
      <p>
        {durationFragment}
        <Trans
          ns='app-pages'
          i18nKey='project_dashboard_page.project_duration.end_of_cycle.msg'
          components={{1: <b />}}
          values={{time_string: timeString, date_string: dateString}}
        />
      </p>
    )
  } else if (app.endingAt) {
    content = getScheduledEndContent()
  } else if (renewalDate) {
    const {dateString, timeString} = getFormattedDateAndTime(renewalDate, i18n.language)
    content = (
      <p>
        {durationFragment}
        <Trans
          ns='app-pages'
          i18nKey='project_dashboard_page.project_duration.ongoing_renew.msg'
          values={{date_string: dateString, time_string: timeString}}
          components={{0: <b />}}
        />
      </p>
    )
  } else {
    content = (
      <p>
        {durationFragment}
        <b>{t('project_dashboard_page.project_duration.ongoing')}</b>
      </p>
    )
  }

  return (
    content
  )
}

const isPast = (date: Moment) => (date.isBefore(moment()))

enum CampaignDurationOption {
  ONGOING = 'ONGOING',
  END_OF_CYCLE = 'END_OF_CYCLE',
  SCHEDULED_END = 'SCHEDULED_END',
  END_NOW = 'END_NOW',
}

interface IUEditDurationForm {
  app: IApp
  onSubmit: ({endingAt, durationType}) => void
  onCancel: () => void
}

const EditDurationForm: React.FunctionComponent<IUEditDurationForm> = (
  {app, onSubmit, onCancel}
) => {
  const [selectedDate, setSelectedDate] = React.useState(null)
  const [submitted, setSubmitted] = React.useState(false)
  const renewalDate = useScheduledEndDate()
  const {i18n, t} = useTranslation(['app-pages', 'common'])

  const useInitialSelectedOption = () => {
    const subscriptions = useSelector(state => state.billing && state.billing.subscriptionsByApp)
    const subscription = subscriptions && subscriptions[app.appKey]
    if (app.endingAt && subscription && subscription.cancel_at_period_end) {
      return CampaignDurationOption.END_OF_CYCLE
    } else if (app.endingAt) {
      return CampaignDurationOption.SCHEDULED_END
    } else {
      return CampaignDurationOption.ONGOING
    }
  }

  const initialSelectedOption = useInitialSelectedOption()
  const [selectedOption, setSelectedOption] = React.useState(initialSelectedOption)

  const commitDate = (date: Moment) => {
    if (isPast(date)) {
      // eslint-disable-next-line no-alert
      alert(t('project_dashboard_page.project_duration.alert.refuse_past_schedule'))
      return
    }

    const reformattedDate = new Date(date.toDate())
    const {dateString, timeString} = getFormattedDateAndTime(reformattedDate, i18n.language)

    if (
      /* eslint-disable-next-line no-restricted-globals, no-alert */
      confirm(t('project_dashboard_page.project_duration.confirm.cancel',
        {app_name: app.appName, date_string: dateString, time_string: timeString}))
    ) {
      onSubmit({endingAt: date.toDate(), durationType: selectedOption})
      setSubmitted(true)
    }
  }

  const onFormSubmit = () => {
    switch (selectedOption) {
      case CampaignDurationOption.ONGOING:
        setSubmitted(true)
        onSubmit({endingAt: null, durationType: selectedOption})
        break
      case CampaignDurationOption.END_OF_CYCLE:
        setSubmitted(true)
        onSubmit({endingAt: null, durationType: selectedOption})
        break
      case CampaignDurationOption.SCHEDULED_END:
        commitDate(selectedDate)
        break
      case CampaignDurationOption.END_NOW:
        setSubmitted(true)
        onSubmit({endingAt: null, durationType: selectedOption})
        break
      default:
        throw Error(t('project_dashboard_page.project_duration.error.unexpected_type'))
    }
  }

  const onFormCancel = () => {
    setSelectedDate(null)
    onCancel()
  }

  const onDateChange = (date) => {
    setSelectedDate(date)
  }

  const getForm = () => {
    if (!app.subscriptionId) {
      return (
        <Form>
          <Form.Radio
            label={t('project_dashboard_page.project_duration.ongoing')}
            value={CampaignDurationOption.ONGOING}
            onChange={() => setSelectedOption(CampaignDurationOption.ONGOING)}
            checked={selectedOption === CampaignDurationOption.ONGOING}
          />
          <Form.Radio
            label={t('project_dashboard_page.project_duration.end_now.label')}
            value={CampaignDurationOption.END_NOW}
            onChange={() => setSelectedOption(CampaignDurationOption.END_NOW)}
            checked={selectedOption === CampaignDurationOption.END_NOW}
          />
          <Form.Field>
            <Button
              primary
              onClick={onFormSubmit}
              loading={submitted}
              disabled={selectedOption === CampaignDurationOption.ONGOING}
            >{t('button.update', {ns: 'common'})}
            </Button>
            <Button onClick={onFormCancel}>{t('button.cancel', {ns: 'common'})}</Button>
          </Form.Field>
        </Form>
      )
    }

    const {dateString, timeString} = getFormattedDateAndTime(renewalDate, i18n.language)
    return (
      <Form>
        <Form.Radio
          label={t('project_dashboard_page.project_duration.ongoing.label',
            {date_string: dateString, time_string: timeString})}
          value={CampaignDurationOption.ONGOING}
          onChange={() => setSelectedOption(CampaignDurationOption.ONGOING)}
          checked={selectedOption === CampaignDurationOption.ONGOING}
        />
        <Form.Radio
          label={t('project_dashboard_page.project_duration.end_of_cycle.label',
            {date_string: dateString, time_string: timeString})}
          value={CampaignDurationOption.END_OF_CYCLE}
          onChange={() => setSelectedOption(CampaignDurationOption.END_OF_CYCLE)}
          checked={selectedOption === CampaignDurationOption.END_OF_CYCLE}
        />
        <Form.Radio
          label={t('project_dashboard_page.project_duration.scheduled_project_end.label')}
          value={CampaignDurationOption.SCHEDULED_END}
          onChange={() => setSelectedOption(CampaignDurationOption.SCHEDULED_END)}
          checked={selectedOption === CampaignDurationOption.SCHEDULED_END}
        />
        {selectedOption === CampaignDurationOption.SCHEDULED_END &&
          <CampaignEndScheduler app={app} onDateChange={onDateChange} />
        }
        <Form.Field>
          <Button
            primary
            onClick={onFormSubmit}
            loading={submitted}
            disabled={selectedOption === CampaignDurationOption.SCHEDULED_END && !selectedDate}
          >{t('button.update', {ns: 'common'})}
          </Button>
          <Button disabled={submitted} onClick={onFormCancel}>
            {t('button.cancel', {ns: 'common'})}
          </Button>
        </Form.Field>
      </Form>
    )
  }

  return getForm()
}

const CampaignDurationSection: React.FC<ICampaignDurationSection> = ({
  app,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])

  const {fetchAppSubscription, changeAppCampaignDuration} = useActions(actions)
  const {cancelAppLicense} = useActions(appsBillingActions)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(!!app.subscriptionId)
  const modalTriggerRef = React.useRef<(() => void) | null>(null)
  const userRole = useSelector(s => s.team.roles.find(e => e.email === s.user.email)?.role)
  const canEdit = isBillingRole(userRole)

  const hasPendingSubscriptionChange = useSelector(
    state => !!state.billing.subscriptionsByApp[app.appKey]?.schedule
  )

  const getDurationEditView = () => {
    const editButton = (
      <DeemphasizedButton
        onClick={() => setIsEditing(true)}
        className='purple'
        content={t('button.edit', {ns: 'common'})}
        disabled={!!hasPendingSubscriptionChange}
      />
    )

    if (hasPendingSubscriptionChange) {
      return (
        <Tooltip content={t('project_dashboard_page.project_duration.scheduled_project.edit')}>
          {editButton}
        </Tooltip>
      )
    }

    return editButton
  }

  React.useEffect(() => {
    if (app.subscriptionId) {
      fetchAppSubscription(app).then(() => {
        setIsLoading(false)
      })
    }
  }, [app.uuid])

  const onSubmit = ({endingAt, durationType}) => {
    if (durationType === CampaignDurationOption.END_NOW) {
      if (modalTriggerRef.current) {
        modalTriggerRef.current()
      }
      setIsEditing(false)
    } else {
      changeAppCampaignDuration(app, endingAt, durationType).then(() => setIsEditing(false))
    }
  }

  const onCancel = () => (
    setIsEditing(false)
  )

  return (
    <>
      {isLoading && <Loader inline />}

      <CancelCommercialAppModal
        app={app}
        cancelAppLicense={cancelAppLicense}
        createTrigger={(handleOpen) => {
          modalTriggerRef.current = handleOpen
        }}
      />

      {isEditing && !isLoading &&
        <EditDurationForm
          app={app}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      }

      {!isEditing && !isLoading && (
        <>
          <CurrentCampaignDuration app={app} />
          {canEdit && getDurationEditView()}
        </>
      )}
    </>
  )
}

export default CampaignDurationSection
