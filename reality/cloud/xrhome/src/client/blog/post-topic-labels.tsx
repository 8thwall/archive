import React from 'react'
import {Link} from 'react-router-dom'

import {useSelector} from '../hooks'
import {getPathForTopic} from '../common/paths'
import {tinyViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  topic: {
    'fontSize': '14px',
    'lineHeight': '1.429',
    'cursor': 'pointer',
    'textDecoration': 'none',
    'padding': '6px 8px',
    'backgroundColor': theme.tagBg,
    'color': theme.tagFgDefault,
    'fontFamily': theme.bodyFontFamily,
    'borderRadius': theme.tagBorderRadius,
    'border': theme.tagBorder,
    '&:hover': {
      color: theme.tagFgHover,
      backgroundColor: theme.tagHoverBg,
    },
  },
  topics: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px',
    [tinyViewOverride]: {
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      marginBottom: '30px',
    },
  },
}))

const TopicLabel = ({topicId}) => {
  const {topics} = useSelector(state => state.cms)
  const topic = topics[topicId]
  const styles = useStyles()

  return topic
    ? (
      <Link
        className={styles.topic}
        a8={`click;blog;click-post-category-button-${topic.slug}`}
        to={getPathForTopic(topic)}
      >
        {topic.name}
      </Link>
    )
    : (
      <span className={styles.topic}>
        ...
      </span>
    )
}

const PostTopicLabels = ({postId}) => {
  const {posts} = useSelector(state => state.cms)
  const post = posts[postId]
  const classes = useStyles()

  return post && (
    <div className={classes.topics}>
      {
        post.topics.map(topicId => (
          <TopicLabel key={`post.topics#${topicId}`} topicId={topicId} />
        ))
      }
    </div>
  )
}

export default PostTopicLabels
