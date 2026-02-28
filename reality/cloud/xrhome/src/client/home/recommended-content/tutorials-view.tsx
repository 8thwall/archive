import React from 'react'
import {Icon} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {useSelector} from '../../hooks'
import recommendedContentActions from './recommended-content-actions'
import useActions from '../../common/use-actions'
import {LearningSession} from '../learning-session'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import ContentBarPlaceholder from '../content-bar-placeholder'
import {RecommendedContentError} from '../recommended-content-error'
import {useRecommendedContentStyles} from './recommended-content-styles'
import LinkOut from '../../uiWidgets/link-out'

const NUM_OF_PLACEHOLDER_CONTENT = 6

const TutorialsView: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useRecommendedContentStyles()
  const tutorials = useSelector(state => state.recommended.popularTutorials)
  const pending = useSelector(state => state.recommended.pending.getPopularTutorials)
  const error = useSelector(state => state.recommended.error.getPopularTutorials)
  const {getPopularTutorials} = useActions(recommendedContentActions)

  useAbandonableEffect(async (executor) => {
    if (!tutorials.length) {
      await executor(getPopularTutorials())
    }
  }, [])

  if (error) {
    return <RecommendedContentError />
  }

  if ((!tutorials.length && pending === undefined) || pending) {
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
        {tutorials.map(tutorial => <LearningSession key={tutorial.id} {...tutorial} />)}
      </div>
      <LinkOut
        className={classes.viewAllLink}
        url='/tutorials'
        a8='click;warm-start;click-tutorials-view-more'
      >
        {t('my_projects_page.recommended_content.view_all')} <Icon name='chevron right' />
      </LinkOut>
    </>
  )
}

export {
  TutorialsView,
}
