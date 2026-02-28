import React, {useState} from 'react'

import {useTranslation} from 'react-i18next'

import {AppsView} from './recommended-content/apps-view'
import {TutorialsView} from './recommended-content/tutorials-view'
import {BlogsView} from './recommended-content/blogs-view'
import {brandHighlight, mobileViewOverride} from '../static/styles/settings'
import {ReportView} from './recommended-content/reports-view'
import {isEnterprise, isPro} from '../../shared/account-utils'
import {useSelector} from '../hooks'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '4rem',
    marginBottom: '4rem',
  },
  tab: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    marginRight: '3.125rem',
    padding: '0',
  },
  headerContainer: {
    display: 'flex',
    textAlign: 'center',
    overflow: 'auto',
    [mobileViewOverride]: {
      paddingBottom: '1rem',
      whiteSpace: 'nowrap',
    },
  },
  boldHeader: {
    display: 'flex',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'center',
    color: theme.fgMain,
    borderBottom: `2px solid ${brandHighlight}`,
  },
  regularHeader: {
    display: 'flex',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'center',
    color: theme.fgMuted,
  },
}))

const TAB_NAMES = [
  'apps',
  'tutorials',
  'blogs',
]

const RecommendedContent = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const [activeTabView, setActiveTabView] = useState(TAB_NAMES[0])
  const showReport = useSelector(
    s => s.accounts.allAccounts?.some(a => isPro(a) || isEnterprise(a))
  )

  const setTabViewClickHandler = (tab) => {
    setActiveTabView(tab)
  }

  React.useEffect(() => {
    if (window.location.hash === '#business-resources' && showReport) {
      setActiveTabView('reports')
    }
  }, [window.location.hash])

  const indexer = (element, index) => (element === activeTabView ? index : -1)

  const viewMap = {
    apps: {
      view: <AppsView />,
      tabTitle: t('my_projects_page.recommended_content.tab_title.sample_projects'),
    },
    tutorials: {
      view: <TutorialsView />,
      tabTitle: t('my_projects_page.recommended_content.tab_title.tutorials'),
    },
    blogs: {
      view: <BlogsView />,
      tabTitle: t('my_projects_page.recommended_content.tab_title.news'),
    },
  }

  return (
    <div className={classes.tabContent}>
      <div
        role='tablist'
        className={classes.headerContainer}
      >
        {TAB_NAMES.map((tab, index) => (
          <button
            id={`label-${tab}`}
            type='button'
            role='tab'
            tabIndex={TAB_NAMES.findIndex(indexer) === index ? 0 : -1}
            aria-controls={`panel-${tab}`}
            aria-selected={TAB_NAMES.findIndex(indexer) === index}
            key={`label-${tab}`}
            className={classes.tab}
            onClick={() => { setTabViewClickHandler(tab) }}
            onKeyDown={() => setTabViewClickHandler(tab)}
            a8={`click;warm-start;${tab}`}
          >
            <div className={tab === activeTabView ? classes.boldHeader : classes.regularHeader}>
              {viewMap[TAB_NAMES[index]].tabTitle}
            </div>
          </button>
        ))}
        {showReport && (
          <button
            type='button'
            role='tab'
            tabIndex={TAB_NAMES.length}
            aria-selected={activeTabView === 'reports'}
            className={classes.tab}
            onClick={() => setTabViewClickHandler('reports')}
            onKeyDown={() => setTabViewClickHandler('reports')}
            a8='click;warm-start;reports'
          >
            <div
              className={activeTabView === 'reports' ? classes.boldHeader : classes.regularHeader}
            >
              {t('my_projects_page.recommended_content.tab_title.reports')}
            </div>
          </button>
        )}
      </div>
      {TAB_NAMES.map((tab, idx) => (
        <div
          key={`panel-${tab}`}
          id={`panel-${tab}`}
          aria-labelledby={`label-${tab}`}
          role='tabpanel'
          tabIndex={idx}
          hidden={tab !== activeTabView}
        >
          {viewMap[tab].view}
        </div>
      ))}
      <div
        id='panel-reports'
        key='panel-reports'
        aria-labelledby='label-reports'
        role='tabpanel'
        tabIndex={TAB_NAMES.length}
        hidden={activeTabView !== 'reports'}
      >
        <ReportView />
      </div>
    </div>
  )
}

export {
  RecommendedContent,
}
