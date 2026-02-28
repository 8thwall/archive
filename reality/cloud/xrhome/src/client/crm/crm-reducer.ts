import {createAction, createReducer} from '@reduxjs/toolkit'

import {CrmState, CrmCustomer, LoadState} from './types'

const initialState: CrmState = {
  entities: {},
  currentUser: undefined,
  currentUserLoading: LoadState.Initial,
}

// Follow the style of describing the event that happened and not a setter
// https://redux.js.org/style-guide/style-guide#write-meaningful-action-names
const currentUserLoaded = createAction<CrmCustomer>('CRM/CURRENT_USER_LOADED')
const currentUserLoading = createAction<LoadState>('CRM/CURRENT_USER_LOADING')

const Reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(
      currentUserLoading,
      (state, {payload}) => ({...state, currentUserLoading: payload})
    )
    .addCase(
      currentUserLoaded,
      (state, {payload}) => {
        const newVidInfo = payload?.vid ? {[payload?.vid]: payload} : {}
        return {
          entities: {
            ...state.entities,
            ...newVidInfo,
          },
          currentUser: payload?.vid,
          currentUserLoading: LoadState.Loaded,
        }
      }
    )
})

export {
  Reducer as default,
  currentUserLoaded,
  currentUserLoading,
}
