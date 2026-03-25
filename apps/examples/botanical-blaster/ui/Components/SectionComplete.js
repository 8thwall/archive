import {ImageButton} from './ImageButton'
import {ScreenOverlay} from './ScreenOverlay'
import {PointerLockHelper} from '../../components/controls/pointer-lock'
import {SVGButtons} from '../SVGButtons'
import {useAppState} from '../useAppState'
import useIsMobile from '../useIsMobile'
import {useGame} from '../Screens/useGame'

/**
 *
 * @param {{
 * hideOverlay?: boolean,
 * reset: Function;
 * next: Function
 * }} props
 * @returnsß
 */
export const SectionComplete = ({reset, next, hideOverlay}) => {
  const {enter, exit} = useGame()

  React.useEffect(() => {
    if (hideOverlay) return
    exit()
    return () => {
      // enter();
    }
  }, [])

  if (!hideOverlay) {
    return React.createElement(ScreenOverlay, {}, [
      React.createElement(
        'div',
        {
          style: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
          },
          React.createElement(
            ImageButton,
            {
              buttonNormalSrc: SVGButtons.Reset,
              buttonClickSrc: SVGButtons.Reset_click,
              onClick: () => {
                reset()
              },
            },
            'reset'
          ),
          React.createElement(
            ImageButton,
            {
              buttonNormalSrc: SVGButtons.Next,
              buttonClickSrc: SVGButtons.Next_Click,
              onClick: () => {
                next()
              },
            },
            'reset'
          )
        )
      ),
    ])
  }

  return React.createElement(
    'div',
    {
      style: {
        width: '100%',
        height: 'auto',
        position: 'absolute',
        left: 0,
        bottom: 0,
      },
    },
    React.createElement(
      'div',
      {
        style: {
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      React.createElement(
        ImageButton,
        {
          buttonNormalSrc: SVGButtons.Reset,
          buttonClickSrc: SVGButtons.Reset_click,
          onClick: () => {
            reset()
          },
        },
        'reset'
      ),
      React.createElement(
        ImageButton,
        {
          buttonNormalSrc: SVGButtons.Next,
          buttonClickSrc: SVGButtons.Next_Click,
          onClick: () => {
            next()
          },
        },
        'reset'
      )
    )
  )
}
