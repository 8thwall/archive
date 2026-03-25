import {UIManager} from '../../ui/ui'

/**
 *
 * @param {{
 * imageSRC: string,
 * }} props
 * @returns
 */
export const Image = ({imageSRC}) => React.createElement('img', {
  src: imageSRC,
})

/**
 *
 * @param {{
 * buttonNormalSrc: string,
 * buttonClickSrc: string,
 * onClick: Function,
 * children?: *
 * }} props
 * @returns
 */
export const ImageButton = ({
  buttonNormalSrc,
  buttonClickSrc,
  children,
  onClick,
}) => {
  const {useRef, useState} = React
  const buttonRef = useRef(null)

  const [isHovered, setHover] = useState(false)

  return React.createElement(
    'button',
    {
      ref: buttonRef,
      onMouseDown: () => {
        UIManager.playClick()
        onClick()
      },
      onMouseEnter: () => {
        setHover(true)
      },
      onMouseLeave: () => {
        setHover(false)
      },
      style: {
        position: 'relative',
        zIndex: 10000,
        pointerEvents: 'auto',
        width: 'auto',
        height: 'auto',
        margin: 'auto',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
      },
    },
    React.createElement(
      React.Fragment,
      {},
      isHovered
        ? React.createElement(Image, {
          imageSRC: buttonClickSrc,
        })
        : React.createElement(Image, {
          imageSRC: buttonNormalSrc,
        })
    )
  )
}
