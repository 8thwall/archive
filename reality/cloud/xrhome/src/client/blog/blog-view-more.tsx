import React from 'react'
import {useDispatch} from 'react-redux'
import {useParams} from 'react-router-dom'

import {rawActions as actions} from './cms-actions'
import {useIsActionLoading} from './cms-selectors'
import {GET_MORE_POSTS_ACTION_TYPE} from './cms-constants'
import {useSelector} from '../hooks'
import ViewMore from '../widgets/view-more'

const BlogViewMore = () => {
  const {offset} = useSelector(state => state.cms.postPagination)
  const {topicId} = useParams<{topicId: string}>()
  const dispatch = useDispatch()
  const [postId] = useSelector(state => state.cms.postList)
  const {created} = useSelector(state => state.cms.posts)[postId]

  const loadMore = () => {
    dispatch(actions.getMorePosts({topic: topicId, created, offset}))
  }

  return (
    <ViewMore
      isLoading={useIsActionLoading(GET_MORE_POSTS_ACTION_TYPE)}
      onLoad={loadMore}
    />
  )
}

export default BlogViewMore
