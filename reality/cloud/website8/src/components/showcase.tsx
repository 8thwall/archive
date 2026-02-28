import React from 'react'

import {combine, bool} from '../styles/classname-utils'
import * as classes from './showcase.module.scss'

export const ShowcaseSelect = ({children, select, active}) => (
  <li className={combine('text8-lg', 'font8-bold', bool(active, classes.editorNavActive))}>
    <a className='text8-md' href='' role='button' onClick={select}>
      {children}
    </a>
  </li>
)

export const ShowcaseSelectGroup = ({children}) => <ul className={classes.editorNav}>{children}</ul>

export const ShowcaseCarousel = ({children}) => (
  <div className='carousel slide carousel-fade' data-ride='carousel' data-interval='false'>
    <div className='carousel-inner'>
      {children}
    </div>
  </div>
)

interface IShowcaseSlide {
  img: string // img src
  active: boolean
  children: React.ReactNode
}
export const ShowcaseSlide: React.FunctionComponent<IShowcaseSlide> = ({img, active, children}) => (
  <div className={combine('carousel-item', classes.carouselItem, bool(active, 'active'))}>
    <img className={classes.editorImage} src={img} alt='editor showcase' />
    <div className={combine('d-none', 'd-md-block', classes.editorCaption)}>
      {children}
    </div>
  </div>
)
