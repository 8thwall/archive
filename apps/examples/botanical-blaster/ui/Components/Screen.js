import {ScreenManager} from '../ScreenManager'

//
//
// @param {{
// id:string,
// children?:*
// }} props
// @returns
//
export const Screen = ({id, children}) => {
  const {useRef, useEffect} = React

  const screenRef = useRef(null)

  useEffect(() => {
    if (!screenRef?.current) return;
    (async () => {
      const screen = ScreenManager.mountScreen(id, screenRef.current)
      await screen.enter()
    })()
  }, [id])

  return React.createElement(
    'span',
    {
      ref: screenRef,
      style: {
        pointerEvents: 'auto',
      },
    },
    children
  )
}
