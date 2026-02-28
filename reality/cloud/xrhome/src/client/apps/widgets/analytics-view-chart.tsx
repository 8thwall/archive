import React from 'react'
import {Menu} from 'semantic-ui-react'
import 'chart.js/auto'
import {Line} from 'react-chartjs-2'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import type {
  AppAnalyticsDataPoint,
} from '../../../shared/integration/app-analytics/app-analytics-api'
import '../../../third_party/chartjs-adapter-date-fns'
import {hexColorWithAlpha} from '../../../shared/colors'
import type {FormattingOptions} from './view-trends-section'
import {floorLocalDay} from '../../../shared/time-utils'
import SpaceBelow from '../../ui/layout/space-below'
import {DownloadAnalyticsDropdown} from './download-analytics-dropdown'
import {combine} from '../../common/styles'
import {tinyViewOverride} from '../../static/styles/settings'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    gap: '1em',
    height: '3.8em',
    alignItems: 'end',

    [tinyViewOverride]: {
      'flexDirection': 'column',
      'height': 'fit-content',
      'alignItems': 'center',
      '&:last-child &:not(:only-child) ': {
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
    },
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  marginRight: {
    marginRight: '1em',
  },
  menu: {
    'alignSelf': 'start',
    'verticalAlign': 'middle !important',

    '&.ui.menu:first-child': {
      marginTop: '1rem',
    },
  },
})

type LineGraphInternalPoint = {
  x: number
  y: number
}

type ViewsLineGraphProps = {
  data: LineGraphInternalPoint[]
  isPointView: boolean
  formatting: FormattingOptions
}

const ViewsLineGraph: React.FC<ViewsLineGraphProps> = ({data, formatting, isPointView}) => {
  const {t} = useTranslation(['app-pages'])
  return (
    <Line
      data={{
        datasets: [{
          data: isPointView
            ? data
            : data.reduce(
              (o, {x, y}) => o.concat({
                x,
                y: (o.length ? o[o.length - 1].y : 0) + Number(y),
              }), []
            ),
          backgroundColor: hexColorWithAlpha('#aaaaaa', 0.3),
          fill: true,
        }],
      }}
      options={{
        responsive: true,
        parsing: false,
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
                return todayNotification
              },
            },
          },
        },
        normalized: true,
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
                  // Value is passed as Unix Epoch ms.
                  val: new Date(value),
                  formatParams: formatting.formatParams,
                }),
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            title: {
              display: true,
              text: isPointView
                ? t('project_dashboard_page.recent_trends.graph.label.daily_views')
                : t('project_dashboard_page.recent_trends.graph.label.total_views'),
            },
            ticks: {
              // Only integer ticks allowed.
              callback: (value: number) => (value % 1 === 0 ? value : ''),
            },
          },
        },
      }}
    />
  )
}

const AnalyticsViewChart: React.FC<{
  data: AppAnalyticsDataPoint[]
  setShowDailyView: (isPointView: boolean) => void
  showDailyView: boolean
  formatting: FormattingOptions
  dateSelection: React.ReactNode
  downloadOptions: {content: string, onClick: () => Promise<void>}[]

}> = ({
  data, formatting, setShowDailyView, showDailyView, dateSelection, downloadOptions,
}) => {
  const {t, i18n} = useTranslation(['app-pages'])
  const classes = useStyles()
  const totalViews = data.reduce((o, {views}) => o + Number(views), 0)
  const parsedData = data.map(({dt, views}) => ({x: new Date(dt).getTime(), y: views}))
  return (
    <div className={classes.container}>
      <p>
        {t(
          'project_dashboard_page.recent_trends.total_views_new',
          {total_views: totalViews.toLocaleString(i18n.language)}
        )}
      </p>
      <SpaceBelow>
        <div className={combine(classes.row, classes.justifyBetween, classes.marginRight)}>
          <div className={classes.row}>
            {dateSelection}
          </div>
          <div className={classes.row}>
            <Menu className={classes.menu} size='tiny'>
              <Menu.Item
                name={t('project_dashboard_page.recent_trends.menu_item.total')}
                active={!showDailyView}
                onClick={() => setShowDailyView(false)}
              />
              <Menu.Item
                name={t('project_dashboard_page.recent_trends.menu_item.daily')}
                active={showDailyView}
                onClick={() => setShowDailyView(true)}
              />
            </Menu>
            <DownloadAnalyticsDropdown options={downloadOptions} />
          </div>
        </div>
      </SpaceBelow>
      <ViewsLineGraph
        data={parsedData}
        isPointView={showDailyView}
        formatting={formatting}
      />
    </div>
  )
}

export {
  AnalyticsViewChart,
}
