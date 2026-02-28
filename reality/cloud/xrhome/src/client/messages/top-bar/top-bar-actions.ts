import {dispatchify} from '../../common'
import type {DispatchifiedActions, Thunk} from '../../common/types/actions'
import {setIsShown, setState, TopBarState} from './top-bar-reducer'

const setShowTopBar = (isShow: boolean): Thunk<void> => dispatch => dispatch(setIsShown(isShow))
const setTopBarMessage = (state: TopBarState): Thunk<void> => (dispatch) => {
  if (state) {
    dispatch(setState(state))
  }
}

const rawActions = {
  setShowTopBar,
  setTopBarMessage,
}

type TopBarActions = DispatchifiedActions<typeof rawActions>

const topBarActions = dispatchify(rawActions)

export {
  topBarActions as default,
  setShowTopBar,
  setTopBarMessage,
}

export type {
  TopBarActions,
}
