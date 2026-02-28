import React from 'react'
import 'chart.js/auto'
import {Line} from 'react-chartjs-2'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {blueberry, darkBlueberry, tinyViewOverride} from '../../static/styles/settings'
import type {
  AppAnalyticsDataPoint,
} from '../../../shared/integration/app-analytics/app-analytics-api'
import {hexColorWithAlpha} from '../../../shared/colors'
import {
  floorLocalDay, MILLISECONDS_PER_MINUTE, MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE,
} from '../../../shared/time-utils'
import '../../../third_party/chartjs-adapter-date-fns'
import type {FormattingOptions} from './view-trends-section'
import {DownloadAnalyticsDropdown} from './download-analytics-dropdown'
import SpaceBelow from '../../ui/layout/space-below'

const useStyles = createUseStyles({
  description: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25em',
    marginBottom: '1em',
  },
  dateSelectionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'end',
    justifyContent: 'space-between',
    gap: '5em',
    margin: '0 1em 0 0',

    [tinyViewOverride]: {
      'flexDirection': 'column',
      'height': 'fit-content',
      'alignItems': 'center',
      'gap': '1em',
      '&:last-child &:not(:only-child) ': {
        flexDirection: 'column',
        alignItems: 'flex-end',
      },
    },

  },
  row: {
    display: 'flex',
    gap: '1em',
    alignItems: 'end',
  },
})

const formatTime = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / MILLISECONDS_PER_MINUTE)
  const seconds = Math.floor((milliseconds / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE)
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const getMaxTime = (nums: number[]) => Math.max(...nums)

const getHighestMinute = (nums: number[]) => {
  const nearestMinute = Math
    .ceil(getMaxTime(nums) / MILLISECONDS_PER_MINUTE) * MILLISECONDS_PER_MINUTE
  return nearestMinute
}

const getChartStepSize = (nums: number[]) => {
  const maxNumber = getMaxTime(nums)

  if (maxNumber < MILLISECONDS_PER_MINUTE) {
    return 5 * MILLISECONDS_PER_SECOND
  } else if (maxNumber < MILLISECONDS_PER_MINUTE * 3) {
    return 10 * MILLISECONDS_PER_SECOND
  } else if (maxNumber < MILLISECONDS_PER_MINUTE * 10) {
    return 30 * MILLISECONDS_PER_SECOND
  } else {
    return 60 * MILLISECONDS_PER_SECOND
  }
}

const ViewsLineGraph: React.FC<{
  dwellTime: AppAnalyticsDataPoint[], formatting: FormattingOptions
}> = ({dwellTime, formatting}) => {
  const {t} = useTranslation(['app-pages'])
  return (
    <Line
      data={{
        datasets: [{
          data: dwellTime.map(v => ({
            x: new Date(v.dt).getTime(),
            y: v.meanPageTimeMs,
          })),
          tension: 0,
          backgroundColor: hexColorWithAlpha(blueberry, 0.3),
          borderColor: blueberry,
          borderWidth: 2,
          pointBackgroundColor: blueberry,
          pointBorderColor: darkBlueberry,
          fill: true,
        }],
      }}
      options={{
        parsing: false,
        normalized: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: ([currentPoint]): string => t(
                'project_dashboard_page.recent_trends.graph.label.datetime',
                {
                  // @ts-ignore this is the provided format
                  val: new Date(currentPoint.raw.x),
                  formatParams: formatting.tooltipFormat,
                }
              ),
              beforeBody: ([currentPoint]) => {
                // @ts-ignore This is the correct internal format.
                const pointDate = new Date(currentPoint.raw.x)
                const todayNotification =
                  floorLocalDay(new Date()).getTime() === floorLocalDay(pointDate).getTime()
                    ? `${t(
                      'project_dashboard_page.recent_trends.graph.label.today_notification'
                    )}`
                    : ''
                const dwellTimeNotGathered =
                  (pointDate.getTime() < new Date('2023-01-01T00:00:00').getTime()) &&
                  // @ts-ignore This is the correct internal format.
                  (currentPoint.raw.y === 0)
                    ? `${t(
                      'project_dashboard_page.recent_trends.graph.label.dwell_time_not_gathered'
                    )}`
                    : ''
                return `${todayNotification}${dwellTimeNotGathered}`
              },
              label: data => t(
                'project_dashboard_page.recent_trends.graph.label.minutes_tooltip',
                {averagePageTimeMs: formatTime(dwellTime[data.dataIndex].meanPageTimeMs)}
              ) as string,
            },
          },
        },
        responsive: true,
        scales: {
          x: {
            type: 'time',
            display: true,
            time: {unit: formatting.unit},
            title: {
              display: true,
              text: t('project_dashboard_page.recent_trends.graph.label.date'),
            },
            ticks: {
              callback: value => t('project_dashboard_page.recent_trends.graph.label.datetime',
                {
                  // value passed as unix epoch ms
                  val: new Date(value),
                  formatParams: formatting.formatParams,
                }),
            },
          },
          y: {
            type: 'linear',
            display: true,
            min: 0,
            max: getHighestMinute(dwellTime.map(v => v.meanPageTimeMs)),
            title: {
              display: true,
              text: t('project_dashboard_page.recent_trends.graph.label.average_time_spent'),
            },
            ticks: {
              callback: value => formatTime(value as number),
              stepSize: getChartStepSize(dwellTime.map(v => v.meanPageTimeMs)),
            },
          },
        },
      }}
    />
  )
}

