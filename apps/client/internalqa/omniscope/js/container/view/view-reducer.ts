const initialState = {
  currentViewId: 0,
  currentGroupName: '',
  viewNames: [],
  viewGroups: {},
}

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VIEW/SET_CURRENT_VIEW_ID':
      return {...state, currentViewId: action.currentViewId}
    case 'VIEW/SET_CURRENT_GROUP_NAME':
      return {...state, currentGroupName: action.groupName}
    case 'VIEW/SET_VIEWS':
      return {
        ...state,
        viewNames: action.viewNames,
      }
    case 'VIEW/SET_VIEW_GROUPS':
      return {
        ...state,
        viewGroups: action.viewGroups,
      }
    default:
      return state
  }
}

export default Reducer
