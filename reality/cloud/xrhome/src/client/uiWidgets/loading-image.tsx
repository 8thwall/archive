import React, {useState} from 'react'

import {createUseStyles} from 'react-jss'

import {gray2, gray3} from '../static/styles/settings'
import {combine} from '../common/styles'

const useStyles = createUseStyles({
  'animate': {
    animation: '$loadBreathe 1s ease-in-out infinite alternate both',
    backgroundColor: gray2,
  },
  '@keyframes loadBreathe': {
    from: {
      background: gray2,
    },
    to: {
      background: gray3,
    },
  },
})

interface ILoadingImage extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string  // Enforce alt because it is good practice.
}

export const LoadingImage: React.FC<ILoadingImage> = (props) => {
  const {animate} = useStyles()
  const [loading, setLoading] = useState(true)

  return (
    <img
      {...props}
      alt={props.alt}
      className={combine(props.className, loading && animate)}
      onLoad={(e) => {
        setLoading(false)
        props.onLoad?.(e)
      }}
    />
  )
}
