import {ViritualGamepadManager} from '../../components/controls/virtual-gamepad-controls'

const AnalogStick = ({onMove}) => {
  const [position, setPosition] = React.useState({x: 0, y: 0})
  const [dragging, setDragging] = React.useState(false)
  const [startPosition, setStartPosition] = React.useState({x: 0, y: 0})

  const handleStart = (e) => {
    const touch = e.touches ? e.touches[0] : e
    setDragging(true)
    setStartPosition({x: touch.clientX, y: touch.clientY})
  }

  const handleMove = (e) => {
    if (dragging) {
      const sensitivity = 0.4
      const touch = e.touches ? e.touches[0] : e
      const deltaX = (touch.clientX - startPosition.x) * sensitivity
      const deltaY = (touch.clientY - startPosition.y) * sensitivity
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const radius = 50

      if (distance < radius) {
        setPosition({x: deltaX, y: deltaY})
      } else {
        const angle = Math.atan2(deltaY, deltaX)
        setPosition({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        })
      }

      if (onMove) {
        onMove({deltaX, deltaY})
      }
    }
  }

  const handleEnd = () => {
    setDragging(false)
    setPosition({x: 0, y: 0})
  }

  React.useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMove, {passive: false})
      document.addEventListener('mouseup', handleEnd, {passive: false})
      document.addEventListener('touchmove', handleMove, {passive: false})
      document.addEventListener('touchend', handleEnd, {passive: false})
    } else {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [dragging])

  return React.createElement(
    'div',
    {
      style: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.5)',
        position: 'absolute',
        bottom: '20px',
        left: '20px',
      },
      onMouseDown: handleStart,
      onTouchStart: handleStart,
    },
    React.createElement('div', {
      style: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,1)',
        position: 'absolute',
        left: `calc(50% - 20px + ${position.x}px)`,
        top: `calc(50% - 20px + ${position.y}px)`,
      },
    })
  )
}

const Button = ({}) => {
  const handleButtonDown = (e) => {
    ViritualGamepadManager.triggerButtonDown()
  }
  const handleButtonUp = (e) => {
    ViritualGamepadManager.triggerButtonUp()
  }
  return React.createElement(
    'div',
    {
      onMouseDown: handleButtonDown,
      onTouchStart: handleButtonDown,
      onMouseUp: handleButtonUp,
      onTouchEnd: handleButtonUp,
      style: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,165,0,0.8)',
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '20px',
      },
    },
    null
  )
}

export const GamePad = ({}) => React.createElement(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'auto',
      touchAction: 'auto',
    },
  },
  React.createElement(
    AnalogStick,
    {
      onMove: ({deltaX, deltaY}) => {
        ViritualGamepadManager.triggerAnaglogMove(deltaX, deltaY)
      },
    },
    []
  ),
  React.createElement(Button, {}, [])
)
