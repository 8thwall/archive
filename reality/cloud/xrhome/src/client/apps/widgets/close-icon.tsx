/* eslint-disable max-len */
import React from 'react'

interface ICloseIcon {
  className: string
}

const CloseIcon: React.FC<ICloseIcon> = ({className}) => (
  <svg className={className} xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' fill='currentColor' viewBox='0 0 8 8'>
    <path d='M4.7,4l3.1-3.1C8,0.7,8,0.4,7.8,0.2S7.3,0,7.1,0.2L4,3.3l0,0l0,0L0.9,0.2C0.7,0,0.4,0,0.2,0.2C0,0.4,0,0.7,0.2,0.9L3.3,4L0.2,7.1C0,7.3,0,7.6,0.2,7.8C0.4,8,0.7,8,0.9,7.8L4,4.7l0,0l0,0l3.1,3.1C7.3,8,7.6,8,7.8,7.8s0.2-0.5,0-0.7L4.7,4z' />
  </svg>
)

export default CloseIcon
