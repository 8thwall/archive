import DatePicker, {setDefaultLocale, registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {ja, enUS, es, de, fr} from 'date-fns/locale'
import {createUseStyles} from 'react-jss'

import {StandardTextInput} from '../../ui/components/standard-text-input'
import {cherry} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import {Icon} from '../../ui/components/icon'

type DateRangePickerProps = {
  earliest: Date
  latest: Date
  defaultStartDate: Date
  defaultEndDate: Date
  onValidRangeChange: (startDate: Date, endDate: Date) => void
}

const constantDatePickerProps = {
  timeIntervals: 60,
  fixedHeight: true,
  showIcon: true,
  enableTabLoop: false,
  // this makes the input date string correctly use the locale
  // https://github.com/Hacker0x01/react-datepicker/issues/2021
  dateFormat: 'P',
  popperPlacement: 'auto',
}

const datePickerUseStyles = createUseStyles({
  dateRangePickerHolder: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0 1em',
  },
  error: {
    color: cherry,
  },
  icon: {
    zIndex: 1,
    margin: 'auto',
    top: '0.2em !important',
  },
  popper: {
    zIndex: '2 !important',
  },
})

// need to do this for the date picker to localize
// unfortunately it doesn't seem like there is a
// nice way to use i18n to do this, so if we want
// to add additional languages we will need to
// also update this area + the datefns import
registerLocale('ja-JP', ja)
registerLocale('en-US', enUS)
registerLocale('es-MX', es)
registerLocale('de-DE', de)
registerLocale('fr-FR', fr)

const DateRangePicker = ({
  earliest,
  latest,
  defaultEndDate,
  defaultStartDate,
  onValidRangeChange,
}: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState<Date>(defaultStartDate)
  const [endDate, setEndDate] = useState<Date>(defaultEndDate)
  const [warningMessage, setWarningMessage] = useState<string>('')
  const classes = datePickerUseStyles()
  const {t, i18n} = useTranslation(['app-pages'])
  setDefaultLocale(i18n.language)

  const filterBoundedTime =
    (time: Date) => earliest.getTime() < time.getTime() && time.getTime() < latest.getTime()

  const checkIncorrectState = (newStart: Date, newEnd: Date) => {
    if (newStart > newEnd) {
      setWarningMessage(t('project_dashboard_page.recent_trends.graph.date_range.start_after_end'))
      return true
    }
    setWarningMessage('')
    return false
  }

  // Note(Brandon): Need to force calendar popper behavior or else popperPlacement will be
  // overridden by the default behavior.
  // https://github.com/Hacker0x01/react-datepicker/issues/1246#issuecomment-426004214
  const FORCE_POPPER_BEHAVIOR = {
    flip: {
      behavior: ['top'],
    },
    preventOverflow: {
      enabled: false,
    },
    hide: {
      enabled: false,
    },
  }

  const calendarIcon = (
    <div className={classes.icon}>
      <Icon stroke='calendar' />
    </div>
  )

  return (
    <div className={classes.dateRangePickerHolder}>
      {warningMessage &&
        <div className={combine(classes.row, classes.error)}>
          <Icon stroke='info' />
          <p>{warningMessage}</p>
        </div>
      }
      <div className={classes.row}>
        <DatePicker
          icon={calendarIcon}
          customInput={<StandardTextInput id='date-start' />}
          filterTime={filterBoundedTime}
          filterDate={filterBoundedTime}
          popperClassName={classes.popper}
          popperPlacement='top'
          popperModifiers={FORCE_POPPER_BEHAVIOR}
          selected={startDate}
          onChange={(date: Date) => {
            setStartDate(date)
            if (checkIncorrectState(date, endDate)) {
              return
            }
            onValidRangeChange(date, endDate)
          }}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale={i18n.language}
          timeCaption={t('project_dashboard_page.recent_trends.graph.date_range.time')}
          {...constantDatePickerProps}
        />
        <DatePicker
          icon={calendarIcon}
          customInput={<StandardTextInput id='date-end' />}
          filterTime={filterBoundedTime}
          filterDate={filterBoundedTime}
          popperClassName={classes.popper}
          popperPlacement='top'
          popperModifiers={FORCE_POPPER_BEHAVIOR}
          selected={endDate}
          onChange={(date: Date) => {
            setEndDate(date)
            if (checkIncorrectState(startDate, date)) {
              return
            }
            onValidRangeChange(startDate, date)
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          locale={i18n.language}
          timeCaption={t('project_dashboard_page.recent_trends.graph.date_range.time')}
          {...constantDatePickerProps}
        />
      </div>
    </div>
  )
}

export default DateRangePicker
