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

const initialState = {
  topics: {},
  exploreTopicList: [],
  popularTopicList: [],
  posts: {},
  postList: [],
  postPagination: {total: 0, offset: 0},
  pending: [],
  authors: {},
  failed: {},
  currentTopic: null,
  hubspotPage: {head: null, body: null},
}

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_START_ACTION_TYPE:
      return {
        ...state,
        pending: [...state.pending, action.payload],
      }
    case ACTION_FAILED:
      return {
        ...state,
        failed: {
          ...state.failed,
          [action.payload]: true,
        },
      }
    case CLEAR_FAIL_ACTION:
      return {
        ...state,
        failed: {
          ...state.failed,
          [action.payload]: false,
        },
      }
    case GET_STOP_ACTION_TYPE:
      return {
        ...state,
        pending: state.pending.filter(a => a.type !== action.payload.type),
      }
    case SEARCH_TOPICS_ACTION_TYPE:
      return {
        ...state,
        topics: {...state.topics, ...action.topics},
      }
    case GET_TOPICS_ACTION_TYPE:
      return {
        ...state,
        topics: {...state.topics, ...action.topics},
        exploreTopicList: action.exploreList,
        popularTopicList: action.popularList,
      }
    case GET_MORE_POSTS_ACTION_TYPE:
      return {
        ...state,
        posts: {...state.posts, ...action.posts},
        postList: [...state.postList, ...action.list],
        postPagination: {
          total: action.total,
          offset: state.postPagination.offset + action.list.length,
        },
        authors: {...state.authors, ...action.authors},
      }
    case GET_POSTS_ACTION_TYPE:
      return {
        ...state,
        posts: {...state.posts, ...action.posts},
        postList: action.list,
        currentTopic: action.topic,
        postPagination: {
          total: action.total,
          offset: action.list.length,
        },
        authors: {...state.authors, ...action.authors},
      }
    case GET_POST_ACTION_TYPE:
      return {
        ...state,
        posts: {...state.posts, [action.post.id]: action.post},
        authors: {...state.authors, [action.author.id]: action.author},
      }
    case GET_HUBSPOT_CMS_PAGE_TYPE:
      return {
        ...state,
        hubspotPage: {head: action.head, body: action.body},
      }
    default:
      return state
  }
}
export default Reducer
