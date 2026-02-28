import React from 'react'
import {css} from '@emotion/react'

// This requires Bootstrap
export const CarouselSlide = ({id, width = '80vw', dataInterval = '5000', children}) => (
  <div
    className='carousel slide'
    id={id}
    data-ride='carousel'
    data-interval={dataInterval}
    css={css`margin: 0 auto; width: ${width}; height: 100%; text-align: center`}
  >
    <div className='carousel-inner'>
      {children}
    </div>

    <a className='carousel-control-prev' href={`#${id}`} role='button' data-slide='prev'>
      <span className='carousel-control-prev-icon' aria-hidden='true' />
      <span className='sr-only'>Previous</span>
    </a>
    <a className='carousel-control-next' href={`#${id}`} role='button' data-slide='next'>
      <span className='carousel-control-next-icon' aria-hidden='true' />
      <span className='sr-only'>Next</span>
    </a>
  </div>
)

export const CarouselItem = ({active = false, children}) => (
  <div className={`carousel-item ${active && 'active'}`}>
    {children}
  </div>
)
