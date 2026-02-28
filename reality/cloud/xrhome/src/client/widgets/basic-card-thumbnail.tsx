import React from 'react'
import {createUseStyles} from 'react-jss'
import {Link} from 'react-router-dom'
import {Card} from 'semantic-ui-react'

import '../static/styles/index.scss'
import {cardImageRatio} from '../static/styles/settings'
import {gray1, gray6} from '../static/styles/settings'

interface IBasicCardThumbnail {
  src: string
  to?: string
  badgeLabel?: string
}

const useStyles = createUseStyles({
  basicCardThumbnail: {
    padding: '0 !important',
    paddingTop: [cardImageRatio, '!important'],
    position: 'relative',
    backgroundPosition: 'center center !important',
    backgroundRepeat: 'no-repeat !important',
    backgroundSize: 'cover !important',
  },
  badge: {
    position: 'absolute',
    top: '1em',
    right: '1em',
    fontSize: '0.8em',
    padding: '0.25em 0.5em',
    borderRadius: '0.25em',
    backgroundColor: gray1,
    color: gray6,
  },
})

const BasicCardThumbnail: React.FC<IBasicCardThumbnail> = ({src, to, badgeLabel}) => {
  const classes = useStyles()
  return (
    <Card.Content
      style={{backgroundImage: `url(${src})`}}
      className={classes.basicCardThumbnail}
      as={to ? Link : undefined}
      to={to}
    >
      {badgeLabel &&
        <div className={classes.badge}>{badgeLabel}</div>
      }
    </Card.Content>
  )
}

export {
  BasicCardThumbnail,
}
