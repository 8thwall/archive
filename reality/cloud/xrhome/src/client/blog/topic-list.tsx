import React from 'react'

import {mobileViewOverride} from '../static/styles/settings'
import TopicComponent from './topic'
import {useSelector} from '../hooks'
import {createThemedStyles} from '../ui/theme'

const MAX_LIST_TOPICS = 5
const useStyles = createThemedStyles(theme => ({
  header: {
    fontFamily: theme.headingFontFamily,
    color: theme.fgMain,
    fontWeight: '900',
    margin: '0',
    textAlign: 'center',
  },
  wrapper: {
    position: 'relative',
    display: 'grid',
    gridGap: '0.5em 6em',
    gridTemplateColumns: '1fr',
    [mobileViewOverride]: {
      gridTemplateColumns: '1fr',
    },
  },
  item: {
    placeSelf: 'center stretch',
  },
}))

const TopicListComponent = () => {
  const topicList = useSelector(state => state.cms.popularTopicList)
    ?.slice(0, MAX_LIST_TOPICS) || []
  const styles = useStyles()

  return (
    <div className={styles.wrapper}>
      {
       topicList.map((topicId: number) => (
         <TopicComponent key={`topic#${topicId}`} id={topicId} />
       ))
      }
    </div>
  )
}

export default TopicListComponent
