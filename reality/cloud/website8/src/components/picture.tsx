import React from 'react'

import {combine} from '../styles/classname-utils'

const WEBP_TYPE = 'image/webp'

interface IPicture {
  pngSrc?: string
  webpSrc?: string
  alt?: string
  className?: string
  imgClass?: string
}

const Picture: React.FunctionComponent<IPicture> = ({imgClass, pngSrc, webpSrc, alt, className, ...rest}) => (
  <picture className={className}>
    {webpSrc && <source srcSet={webpSrc} type={WEBP_TYPE} />}
    <img
      className={combine('img-fluid', 'm-auto', 'd-block', imgClass)}
      src={pngSrc}
      alt={alt}
      draggable={false}
      {...rest}
    />
  </picture>
)

export default Picture
