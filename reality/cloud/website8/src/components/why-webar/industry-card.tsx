import React, {FC} from 'react'
import Img, {FluidObject} from 'gatsby-image'

import {combine} from '../../styles/classname-utils'
import * as classes from './industry-card.module.scss'

interface Props {
  link: string
  fluidImg: FluidObject
  title: string
  html: string
  a8: string
}

const IndustryCard: FC<Props> = ({link, fluidImg, title, html, a8}) => (
  <a
    href={link}
    className={combine('card shadow', classes.card)}
    a8={a8}
  >
    <div className='embed-responsive-16by9'>
      <Img className='card-img-top embed-responsive-item' fluid={fluidImg} alt={title} />
    </div>
    <div className={combine(classes.cardBody, 'card-body')}>
      <h3 className={combine('card-title', 'font8-black', classes.title)}>{title}</h3>
      {/* eslint-disable-next-line react/no-danger */}
      <div className='card-text text8-md' dangerouslySetInnerHTML={{__html: html}} />
    </div>
  </a>
)

export default IndustryCard
