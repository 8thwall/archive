import {createAction, createReducer} from '@reduxjs/toolkit'
import type {SemanticICONS} from 'semantic-ui-react'
import type {DeepReadonly} from 'ts-essentials'

interface TopBarState extends DeepReadonly<{
  isShown: boolean
  icon: SemanticICONS
  summary: string
  text: string
  linkText: string
  linkTo: string
  linkIsButton: boolean
  color: 'blue' | 'purple'
  closeable: boolean
}> {}

const initialState: TopBarState = {
  isShown: false,
  icon: null,
  summary: '',
  text: '',
  linkText: '',
  linkTo: '',
  linkIsButton: false,
  color: 'purple',
  closeable: false,
}

const setIsShown = createAction<boolean>('TOP_BAR/IS_SHOWN_SET')
const setState = createAction<TopBarState>('TOP_BAR/STATE_SET')

const Reducer = createReducer(
  initialState,
  builder => builder
    .addCase(setIsShown, (state, action) => ({...state, isShown: action.payload}))
    .addCase(setState, (state, action) => ({...state, ...action.payload}))
)

export {
  Reducer as default,
  setIsShown,
  setState,
}

export type {
  TopBarState,
}
