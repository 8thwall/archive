import React, {FC} from 'react'

import * as classes from './why-webar-section.module.scss'
import {combine} from '../../styles/classname-utils'

interface IReason {
  icon: string
  title: string
  children: React.ReactNode
}

const Reason: FC<IReason> = ({icon, title, children}) => (
  <div className={combine('col-lg-4 px-lg-4 col-md-8', classes.alignTextLeft)}>
    <img className={classes.icon} src={icon} alt='title' />
    <h3 className={combine('h3-xl', classes.title)}>{title}</h3>
    <p className='text8-lg'>{children}</p>
  </div>
)

export default Reason
