import React from 'react'
import {createUseStyles} from 'react-jss'

import {useLocation} from 'react-router-dom'

import {Icon} from '../ui/components/icon'
import {combine} from '../common/styles'
import {brandPurple, brandWhite, gray1} from '../static/styles/settings'

const useStyles = createUseStyles({
  main: {
    maxWidth: '991px',
    margin: 'auto',
    width: '100%',
  },
  title: {
    'width': '100%',
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'padding': '1em 1.25em',
    'color': brandPurple,
    'border': `1px solid ${gray1}`,
    'backgroundColor': brandWhite,
    'borderRadius': '0.5em',
    'cursor': 'pointer',
    'WebkitTapHighlightColor': 'transparent',
    '& span': {
      fontSize: '1.25em',
      fontWeight: 700,
    },
    '& svg': {
      transition: 'transform 0.5s',
    },
  },
  openTitle: {
    '& svg': {
      transform: 'rotate(180deg)',
    },
  },
  collapsedContent: {
    gridTemplateRows: '0fr !important',
  },
  collapseContentWrapper: {
    width: '100%',
    margin: 'auto',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateRows: '1fr',
    transition: 'grid-template-rows 300ms ease-out',
  },
  contentOuter: {
    width: '100%',
    overflow: 'hidden',
  },
  contentInner: {
    'padding': '1em 0',
    'fontSize': '1.125em',
    'lineHeight': '1.5em',
    '& a': {
      color: brandPurple,
    },
  },
})

interface IPricingFAQQuestion {
  qid: string
  title: string
  answer: React.ReactNode
  startCollapsed?: boolean
}

const PricingFAQQuestion: React.FC<IPricingFAQQuestion> = ({
  qid, title, answer, startCollapsed = true,
}) => {
  const classes = useStyles()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = React.useState(startCollapsed)

  // Need to wrap in a useEffect to avoid multiple re-rerenders
  React.useEffect(() => {
    if (location.hash === `#${qid}`) {
      setIsCollapsed(false)
    }
  }, [location.hash])

  return (
    <div className={classes.main} id={qid}>
      <button
        type='button'
        className={
          combine('style-reset', classes.title, !isCollapsed && classes.openTitle)}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>{title}</span>
        <span><Icon stroke='chevronDown' color='gray3' /></span>
      </button>
      <div className={combine(classes.collapseContentWrapper,
        isCollapsed && classes.collapsedContent)}
      >
        <div className={classes.contentOuter}>
          <div className={classes.contentInner}>
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export {PricingFAQQuestion}
