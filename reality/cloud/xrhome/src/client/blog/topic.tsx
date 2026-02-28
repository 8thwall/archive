import React from 'react'
import {Link} from 'react-router-dom'

import {getPathForTopic} from '../common/paths'
import {useSelector} from '../hooks'
import {Icon} from '../ui/components/icon'
import {createThemedStyles} from '../ui/theme'

const hovered = '&:hover'
const useStyles = createThemedStyles(theme => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    backgroundColor: theme.modalContentBg,
    color: theme.fgMain,
    padding: '.8em 1em',
    borderRadius: '5px',
    [hovered]: {
      backgroundColor: theme.listItemHoverBg,
    },
  },
  name: {
    fontFamily: theme.headingFontFamily,
    fontWeight: '700',
    flexGrow: '1',
  },
}))
const TopicComponent = ({id}) => {
  const topics = useSelector(state => state.cms.topics)
  const topic = topics[id]
  const styles = useStyles()

  return (
    <Link
      className={styles.wrapper}
      a8={`click;blog;click-category-button-${topic.slug}`}
      to={getPathForTopic(topic)}
    >
      <div className={styles.name}>
        {topic.name}
      </div>
      <Icon stroke='chevronRight' color='gray4' />
    </Link>
  )
}

export default TopicComponent
