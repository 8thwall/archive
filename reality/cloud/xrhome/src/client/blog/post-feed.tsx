import * as React from 'react'
import {Link} from 'react-router-dom'

import {useSelector} from '../hooks'
import {getPathForPost, formatSlug} from '../common/paths'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  list: {
    'width': '100%',
    '& p': {
      fontFamily: theme.headingFontFamily,
      color: theme.fgBlog,
    },
  },
  card: {
    textDecoration: 'none',
    padding: '1em',
    marginBottom: '.5em',
    backgroundColor: theme.bgBlog,
    fontWeight: '400',
  },
  topic: {
    fontFamily: theme.subHeadingFontFamily,
    color: `${theme.fgMuted} !important`,
  },
}))

const PostFeed = () => {
  const postList = useSelector(state => state.cms.postList)
  const posts = useSelector(state => state.cms.posts)
  const topics = useSelector(state => state.cms.topics)
  const topPostList = postList.slice(1, 3)
  const styles = useStyles()

  return (
    <div className={styles.list}>
      {
        topPostList.map((postId) => {
          const post = posts[postId]
          const [topicId] = post.topics
          const topic = topicId && topics[topicId]

          return (
            <Link
              key={`featured-post-feed#${post.id}`}
              to={getPathForPost(post)}
              a8={`click;blog;click-article-${formatSlug(post.slug)}`}
            >
              <div className={styles.card}>
                <p>{post.title}</p>
                <p className={styles.topic}>
                  {`${post.readTime} MIN READ`}
                  {topic && ` | ${topic.name.toUpperCase()}`}
                </p>
              </div>
            </Link>
          )
        })
      }
    </div>
  )
}

export {PostFeed}
