import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import format from 'date-fns/format'
import {Grid, Container} from 'semantic-ui-react'

import {Loader} from '../ui/components/loader'
import {useSelector} from '../hooks'
import Page from '../widgets/page'
import actions from './cms-actions'
import RawPostContentComponent from './raw-post-content'
import PostAuthor from './post-author'
import {getPathForPost} from '../common/paths'
import {TwitterLoadEmbedScript} from './twitter-load-embed-script'
import WebIframeLoader from './web-iframe-loader'
import TopicExploreComponent from './topic-explore'
import SocialSharing from './social-sharing'
import PostTopicLabels from './post-topic-labels'
import {BlogTitle} from './blog-title'
import {tinyViewOverride} from '../static/styles/settings'
import useActions from '../common/use-actions'
import {GET_POST_ACTION_TYPE} from './cms-constants'
import {useIsActionLoading} from './cms-selectors'
import NotFoundPage from '../home/not-found-page'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  postPage: {
    backgroundColor: theme.bgMain,
    fontSize: '16px',
    [tinyViewOverride]: {
      '& .section.centered': {
        width: 'calc(100% - 48px) !important',
      },
    },
  },
  title: {
    fontFamily: theme.headingFontFamily,
    color: theme.fgMain,
    fontWeight: '900',
    fontSize: '32px',
    lineHeight: '46px',
    [tinyViewOverride]: {
      fontSize: '20px',
      lineHeight: '30px',
    },
  },
  subtitle: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.fgMuted,
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '30px',
    [tinyViewOverride]: {
      fontSize: '18px',
      lineHeight: '27px',
    },
  },
  authorWrapper: {
    display: 'grid',
    gridTemplateColumns: '40px auto',
    alignItems: 'end',
    gap: '0',
  },
  authorAvatar: {
    height: '32px',
    width: '32px',
  },
  authorName: {
    fontFamily: theme.headingFontFamily,
    color: theme.fgMain,
  },
  authorSubHeader: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.fgMuted,
    [tinyViewOverride]: {
      fontSize: '14px',
    },
  },
  featuredImage: {
    width: '100%',
  },
  OldfeaturedImage: {
    width: '100vw',
    maxWidth: '100vw !important',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
  },
}))

const formatDate = epoch => format(
  new Date(epoch),
  'MMM d, y'
)

// TODO (Tri): move this into its own file
const AuthorDisplay = ({authorId, publishDate, readTime, topic}) => {
  const authors = useSelector(state => state.cms.authors)
  const styles = useStyles()
  const author = authors[authorId]

  return author
    ? (
      <div className={styles.authorWrapper}>
        <img
          className={styles.authorAvatar}
          src={author.avatar || author.gravatar_url}
          alt={author.slug}
          width='60'
          height='60'
        />
        <div className={styles.authorSubHeader}>
          {formatDate(publishDate)}
          {readTime && <span>{` . ${readTime} min read`}</span>}
          {topic && <span>{` . ${topic.name}`}</span>}
        </div>
      </div>
  // TODO: add loading component here
    )
    : null
}

// TODO (Tri): move this into its own file
const PostDisplaySection = ({
  id, title, body, author, subtitle, featuredImage,
  publishDate, readTime, topics, url,
}) => {
  const styles = useStyles()
  const stateTopics = useSelector(state => state.cms.topics)
  const [topicId] = topics
  const topic = topicId ? stateTopics[topicId] : null

  return (
    <Container
      className='topContainer'
      fluid
    >
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles.subtitle}>{subtitle}</h3>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column
            verticalAlign='middle'
            computer={12}
            tablet={12}
            mobile={11}
            textAlign='left'
          >
            <AuthorDisplay
              authorId={author}
              publishDate={publishDate}
              readTime={readTime}
              topic={topic}
            />
          </Grid.Column>
          <SocialSharing
            mobile={5}
            tablet={4}
            computer={4}
            url={url}
            title={title}
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <img
              className={styles.featuredImage}
              src={featuredImage}
              alt={title}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column verticalAlign='middle' textAlign='left'>
            <RawPostContentComponent html={body} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={8} computer={10} verticalAlign='middle' textAlign='left'>
            <PostTopicLabels postId={id} />
          </Grid.Column>
          <SocialSharing
            mobile={16}
            tablet={8}
            computer={6}
            url={url}
            title={title}
          />
        </Grid.Row>
      </Grid>
    </Container>
  )
}

const PostPage = () => {
  const {getTopics, getPost, searchTopics} = useActions(actions)
  const posts = useSelector(state => state.cms.posts)
  const topics = useSelector(state => state.cms.topics)
  const {postId, postSlug} = useParams<{postId: string, postSlug: string}>()
  const history = useHistory()
  const isLoading = useIsActionLoading(GET_POST_ACTION_TYPE)

  React.useEffect(() => {
    if (!posts[postId]?.body) {
      getPost(postId)
    }
  }, [postId])

  React.useEffect(() => {
    if (!topics) {
      getTopics()
    }
  }, [topics])

  const post = posts[postId]
  React.useEffect(() => {
    if (post && post.slug.replace('/', '') !== postSlug) {
      history.push(getPathForPost(post))
    }
  }, [postSlug, post])

  const postTopics = post?.topics || []
  const notLoadedTopics = postTopics.filter(t => !(t in topics))

  React.useEffect(() => {
    if (notLoadedTopics.length > 0) {
      searchTopics({ids: notLoadedTopics})
    }
  }, [notLoadedTopics.length])

  const classes = useStyles()
  if (!post) {
    if (!isLoading) {
      return <NotFoundPage />
    } else {
      return <Loader />
    }
  }

  const postPath = typeof window !== 'undefined' &&
                   `${window.location.origin}${getPathForPost(post)}`
  return (
    <Page
      title={post.title}
      description={post.subtitle}
      image={post.featuredImage}
      type='Article'
      url={getPathForPost(post)}
      className={classes.postPage}
    >
      <BlogTitle />
      <PostDisplaySection url={postPath} {...post} />
      <TwitterLoadEmbedScript />
      <WebIframeLoader />
      <PostAuthor authorId={post.author} />
      <TopicExploreComponent />
    </Page>
  )
}

export default PostPage
