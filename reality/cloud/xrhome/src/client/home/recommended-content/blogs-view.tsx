import React from 'react'
import {Icon} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {useSelector} from '../../hooks'
import recommendedContentActions from './recommended-content-actions'
import useActions from '../../common/use-actions'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import ContentBarPlaceholder from '../content-bar-placeholder'
import {BlogPost} from '../blog-post'
import {RecommendedContentError} from '../recommended-content-error'
import {useRecommendedContentStyles} from './recommended-content-styles'
import LinkOut from '../../uiWidgets/link-out'

const NUM_OF_PLACEHOLDER_CONTENT = 6

const BlogsView: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useRecommendedContentStyles()
  const blogs = useSelector(state => state.recommended.blogs)
  const pending = useSelector(state => state.recommended.pending.getBlogs)
  const error = useSelector(state => state.recommended.error.getBlogs)
  const {getBlogs} = useActions(recommendedContentActions)

  useAbandonableEffect(async (executor) => {
    if (!blogs.length) {
      await executor(getBlogs())
    }
  }, [])

  if (error) {
    return <RecommendedContentError />
  }

  if ((!blogs.length && pending === undefined) || pending) {
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
        {blogs.map(blog => <BlogPost key={blog.id} {...blog} />)}
      </div>
      <LinkOut
        className={classes.viewAllLink}
        url='/blog'
        a8='click;warm-start;click-news-view-more'
      >
        {t('my_projects_page.recommended_content.view_all')} <Icon name='chevron right' />
      </LinkOut>
    </>
  )
}

export {
  BlogsView,
}
