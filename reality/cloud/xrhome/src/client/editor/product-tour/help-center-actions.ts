import {dispatchify} from '../../common'
import type {DispatchifiedActions} from '../../common/types/actions'
import {
  HelpCenterActionType, SupportTicketCreateResponse, SupportTicketType,
} from '../../../shared/help-center/help-center-types'
import authenticatedFetch from '../../common/authenticated-fetch'

const uploadAttachments = (files: File[]) => async (dispatch) => {
  dispatch({type: HelpCenterActionType.ERROR, error: {uploadAttachment: false}})

  if (!files.length) {
    return []
  }

  try {
    return await Promise.all(files.map(async (file: File) => {
      const formData = new FormData()
      formData.append('media', file)
      const {token} = await dispatch(authenticatedFetch('/v1/help-center/upload', {
        method: 'POST',
        body: formData,
        json: false,
      }))

      return token as string
    }))
  } catch (err) {
    dispatch({type: HelpCenterActionType.ERROR, error: {uploadAttachment: true}})
    throw err
  }
}

const sendSupportTicket = (
  AccountUuid: string, supportSubject: string, supportBody: string, ticketType: SupportTicketType,
  attachmentTokens: string[] = []
) => async (dispatch) => {
  dispatch({type: HelpCenterActionType.ERROR, error: {submitError: false}})

  try {
    const request = {
      method: 'POST',
      body: JSON.stringify({
        subject: supportSubject,
        body: supportBody,
        type: ticketType,
        ...(attachmentTokens.length ? {attachmentTokens} : {}),
        AccountUuid,
      }),
    }

    const result = await dispatch(authenticatedFetch('/v1/help-center/requests', request))
    return result as SupportTicketCreateResponse
  } catch (e) {
    dispatch({type: HelpCenterActionType.ERROR, error: {sendSupportTicket: true}})
  }

  return null
}

const clearSupportTicket = () => (dispatch) => {
  dispatch({type: HelpCenterActionType.CLEAR_SUPPORT_TICKET})
}

const getSearchResults = (query: string, signal?: AbortSignal) => async (dispatch) => {
  dispatch({type: HelpCenterActionType.ERROR, error: {getSearchResults: false}})

  if (!query.length) {
    return
  }

  const searchParams = new URLSearchParams()
  searchParams.append('query', query)

  try {
    const {results: searchResults} =
      await dispatch(
        authenticatedFetch(`/v1/help-center/search?${searchParams.toString()}`, {signal})
      )

    dispatch({type: HelpCenterActionType.GET_SEARCH_RESULTS, searchResults})
  } catch (err) {
    // Do nothing if it's an AbortError as we are aborting the previous fetch intentionally
    if (err.name !== 'AbortError') {
      dispatch({type: HelpCenterActionType.ERROR, error: {getSearchResults: true}})
    }
  }
}

const clearSearchResults = () => (dispatch) => {
  dispatch({type: HelpCenterActionType.CLEAR_SEARCH_RESULTS})
}

const clearErrors = () => (dispatch) => {
  dispatch({type: HelpCenterActionType.CLEAR_ERRORS})
}

const rawActions = {
  sendSupportTicket,
  clearSupportTicket,
  getSearchResults,
  clearSearchResults,
  uploadAttachments,
  clearErrors,
}

export type HelpCenterActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
