import React, {useState, useEffect} from 'react'
import {createUseStyles} from 'react-jss'

import {tinyViewOverride} from '../static/styles/settings'
import backToTopIcon from '../static/icons/back-to-top-icon.svg'

const SCROLL_TOLERANCE = 15

const useStyles = createUseStyles({
  backToTopButton: {
    width: '40px',
    height: '40px',
    position: 'fixed',
    zIndex: 100,
    bottom: '32px',
    right: '32px',
    [tinyViewOverride]: {
      bottom: '16px',
      right: '16px',
    },
  },
})

const BackToTopButton = ({showAfterY}) => {
  const classes = useStyles()
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const scrollListener = () => {
      const scrollThreshold = showAfterY || window.innerHeight / 2
      setShowButton((oldShowButton) => {
        if (!oldShowButton && window.scrollY >= scrollThreshold + SCROLL_TOLERANCE) {
          return true
        } else if (oldShowButton && window.scrollY <= scrollThreshold - SCROLL_TOLERANCE) {
          return false
        }

        return oldShowButton
      })
    }

    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return showButton
    ? (
      <input
        type='image'
        className={classes.backToTopButton}
        src={backToTopIcon}
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        alt='back to top'
      />
    )
    : null
}

export default BackToTopButton
