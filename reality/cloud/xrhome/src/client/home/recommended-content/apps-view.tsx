import React from 'react'
import {Icon} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {useSelector} from '../../hooks'
import recommendedContentActions from './recommended-content-actions'
import useActions from '../../common/use-actions'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import ContentBarPlaceholder from '../content-bar-placeholder'
import {ProjectBar} from '../project-bar'
import {RecommendedContentError} from '../recommended-content-error'
import LinkOut from '../../uiWidgets/link-out'
import {useRecommendedContentStyles} from './recommended-content-styles'

const NUM_OF_PLACEHOLDER_CONTENT = 6

const AppsView: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useRecommendedContentStyles()
  const apps = useSelector(state => state.recommended.recommendedApps)
  const pending = useSelector(state => state.recommended.pending.getRecommendedApps)
  const error = useSelector(state => state.recommended.error.getRecommendedApps)
  const {getRecommendedApps} = useActions(recommendedContentActions)

  useAbandonableEffect(async (executor) => {
    if (!apps.length) {
      await executor(getRecommendedApps())
    }
  }, [])

  if (error) {
    return <RecommendedContentError />
  }

  if ((!apps.length && pending === undefined) || pending) {
    return (
      <div className={classes.contentContainer}>
        {
          Array.from({length: NUM_OF_PLACEHOLDER_CONTENT})
          // eslint-disable-next-line react/no-array-index-key
            .map((_, index) => <ContentBarPlaceholder key={index} />)
        }
      </div>
    )
  }

  return (
    <>
      <div className={classes.contentContainer}>
        {apps.map(app => <ProjectBar key={app.uuid} app={app} />)}
      </div>
      <LinkOut
        className={classes.viewAllLink}
        url='/projects'
        a8='click;warm-start;click-sample-projects-view-more'
      >
        {t('my_projects_page.recommended_content.view_all')} <Icon name='chevron right' />
      </LinkOut>
    </>
  )
}

export {
  AppsView,
}
