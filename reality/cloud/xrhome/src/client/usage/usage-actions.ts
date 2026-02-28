import {dispatchify, onError} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import {getSelectedAccountField} from '../accounts'

const loadAppSummaries = () => (dispatch, getState) => {
  dispatch({type: 'USAGE_APP_LOADING'})
  const AccountUuid = getSelectedAccountField(getState(), 'uuid')
  if (!AccountUuid) {
    return Promise.resolve()
  }
  return dispatch(authenticatedFetch(`/v1/usage/data/${AccountUuid}`))
    .then(({summaries, calls}) => dispatch({type: 'USAGE_APP_SUMMARIES', summaries, calls}))
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const loadEngagementMetrics = (appUuid: string) => async (dispatch) => {
  dispatch({type: 'USAGE_ENGAGEMENT_METRICS_LOADING', loading: true})

  try {
    const metricsUrl = `/v1/usage/data/engagement-metrics/${appUuid}`
    const res = await dispatch(authenticatedFetch(metricsUrl))
    dispatch({type: 'USAGE_ENGAGEMENT_METRICS', engagementMetrics: res})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }

  dispatch({type: 'USAGE_ENGAGEMENT_METRICS_LOADING', loading: false})
  return null
}

const loadAppAnalytics =
(startTime: Date, endTime: Date, appUuid: string) => async (dispatch) => {
  dispatch({type: 'TEST_USAGE_ENGAGEMENT_METRICS', loading: true})
  try {
    // eslint-disable-next-line max-len
    const params = new URLSearchParams({startTime: startTime.toISOString(), endTime: endTime.toISOString()})
    const metricsUrl = `/v1/usage/data/app-analytics/${appUuid}?${params}`
    const res = await dispatch(authenticatedFetch(metricsUrl))
    return res.data
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    return null
  }
}

export default dispatchify({
  loadAppSummaries,
  loadEngagementMetrics,
  loadAppAnalytics,
  error: onError,
})
