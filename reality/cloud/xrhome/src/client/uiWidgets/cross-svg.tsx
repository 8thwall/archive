/* eslint-disable max-len */
import React from 'react'

interface Icon {
  className?: string
  fill?: string
  width?: string
  height?: string
}

const CrossSvg: React.FC<Icon> = ({
  className, fill = 'currentColor', width = '12px', height = '13px',
}) => (
  <svg className={className} width={width} height={height} viewBox='0 0 16 16' version='1.1' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M15.5288 13.2702C16.1537 13.8952 16.1537 14.9076 15.5288 15.5325C15.2188 15.845 14.8088 16 14.3989 16C13.9889 16 13.5799 15.8438 13.268 15.5313L7.99937 10.2654L2.73129 15.53C2.41881 15.845 2.00934 16 1.59987 16C1.19041 16 0.781439 15.845 0.468713 15.53C-0.156238 14.9051 -0.156238 13.8927 0.468713 13.2677L5.7383 7.99813L0.468713 2.73104C-0.156238 2.10609 -0.156238 1.09366 0.468713 0.468713C1.09366 -0.156238 2.10609 -0.156238 2.73104 0.468713L7.99937 5.7408L13.269 0.471213C13.8939 -0.153738 14.9063 -0.153738 15.5313 0.471213C16.1562 1.09616 16.1562 2.10859 15.5313 2.73354L10.2617 8.00313L15.5288 13.2702Z'
      fill={fill}
    />
  </svg>
)

export {CrossSvg}