const AnalyticsDwellTimeChart: React.FC<{
  data: AppAnalyticsDataPoint[]
  formatting: FormattingOptions
  dateSelection: React.ReactNode
  downloadOptions: {content: string, onClick: () => Promise<void>}[]
}> = ({data, formatting, dateSelection, downloadOptions}) => {
  const classes = useStyles()
  const {t} = useTranslation(['app-pages'])
  const sumDwellTime = data.reduce(
    (total, {totalPageMillis}) => total + totalPageMillis, 0
  )
  const totalSessions = data.reduce((total, {userSessions}) => total + userSessions, 0)
  const avgDwellTime = sumDwellTime /
    (MILLISECONDS_PER_SECOND * (totalSessions === 0 ? 1 : totalSessions))
  const overallLoggingRatio = data.reduce(
    ({accLoggingRatio, samples}, {loggingRatio, userSessions}) => {
      if (userSessions <= 0) {
        return {accLoggingRatio, samples}
      } else if (samples <= 0) {
        return {accLoggingRatio: loggingRatio, samples: userSessions}
      }
      const oldTotal = accLoggingRatio * samples
      const newTotal = loggingRatio * userSessions
      const newAccLoggingRatio = (oldTotal + newTotal) / (samples + userSessions)
      return {accLoggingRatio: newAccLoggingRatio, samples: samples + userSessions}
    },
    {accLoggingRatio: 1, samples: 0}
  )
  const loggingPercentage = 100 / overallLoggingRatio.accLoggingRatio
  return (
    <div>
      <div className={classes.description}>
        <span>
          {t(
            'project_dashboard_page.recent_trends.dwell_time_new',
            {
              sample_percentage: loggingPercentage.toFixed(2),
              average_time: avgDwellTime.toFixed(2),
            }
          )}
        </span>
        <span>{t('project_dashboard_page.recent_trends.description.time_spent')}</span>
      </div>
      <SpaceBelow>
        <div className={classes.dateSelectionRow}>
          <div className={classes.row}>
            {dateSelection}
          </div>
          <DownloadAnalyticsDropdown options={downloadOptions} />
        </div>
      </SpaceBelow>
      <ViewsLineGraph dwellTime={data} formatting={formatting} />
    </div>
  )
}

export {
  AnalyticsDwellTimeChart,
}
