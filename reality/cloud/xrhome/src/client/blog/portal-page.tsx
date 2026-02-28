import * as React from 'react'
import {useParams} from 'react-router-dom'
import {Container} from 'semantic-ui-react'

import {Loader} from '../ui/components/loader'
import {useSelector} from '../hooks'
import Page from '../widgets/page'
import Title from '../widgets/title'
import {BlogTitle} from './blog-title'
import actions from './cms-actions'
import {GET_POSTS_ACTION_TYPE} from './cms-constants'
import {useIsActionLoading} from './cms-selectors'
import PostCard from './post-card'
import CtaCard from './cta-card'
import TopicListComponent from './topic-list'
import TopicExploreComponent from './topic-explore'
import {
  brandBlack,
  brandWhite,
  gray1,
  headerSanSerif,
  tinyViewOverride,
  mobileViewOverride,
} from '../static/styles/settings'
import {PostFeed} from './post-feed'
import BlogViewMore from './blog-view-more'
import useActions from '../common/use-actions'
import {DEFAULT_POSTS_PER_PAGE} from '../../shared/cms-constants'
import {createCustomUseStyles} from '../common/create-custom-use-styles'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  portalPage: {
    backgroundColor: theme.bgMain,
    fontSize: '16px',
    [tinyViewOverride]: {
      '& h1, h2': {
        fontSize: '1.25em',
      },
    },
  },
  gridTemplate: {
    gridTemplateColumns: 'repeat(3, 1fr)',
    display: 'grid',
    gridGap: '1em',
    [mobileViewOverride]: {
      gridGap: '1em 0',
      padding: '0',
      gridTemplateColumns: '1fr',
    },
  },
  featuredDiv: {
    gridColumn: 'span 2',
  },
  listDiv: {
    gridColumn: 'span 1',
  },
  editorPickHeader: {
    background: theme.blogHighlightBg,
    fontFamily: theme.headingFontFamily,
    width: '70%',
    fontWeight: '500',
    fontSize: '1em !important',
    margin: '1em 0',
    color: brandWhite,
    padding: '.5em 0 .5em 1em',
  },
  popularTopicHeader: {
    backgroundColor: theme.blogSubtleBg,
    fontFamily: theme.headingFontFamily,
    width: '70%',
    fontWeight: '500',
    fontSize: '1em !important',
    margin: '1em 0',
    color: brandWhite,
    padding: '.5em 0 .5em 1em',
  },
  latestHeader: {
    'fontFamily': theme.headingFontFamily,
    'color': theme.fgMain,
    'fontWeight': '900',
    'padding': '0',
    'width': '100%',
    'display': 'flex',
    'alignItems': 'center',
    'textAlign': 'left',
    '&:after': {
      content: '""',
      flex: 1,
      marginLeft: '1em',
      borderBottom: `2px solid ${gray1}`,
    },
  },
}))

const BLEEDER_IMAGE_STYLE = {
  height: '41vw',
  width: '100vw',
  maxWidth: '100vw !important',
  position: 'relative',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  marginBottom: '2em',
}

const useBleederStyles = createCustomUseStyles<{isLoading: boolean, featuredImage: string}>()({
  background: {
    backgroundImage: ({isLoading, featuredImage}) => (
      isLoading
        ? 'none'
        : `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(${featuredImage})`
    ),
    backgroundRepeat: 'no-repeat !important',
    backgroundPosition: 'center !important',
    backgroundSize: 'cover !important',
    backgroundColor: ({isLoading}) => (
      isLoading ? gray1 : brandBlack
    ),
    // bleeder
    ...BLEEDER_IMAGE_STYLE,
  },
  foreground: {
    // Limit Width
    width: 'calc(100% - 8rem)',
    maxWidth: '70rem',
    display: 'block',
    // Centering div
    position: 'absolute',
    top: '50%',
    left: '0',
    right: '0',
    margin: 'auto',
    // Styling Text
    color: brandWhite,
    fontWeight: '800',
    lineHeight: '1.2',
    fontFamily: headerSanSerif,
    fontSize: '4em',
    letterSpacing: '1.5px',
    [mobileViewOverride]: {
      fontSize: '2em',
    },
  },
})

