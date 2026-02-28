import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {subDays} from 'date-fns'
import type {TimeUnit} from 'chart.js'

import {useSelector} from '../../hooks'
import LinkOut from '../../uiWidgets/link-out'
import type {IApp} from '../../common/types/models'
import {
  brandHighlight, gray5, gray4, gray2, tinyViewOverride,
} from '../../static/styles/settings'
import {bool, combine} from '../../common/styles'
import useActions from '../../common/use-actions'
import usageActions from '../../usage/usage-actions'
import {Loader} from '../../ui/components/loader'
import {Icon} from '../../ui/components/icon'
import {isAdApp, isCloudStudioApp} from '../../../shared/app-utils'
import DateRangePicker from './date-range-picker'
import {StandardDropdownField} from '../../ui/components/standard-dropdown-field'
import {makeAnalyticsIntervalTree} from '../../usage/analytics-interval-tree'
import type {
  AppAnalyticsDataPoint,
  CsvAppAnalyticsDataPoint,
} from '../../../shared/integration/app-analytics/app-analytics-api'
import {
  ceilLocalDay, floorLocalDay, floorToHour,
} from '../../../shared/time-utils'
import {downloadThunkCsv} from '../../common/download-utils'
import {AnalyticsDwellTimeChart} from './analytics-dwell-time-chart'
import {AnalyticsViewChart} from './analytics-view-chart'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'

const useStyles = createUseStyles({
  linkContainer: {
    display: 'flex',
    gap: '1.5em',
    padding: '1em 0',
    borderTop: `1px solid ${gray2}`,
  },
  activeLink: {
    borderBottom: `2px solid ${brandHighlight} !important`,
  },
  childLink: {
    'padding': '0.25em 0',
    'color': `${gray5} !important`,
    'border': 'none',
    'backgroundColor': 'transparent',
    'cursor': 'pointer',
    'borderBottom': '2px solid transparent',
    '&:hover': {
      color: `${gray4} !important`,
    },
  },
  loader: {
    height: '35em',
    [tinyViewOverride]: {
      height: '20em',
    },
  },
  externalLink: {
    display: 'flex',
    alignItems: 'center',
  },
  downloadIcon: {
    'height': '16px',
  },
  hide: {
    visibility: 'hidden',

    [tinyViewOverride]: {
      display: 'none',
    },
  },
})

interface ITrendTab {
  name: string
  component: React.ReactNode
  onClick?: () => void
}

interface IViewTrendsSection {
  app: IApp
}

// Functions other than 'daily' are not used in the current implementation
// but are included for future use.
const bucketingFns = {
  'hourly': (date: Date) => date.toISOString(),
  'daily': (date: Date) => floorLocalDay(date).toISOString(),
  'monthly': (date: Date) => {
    const truncatedDate = new Date(date)
    truncatedDate.setHours(0, 0, 0, 0)
    truncatedDate.setDate(1)
    return truncatedDate.toISOString()
  },
}

type I18nDateFormat = {
  val: (
    Partial<
    Record<'month' | 'day' | 'hour' | 'year', 'short' | 'numeric' | 'long'>
    >
  )
}

// i18n does not type their format options,
// so we have to use any here.
type FormattingOptions = {
  formatParams: I18nDateFormat
  unit: TimeUnit
  tooltipFormat: I18nDateFormat
}

// Code paths other than 'daily' are not used in the current implementation
// but are included for future use.
const getFormatting = (bucket: BucketOptions): FormattingOptions => {
  const formatting = {
    formatParams: {val: {}},
    unit: 'day',
    tooltipFormat: {val: {year: 'numeric', month: 'long', day: 'numeric'}},
    // Typescript doesn't read the strings as union members
  } as FormattingOptions
  if (bucket === 'hourly') {
    formatting.formatParams = {val: {month: 'short', day: 'numeric', hour: 'numeric'}}
    formatting.unit = 'hour'
  } else if (bucket === 'daily') {
    formatting.formatParams = {val: {month: 'short', day: 'numeric'}}
    formatting.unit = 'day'
  } else if (bucket === 'monthly') {
    formatting.formatParams = {val: {month: 'short'}}
    formatting.unit = 'month'
  }
  return formatting
}

