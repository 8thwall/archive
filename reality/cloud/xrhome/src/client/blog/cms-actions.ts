import {dispatchify} from '../common/index'
import {publicApiFetch} from '../common/public-api-fetch'
import unauthenticatedFetch from '../common/unauthenticated-fetch'

import {
  GET_TOPICS_ACTION_TYPE,
  SEARCH_TOPICS_ACTION_TYPE,
  GET_POST_ACTION_TYPE,
  GET_POSTS_ACTION_TYPE,
  GET_MORE_POSTS_ACTION_TYPE,
  GET_START_ACTION_TYPE,
  GET_STOP_ACTION_TYPE,
  GET_HUBSPOT_CMS_PAGE_TYPE,
  ACTION_FAILED,
  CLEAR_FAIL_ACTION,
} from './cms-constants'

interface IGetPostParams {
  topic?: number | string
  offset?: number
  created?: number
  limit?: number
}

interface IGetTopicParams {
  ids: Array<number>
}

const buildUrl = (path: string, params: object) => {
  if (!params) {
    return path
  }
  const search = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    if (!params[key]) {
      return
    }
    search.append(key, params[key])
  })
  if (search.size === 0) {
    return path
  }
  return `${path}?${search.toString()}`
}

const buildPostUrl = (params: IGetPostParams): string => buildUrl('/blog-api/posts', params)
const buildTopicUrl = (params: IGetTopicParams): string => buildUrl('/blog-api/topics', params)

const clearFail = actionType => async (dispatch) => {
  dispatch({type: CLEAR_FAIL_ACTION, payload: actionType})
}

const onFailed = (actionType, msg = 'ERROR') => async (dispatch) => {
  dispatch({type: ACTION_FAILED, payload: actionType})
  dispatch({type: 'ERROR', msg})
}

// TODO (Tri): write a wrapper for all these start/stop actions
const searchTopics = (params: IGetTopicParams) => async (dispatch) => {
  dispatch({
    type: GET_START_ACTION_TYPE,
    payload: {type: SEARCH_TOPICS_ACTION_TYPE, params},
  })
  try {
    const {topics} = await dispatch(publicApiFetch(buildTopicUrl(params)))
    dispatch({type: SEARCH_TOPICS_ACTION_TYPE, topics})
  } catch (error) {
    dispatch({type: 'ERROR', msg: error.message})
  } finally {
    dispatch({
      type: GET_STOP_ACTION_TYPE,
      payload: {type: SEARCH_TOPICS_ACTION_TYPE, params},
    })
  }
}

const getTopics = () => async (dispatch) => {
  dispatch({
    type: GET_START_ACTION_TYPE,
    payload: {type: GET_TOPICS_ACTION_TYPE},
  })
  try {
    const {
      topics, exploreList, popularList,
    } = await dispatch(publicApiFetch('/blog-api/topics'))
    dispatch({type: GET_TOPICS_ACTION_TYPE, topics, exploreList, popularList})
  } catch (error) {
    dispatch({type: 'ERROR', msg: error.message})
  } finally {
    dispatch({
      type: GET_STOP_ACTION_TYPE,
      payload: {type: GET_TOPICS_ACTION_TYPE},
    })
  }
}

const getPosts = (params: IGetPostParams) => async (dispatch) => {
  dispatch({
    type: GET_START_ACTION_TYPE,
    payload: {type: GET_POSTS_ACTION_TYPE, params},
  })
  try {
    const postUrl = buildPostUrl(params)
    const {
      postById, authorById, postIds, total,
    } = await dispatch(publicApiFetch(postUrl))
    dispatch({
      type: GET_POSTS_ACTION_TYPE,
      posts: postById,
      authors: authorById,
      topic: params.topic,
      list: postIds,
      total,
    })
  } catch (error) {
    dispatch({type: 'ERROR', msg: error.message})
  } finally {
    dispatch({
      type: GET_STOP_ACTION_TYPE,
      payload: {type: GET_POSTS_ACTION_TYPE, params},
    })
  }
}

const getMorePosts = (params: IGetPostParams) => async (dispatch) => {
  dispatch({
    type: GET_START_ACTION_TYPE,
    payload: {type: GET_MORE_POSTS_ACTION_TYPE, params},
  })
  try {
    const postUrl = buildPostUrl(params)
    const {
      postById, authorById, postIds, total,
    } = await dispatch(publicApiFetch(postUrl))
    dispatch({
      type: GET_MORE_POSTS_ACTION_TYPE,
      posts: postById,
      authors: authorById,
      total,
      list: postIds,
    })
    dispatch(clearFail(GET_MORE_POSTS_ACTION_TYPE))
  } catch (error) {
    dispatch(onFailed(GET_MORE_POSTS_ACTION_TYPE, error.message))
  } finally {
    dispatch({
      type: GET_STOP_ACTION_TYPE,
      payload: {type: GET_MORE_POSTS_ACTION_TYPE, params},
    })
  }
}

const getPost = (postId: number | string) => async (dispatch) => {
  dispatch({
    type: GET_START_ACTION_TYPE,
    payload: {type: GET_POST_ACTION_TYPE},
  })
  try {
    const {post, author} = await dispatch(publicApiFetch(`/blog-api/post/${postId}`))
    dispatch({type: GET_POST_ACTION_TYPE, post, author})
  } catch (error) {
    dispatch({type: 'ERROR', msg: error.message})
  } finally {
    dispatch({
      type: GET_STOP_ACTION_TYPE,
      payload: {type: GET_POST_ACTION_TYPE},
    })
  }
}

const getHubspotCmsPage = (pageUrl: string) => async (dispatch) => {
  dispatch({
    type: GET_START_ACTION_TYPE,
    payload: {type: GET_HUBSPOT_CMS_PAGE_TYPE},
  })
  try {
    const {head, body} = await dispatch(unauthenticatedFetch(`/cms_fetch${pageUrl}`))
    dispatch({type: GET_HUBSPOT_CMS_PAGE_TYPE, head, body})
  } catch (error) {
    dispatch({type: 'ERROR', msg: error.message})
  } finally {
    dispatch({
      type: GET_STOP_ACTION_TYPE,
      payload: {type: GET_HUBSPOT_CMS_PAGE_TYPE},
    })
  }
}

const rawActions = {
  getTopics,
  getPosts,
  getMorePosts,
  getPost,
  searchTopics,
  getHubspotCmsPage,
}

const cmsActions = dispatchify(rawActions)

export {
  rawActions,
  buildPostUrl,
  cmsActions as default,
}
