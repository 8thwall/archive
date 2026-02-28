import React, {FC} from 'react'

import * as classes from './embed.module.scss'
import {combine, bool} from '../../styles/classname-utils'

interface IAdCard {
  header: string
  description: string
  className?: string
  imgURL?: string
  imgAlt?: string
  highlight?: boolean
  demoLink?: string
  a8?: string
}

const AdCard: FC<IAdCard> = (
  {header, description, className = '', highlight = false, children, demoLink, a8}
) => (
  <div
    className={combine('card d-md-block text-center',
      classes.embedCard, className,
      bool(highlight, classes.highlight))}
  >
    <p className='text8-lg mb-3 font8-bold'>{header}</p>
    {children}
    <p className={combine('text-left', classes.embedCardText)}>{description}</p>
    {demoLink &&
      <a
        className={classes.embedButton}
        href={demoLink}
        a8={a8}
      >
        Try Demo
      </a>}
  </div>
)
export default AdCard