type BucketOptions = keyof typeof bucketingFns

const reducer = (a: AppAnalyticsDataPoint, b: AppAnalyticsDataPoint): AppAnalyticsDataPoint => {
  const sampledSessions = a.userSessions + b.userSessions
  return {
    dt: a.dt,
    totalPageMillis: a.totalPageMillis + b.totalPageMillis,
    meanPageTimeMs: sampledSessions !== 0
      ? (a.totalPageMillis + b.totalPageMillis) / (sampledSessions)
      : 0,
    userSessions: sampledSessions,
    loggingRatio: sampledSessions !== 0
      ? (a.loggingRatio * a.userSessions + b.loggingRatio * b.userSessions) / (sampledSessions)
      : 0,
    views: a.views + b.views,
  }
}

const getCsvData = (data: AppAnalyticsDataPoint[]): CsvAppAnalyticsDataPoint[] => data.map(
  ({dt, meanPageTimeMs, views}) => ({dt, meanDwellTimeMs: meanPageTimeMs, views})
)

const ViewTrendsSection: React.FC<IViewTrendsSection> = ({app}) => {
  const loading = useSelector(state => state.usage.loading)
  const {t} = useTranslation(['app-pages'])
  const isAdvancedAnalyticsSupported = !isAdApp(app) && !isCloudStudioApp(app)
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = React.useState<number>(0)

  const earliestData = floorLocalDay(
    BuildIf.LOCAL_DEV ? new Date('2023-01-01T00:00:00') : new Date(app.createdAt)
  )
  // Want to show 30 days, if not, show all time that exists
  const defaultStart = subDays(ceilLocalDay(new Date()), 31) < earliestData
    ? earliestData
    : subDays(ceilLocalDay(new Date()), 31)
  const [dateSelectionOption, setDateSelectionOption] = React.useState<string>(
    defaultStart.toISOString()
  )
  // Can be changed to useState if needed and we want to modify
  // the resolution of the chart.
  const resolution = 'daily'
  const {loadAppAnalytics} = useActions(usageActions)
  const [chartStart, setChartStart] = React.useState<Date>(defaultStart)
  const [chartEnd, setChartEnd] = React.useState<Date>(floorToHour(new Date()))
  const [data, setData] = React.useState<AppAnalyticsDataPoint[] | null>(null)
  const [dailyViews, setDailyViews] = React.useState<boolean>(true)

  const tree = React.useMemo(() => makeAnalyticsIntervalTree<AppAnalyticsDataPoint>(
    (start, end) => loadAppAnalytics(start, end, app.uuid)
  ), [])

  const getRangeAbandonable = useAbandonableFunction(tree.getRange)

  const setChartPeriod = async (
    start: Date, end: Date, bucketer: (d: Date) => string = undefined
  ) => {
    setData(null)
    const res = await getRangeAbandonable(start, end, reducer, bucketer ?? bucketingFns[resolution])
    setChartStart(start)
    setChartEnd(end)
    setData(res)
  }

  React.useEffect(() => {
    setChartPeriod(chartStart, chartEnd, bucketingFns[resolution])
  }, [])

  const downloadOptions = [
    {
      content: t('project_dashboard_page.recent_trends.csv_exporter.selected_range'),
      onClick: async () => {
        await downloadThunkCsv(
          () => Promise.resolve(getCsvData(data)),
          `${t('project_dashboard_page.recent_trends.csv_exporter.filename')}.csv`
        )
      },
    },
    {
      content: t('project_dashboard_page.recent_trends.csv_exporter.all'),
      onClick: async () => {
        await downloadThunkCsv(
          () => getRangeAbandonable(earliestData, new Date(), reducer).then(getCsvData),
          `${t('project_dashboard_page.recent_trends.csv_exporter.filename')}.csv`
        )
      },
    },
  ]

  const dateSelection = (
    <>
      <StandardDropdownField
        id='date-selection-option'
        label={t('project_dashboard_page.recent_trends.selection.analytics_time')}
        // Days are offset by one to account for the current day
        options={[
          {
            content: t('project_dashboard_page.recent_trends.selection.7days'),
            value: subDays(ceilLocalDay(new Date()), 8).toISOString(),
          },
          {
            content: t('project_dashboard_page.recent_trends.selection.30days'),
            value: subDays(ceilLocalDay(new Date()), 31).toISOString(),
          },
          {
            content: t('project_dashboard_page.recent_trends.selection.60days'),
            value: subDays(ceilLocalDay(new Date()), 61).toISOString(),
          },
          {
            content: t('project_dashboard_page.recent_trends.selection.all_time'),
            value: earliestData.toISOString(),
          },
          {
            content: t('project_dashboard_page.recent_trends.selection.custom'),
            value: 'custom',
          },
        ].filter(({value}) => value === 'custom' || new Date(value) >= earliestData)}
        value={dateSelectionOption}
        onChange={async (newVal: string) => {
          setDateSelectionOption(newVal)
          const ceiledNow = floorToHour(new Date())
          if (newVal === 'custom') {
            return
          }
          const start = floorToHour(new Date(newVal))
          await setChartPeriod(start, ceiledNow)
        }}
      />
      <div className={bool(dateSelectionOption !== 'custom', classes.hide)}>
        <DateRangePicker
          earliest={earliestData}
          latest={new Date()}
          defaultStartDate={chartStart}
          defaultEndDate={chartEnd}
          onValidRangeChange={async (start, end) => {
            const offsetEnd = ceilLocalDay(end)
            await setChartPeriod(
              start,
              // Ensure the end date is not in the future, but include the whole day when
              // selected. Need to floor here so that we aren't re-fetching data every time
              // now increases by a few seconds.
              new Date(Math.min(offsetEnd.getTime(), floorToHour(new Date()).getTime()))
            )
          }}
        />
      </div>
    </>
  )

  const trendsTabs: ITrendTab[] =
  [
    {
      name: t('project_dashboard_page.recent_trends.tab.views'),
      component: <AnalyticsViewChart
        data={data ?? []}
        setShowDailyView={setDailyViews}
        showDailyView={dailyViews}
        dateSelection={dateSelection}
        downloadOptions={downloadOptions}
        formatting={getFormatting(resolution)}
      />,
    },
    {
      name: t('project_dashboard_page.recent_trends.tab.time_spent'),
      component: <AnalyticsDwellTimeChart
        data={data ?? []}
        dateSelection={dateSelection}
        downloadOptions={downloadOptions}
        formatting={getFormatting(resolution)}
      />,
    },
  ]

  return (
    <div>
      <div className='project-section-header-with-link'>
        <p className='cam-section'>
          {t('project_dashboard_page.recent_trends.header')}
        </p>
        {isAdvancedAnalyticsSupported &&
          <LinkOut
            className={classes.externalLink}
            url='https://www.8thwall.com/docs/web/#advanced-analytics'
            a8='click;xrhome-project-dashboard;add-advanced-analytics-link'
          >
            <span>
              {t('project_dashboard_page.recent_trends.add_analytics')}
            </span>&nbsp;<Icon stroke='external' />
          </LinkOut>
        }
      </div>
      <div className={classes.linkContainer}>
        {trendsTabs.map((tab: ITrendTab, index: number) => (
          <button
            type='button'
            key={tab.name}
            className={combine(index === selectedTab && classes.activeLink,
              classes.childLink)}
            onClick={() => {
              setSelectedTab(index)
              tab?.onClick?.()
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {!data || loading
        ? <div className={classes.loader}><Loader /></div>
        : trendsTabs[selectedTab].component
      }
    </div>
  )
}

export {
  ViewTrendsSection,
  type BucketOptions,
  type FormattingOptions,
}
