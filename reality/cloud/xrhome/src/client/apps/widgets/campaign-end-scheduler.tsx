import 'react-dates/initialize'
import React, {FC, useEffect} from 'react'
import moment, {Moment} from 'moment'
import {SingleDatePicker} from 'react-dates'
import TimePicker from 'rc-time-picker'
import {Form} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {IApp} from '../../common/types/models'

import 'react-dates/lib/css/_datepicker.css'
import 'rc-time-picker/assets/index.css'
import '../../static/styles/react-dates-overrides.scss'
import useScheduledEndDate from '../../common/use-scheduled-end-date'
import ButtonLink from '../../uiWidgets/button-link'
import {tinyViewOverride} from '../../static/styles/settings'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '1em',
  },
  removeButton: {
    marginTop: '0.5em',
    [tinyViewOverride]: {
      marginTop: '-0.5em',
    },
  },
})

interface ICampaignEndScheduler {
  app: IApp
  onDateChange: (moment: Moment) => void
}

const CampaignEndScheduler: FC<ICampaignEndScheduler> = ({app, onDateChange}) => {
  const classes = useStyles()
  const renewalDate = useScheduledEndDate()
  const {t} = useTranslation(['app-pages'])
  const earliestEndDate = renewalDate ? moment(renewalDate) : moment()
  const [datePickerFocused, setDatePickerFocused] = React.useState<boolean>(false)
  const [selectedDate, setSelectedDate] = React.useState<Moment>(null)

  const endDate = app.endingAt ? moment(app.endingAt) : moment().add(3, 'months')

  useEffect(() => {
    onDateChange(selectedDate)
  }, [selectedDate])

  React.useEffect(() => {
    if (datePickerFocused && !selectedDate) {
      setSelectedDate(endDate)
    }
  }, [datePickerFocused])

  const disabledHours = () => {
    if (!earliestEndDate.isSame(selectedDate, 'day')) {
      return []
    }
    const disabled: number[] = []
    for (let i = 0; i < earliestEndDate.hour(); i++) {
      disabled.push(i)
    }
    return disabled
  }

  /* eslint-disable consistent-return */
  const disabledMinutes = (hour) => {
    if (!earliestEndDate.isSame(selectedDate, 'day')) {
      return
    }

    if (hour > earliestEndDate.hour()) {
      return []
    }

    let max = 59
    if (hour === earliestEndDate.hour()) {
      max = earliestEndDate.minute()
    }

    const disabled: number[] = []
    for (let i = 0; i <= max; i++) {
      disabled.push(i)
    }
    return disabled
  }

  const handleTimeUpdate = (newTime) => {
    if (!newTime || earliestEndDate.isAfter(newTime)) {
      return
    }
    setSelectedDate(newTime)
  }

  const handleDateUpdate = (newDate) => {
    if (!newDate) {
      return
    }

    selectedDate.date(newDate.toDate().getDate())
    selectedDate.month(newDate.toDate().getMonth())
    selectedDate.year(newDate.toDate().getFullYear())

    if (selectedDate.isBefore(earliestEndDate)) {
      selectedDate.hour(earliestEndDate.toDate().getHours())
      selectedDate.minute(earliestEndDate.toDate().getMinutes())
    }
    setSelectedDate(selectedDate)
  }

  const isOutsideRange = day => earliestEndDate.isAfter(day, 'day')

  const onRemove = () => {
    setSelectedDate(null)
    onDateChange(null)
  }

  return (
    <div className={classes.container}>
      <Form.Group widths={2} className='equal-input-heights campaign-duration-time-field-group'>
        <Form.Field className='campaign-duration-time-selection'>
          <SingleDatePicker
            placeholder={t('campaign_end_scheduler.placeholder.date')}
            date={selectedDate}
            onDateChange={handleDateUpdate}
            focused={datePickerFocused}
            onFocusChange={({focused}) => setDatePickerFocused(focused)}
            initialVisibleMonth={() => selectedDate || endDate}
            numberOfMonths={1}
            readOnly
            isOutsideRange={isOutsideRange}
            id='unique_idx'
            hideKeyboardShortcutsPanel
          />
        </Form.Field>
        <Form.Field>
          <TimePicker
            placeholder={t('campaign_end_scheduler.placeholder.time')}
            showSecond={false}
            defaultValue={selectedDate}
            format='h:mm a'
            use12Hours
            inputReadOnly
            allowEmpty={false}
            name='date'
            onChange={handleTimeUpdate}
            value={selectedDate}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
          />
        </Form.Field>
      </Form.Group>
      {selectedDate &&
        <ButtonLink className={classes.removeButton} onClick={onRemove}>
          {t('campaign_end_scheduler.button.remove')}
        </ButtonLink>
      }
    </div>
  )
}

export default CampaignEndScheduler
