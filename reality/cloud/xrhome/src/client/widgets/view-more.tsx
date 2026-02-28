import React, {useCallback, useRef} from 'react'
import {createUseStyles} from 'react-jss'

import {GET_MORE_POSTS_ACTION_TYPE} from '../blog/cms-constants'
import {useSelector} from '../hooks'
import {Loader} from '../ui/components/loader'
import {brandBlack, bodySanSerif} from '../static/styles/settings'
import {Icon} from '../ui/components/icon'

const hovered = '&:hover'
const useStyles = createUseStyles({
  button: {
    color: brandBlack,
    fontFamily: bodySanSerif,
    border: 'none',
    background: 'none',
    fontWeight: '700',
    transition: 'all .2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    [hovered]: {
      transform: 'scale(1.1)',
    },
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
})

interface IViewMore {
  isLoading: boolean
  onLoad: () => void
  offset?: number
}

const ViewMore: React.FC<IViewMore> = ({
  isLoading, onLoad, offset = 0,
}) => {
  const styles = useStyles()
  const observer = useRef(null)
  const failed = useSelector(s => s.cms.failed?.[GET_MORE_POSTS_ACTION_TYPE])

  const buttonRef = useCallback((node) => {
    if (isLoading) {
      return
    }
    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !failed) {
          onLoad()
        }
      },
      {rootMargin: `0px 0px ${offset}% 0px`}
    )
    if (node) observer.current.observe(node)
  }, [isLoading])

  if (isLoading) {
    return <Loader inline centered />
  }

  return (
    <div className={styles.wrapper}>
      <button
        ref={buttonRef}
        type='button'
        className={styles.button}
        onClick={onLoad}
      >
        <span>View more</span>
        <Icon stroke='chevronDown' size={0.8} />
      </button>
    </div>
  )
}

export default ViewMore
