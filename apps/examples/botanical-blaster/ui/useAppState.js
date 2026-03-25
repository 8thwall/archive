import {createState} from './createState'

const {getState, setState, subscribe} = createState({
  gamepadShown: false,
})

/**
 * Custom hook to use the app state.
 * @returns {[Object, Function]} - The current state and the setState function.
 */
export const useAppState = () => {
  const [localState, setLocalState] = React.useState(getState())

  React.useEffect(() => {
    const unsubscribe = subscribe(setLocalState)
    return () => unsubscribe()
  }, [])

  return [localState, setState]
}
