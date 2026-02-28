import * as React from 'react'
import {Link} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import format from 'date-fns/format'

import {getPathForPost, formatSlug} from '../common/paths'
import {tinyViewOverride} from '../static/styles/settings'
import {FixedAspectImage} from './fixed-aspect-image'
import {useSelector} from '../hooks'
import {combine} from '../common/styles'
import {createThemedStyles} from '../ui/theme'

const useCommonStyles = createThemedStyles(theme => ({
  link: {
    textDecoration: 'none',
  },
  title: {
    fontFamily: theme.headingFontFamily,
    fontWeight: 900,
    color: theme.fgMain,
    fontSize: '1.2em',
    lineHeight: '1.2em',
    [tinyViewOverride]: {
      fontSize: '1.2em',
    },
  },
  summary: {
    fontFamily: theme.bodyFontFamily,
    color: theme.fgBlog,
    fontWeight: 500,
    fontSize: '1.2em',
    lineHeight: '1.2em',
    [tinyViewOverride]: {
      fontSize: '1.2em',
    },
  },
  meta: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.fgMuted,
  },
  circle: {
    fontSize: '.8em',
  },
}))

const useNormalStyles = createUseStyles({
  wrapper: { },
  contentSection: {
    'marginTop': '1em',
    '&>*': {
      marginBottom: '1em',
    },
  },
})

const useFeaturedStyles = createThemedStyles(theme => ({
  title: {
    fontSize: '1.6em',
  },
  summary: {
    fontSize: '1.4em',
  },
  wrapper: {
    'padding': '0.5em',
    'boxShadow': theme.blogBoxShadow,
    'background': theme.bgMuted,
  },
  contentSection: {
    'backgroundColor': theme.bgBlog,
    'padding': '1.5em',
    'border': 'none',
    '&>*': {
      marginBottom: '1em',
    },
  },
}))

const formatDate = epoch => format(new Date(epoch), 'MMM d')
const formatReadTime = readtime => `${readtime} MIN READ`

interface PostCardProps {
  id: number
  featured?: boolean
}

const HERO_IMAGE_DIMENSION = {width: 16, height: 9}

const PostCard: React.FunctionComponent<PostCardProps> = ({id, featured = false}) => {
  const {posts, topics} = useSelector(state => state.cms)
  const post = posts[id]
  const commonStyles = useCommonStyles()
  const featuredStyles = useFeaturedStyles()
  const normalStyles = useNormalStyles()
  const [topicId] = post?.topics
  const topic = topicId ? topics[topicId] : null

  return (
    <Link
      className={commonStyles.link}
      to={getPathForPost(post)}
      a8={`click;blog;click-article-${formatSlug(post.slug)}`}
    >
      <div className={featured ? featuredStyles.wrapper : normalStyles.wrapper}>
        {/* TODO (Tri): add meaningful alt text base on post */}
        {post.featuredImage && (
          <FixedAspectImage
            {...(featured ? HERO_IMAGE_DIMENSION : {})}
            src={
              featured
                ? `${post.featuredImage}?height=480`
                : `${post.featuredImage}?height=360`
            }
            alt=''
          />
        )}
        <div className={featured ? featuredStyles.contentSection : normalStyles.contentSection}>
          <p className={combine(commonStyles.title, featured && featuredStyles.title)}>
            {post.title}
          </p>
          {post.subtitle && (
            <p className={combine(commonStyles.summary, featured && featuredStyles.summary)}>
              {post.subtitle}
            </p>
          )}
          <p>
            <span className={commonStyles.meta}>
              {formatDate(post.publishDate)}
              <span className={commonStyles.circle}>{' ● '}</span>
              <span>{`${formatReadTime(post.readTime)}`}</span>
              {topic && <span>{` | ${topic.name.toUpperCase()}`}</span>}
            </span>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
