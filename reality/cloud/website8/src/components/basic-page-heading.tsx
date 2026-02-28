import React, {FC} from 'react'

import {combine} from '../styles/classname-utils'
import * as classes from './basic-page-heading.module.scss'

interface IBasicPageHeading {
  children: React.ReactNode
}

const BasicPageHeading: FC<IBasicPageHeading> = ({children}) => (
  <h1 className={combine(classes.heading, 'offset-md-1')}>{children}</h1>
)

export default BasicPageHeading
