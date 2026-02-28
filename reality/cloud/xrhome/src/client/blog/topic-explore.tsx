import React from 'react'

import {mobileViewOverride} from '../static/styles/settings'
import TopicComponent from './topic'
import {useSelector} from '../hooks'
import {createThemedStyles} from '../ui/theme'

const MAX_EXPLORE_TOPICS = 12
const useStyles = createThemedStyles(theme => ({
  header: {
    fontFamily: theme.headingFontFamily,
    color: theme.fgMain,
    fontWeight: '900',
    paddingTop: '1em',
    paddingBottom: '1em',
    margin: '0',
    textAlign: 'center',
  },
  wrapper: {
    position: 'relative',
    display: 'grid',
    gridGap: '0.5em 6em',
    padding: '0 5em',
    gridTemplateColumns: 'repeat(2,  1fr)',
    marginBottom: '2em',
    [mobileViewOverride]: {
      gridGap: '0.5em 0',
      padding: '0',
      gridTemplateColumns: '1fr',
    },
  },
  item: {
    placeSelf: 'center stretch',
  },
}))

const TopicExploreComponent = () => {
  const topicList = useSelector(state => state.cms.exploreTopicList)
    ?.slice(0, MAX_EXPLORE_TOPICS) || []
  const styles = useStyles()

  return (
    <div>
      <h3 className={styles.header}>
        Explore More Topics
      </h3>
      <div className={styles.wrapper}>
        {
          topicList.map((topicId: number) => (
            <div key={`topic#${topicId}`} className={styles.item}>
              <TopicComponent id={topicId} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default TopicExploreComponent