const TopicBleeder = ({topicId}) => {
  const {topics, posts, postList} = useSelector(state => state.cms)
  const topic = topics[topicId]
  const [postId] = postList
  const {featuredImage} = posts[postId] || {}
  const isLoading = useIsActionLoading(GET_POSTS_ACTION_TYPE)
  const bleederStyles = useBleederStyles({isLoading, featuredImage})

  if (isLoading) {
    return (
      <div className={bleederStyles.background}>
        <h2 className={bleederStyles.foreground}>
          <Loader />
        </h2>
      </div>
    )
  }

  return topic && (
    <div className={bleederStyles.background}>
      <h1 className={bleederStyles.foreground}>
        {topic.name}
      </h1>
    </div>
  )
}

const MainPageHeader = ({featuredId}) => {
  const styles = useStyles()
  const isLoading = useIsActionLoading(GET_POSTS_ACTION_TYPE)

  if (isLoading) {
    return (
      <Container
        className='topContainer'
        fluid
      >
        <Loader inline centered />
      </Container>
    )
  }

  return (
    <Container
      className='topContainer'
      fluid
    >
      <div className={styles.gridTemplate}>
        <div className={styles.featuredDiv}>
          { featuredId && <PostCard id={featuredId} featured /> }
        </div>
        <div className={styles.listDiv}>
          <h4 className={styles.editorPickHeader}>Editor’s Picks</h4>
          <PostFeed />
          <h4 className={styles.popularTopicHeader}>Popular Topics</h4>
          <TopicListComponent />
        </div>
      </div>
    </Container>
  )
}

const PortalPage = () => {
  const {getTopics, getPosts} = useActions(actions)
  const postList = useSelector(state => state.cms.postList)
  const topics = useSelector(state => state.cms.topics)
  const postPagination = useSelector(state => state.cms.postPagination)
  const currentTopic = useSelector(state => state.cms.currentTopic)
  const {offset, total} = postPagination
  const {topicId} = useParams<{topicId: string}>()
  const styles = useStyles()

  React.useEffect(() => {
    // TODO (Tri): build out a loading component while fetching topics
    if (Object.keys(topics).length === 0) {
      getTopics()
    }
    // TODO (Tri): build out a loading component while fetching posts
    if (currentTopic !== topicId) {
      getPosts({topic: topicId, ...(topicId ? {limit: DEFAULT_POSTS_PER_PAGE - 1} : {})})
    }
  }, [topicId])

  const [featuredId, ...rest] = postList
  const displayList = topicId ? postList : rest
  const topic = topics[topicId]
  const isLoading = useIsActionLoading(GET_POSTS_ACTION_TYPE)

  const displayPosts = displayList.map((id: number) => (
    <PostCard key={`post#${id}`} id={id} />
  ))

  displayPosts.splice(2, 0, (
    <CtaCard key='cta-post-card' />
  ))
  return (
    <Page className={styles.portalPage}>
      <Title addCommon={false}>{topic ? `${topic.name} | 8th Wall Blog` : '8th Wall Blog'}</Title>
      <BlogTitle />
      {topic ? <TopicBleeder topicId={topicId} /> : <MainPageHeader featuredId={featuredId} />}
      <Container
        className='topContainer'
        fluid
      >
        <h4 className={styles.latestHeader}>The Latest</h4>
      </Container>
      <Container
        className='topContainer'
        fluid
      >
        <div className={styles.gridTemplate}>
          { !isLoading && displayPosts }
        </div>
      </Container>
      {total > offset && (
        <Container
          className='topContainer'
          fluid
        >
          <BlogViewMore />
        </Container>
      )}
      {
        topic && <TopicExploreComponent />
      }
    </Page>
  )
}

export default PortalPage
