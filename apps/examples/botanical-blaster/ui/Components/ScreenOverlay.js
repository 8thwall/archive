/**
 *
 * @param {{
 * children?: *
 * }} props
 * @returns
 */
export const ScreenOverlay = ({children}) => React.createElement(
  'div',
  {
    style: {
      backgroundColor: 'rgba(0,0,0,.75)',
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  children
)
