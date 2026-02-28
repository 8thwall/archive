import unauthenticatedFetch from '../../common/unauthenticated-fetch'
import {SERVE_SEARCH_URL} from '../../../shared/discovery-utils'
import {dispatchify} from '../../common'
import {RecommendedAction} from './recommended-content-types'
import {GOOGLE_MAPS_API_KEY} from '../../../shared/google-config'
import {publicApiFetch} from '../../common/public-api-fetch'
import {buildPostUrl} from '../../blog/cms-actions'

const YOUTUBE_API_URL = 'https://youtube.googleapis.com/youtube/v3/playlistItems?'
const FEATURED_TUTORIALS_PLAYLIST_ID = 'PLOGx_a6pHTm5E5NyCJmtq6Mz93TFrk5Em'
const TUTORIALS_LIMIT = '6'
const BLOG_POST_LIMIT = 6
const RECOMMENDED_APPS_LIMIT = 6
const getRecommendedApps = () => async (dispatch) => {
  dispatch({type: RecommendedAction.Pending, pending: {getRecommendedApps: true}})
  dispatch({type: RecommendedAction.Error, error: {getRecommendedApps: false}})

  try {
    const url = `${SERVE_SEARCH_URL}/projects?tag=featured&size=${RECOMMENDED_APPS_LIMIT}`
    const {apps} = await dispatch(unauthenticatedFetch(url, {method: 'GET'}))
    dispatch({type: RecommendedAction.GetRecommendedApps, apps})
  } catch (e) {
    dispatch({type: RecommendedAction.Error, error: {getRecommendedApps: true}})
  } finally {
    dispatch({type: RecommendedAction.Pending, pending: {getRecommendedApps: false}})
  }
}

const getPopularTutorials = () => async (dispatch) => {
  dispatch({type: RecommendedAction.Pending, pending: {getPopularTutorials: true}})
  dispatch({type: RecommendedAction.Error, error: {getPopularTutorials: false}})

  try {
    const searchParams = new URLSearchParams({
      part: 'snippet',
      playlistId: FEATURED_TUTORIALS_PLAYLIST_ID,
      maxResults: TUTORIALS_LIMIT,
      key: GOOGLE_MAPS_API_KEY,
    }).toString()
    const url = new URL(`${YOUTUBE_API_URL}${searchParams}`).toString()
    const {items} = await dispatch(unauthenticatedFetch(url, {method: 'GET'}))
    const tutorials = items.map(({
      snippet: {resourceId, title, thumbnails},
    }) => ({id: resourceId.videoId, title, coverImage: thumbnails.default.url}))
    dispatch({type: RecommendedAction.GetPopularTutorials, tutorials})
  } catch (e) {
    dispatch({type: RecommendedAction.Error, error: {getPopularTutorials: true}})
  } finally {
    dispatch({type: RecommendedAction.Pending, pending: {getPopularTutorials: false}})
  }
}

const getBlogs = () => async (dispatch) => {
  dispatch({type: RecommendedAction.Pending, pending: {getBlogs: true}})
  dispatch({type: RecommendedAction.Error, error: {getBlogs: false}})

  try {
    const postUrl = buildPostUrl({limit: BLOG_POST_LIMIT})
    const {postById} = await dispatch(publicApiFetch(postUrl))
    const blogsArray = Object.values(postById)
    const blogs = blogsArray.map(({id, title, slug, featuredImage}) => (
      {id, title, slug, featuredImage}
    ))
    dispatch({type: RecommendedAction.GetBlogs, blogs})
  } catch (error) {
    dispatch({type: RecommendedAction.Error, error: {getBlogs: true}})
  } finally {
    dispatch({type: RecommendedAction.Pending, pending: {getBlogs: false}})
  }
}

const rawActions = {
  getRecommendedApps,
  getPopularTutorials,
  getBlogs,
}

const actions = dispatchify(rawActions)

export {
  actions as default,
  rawActions,
}
