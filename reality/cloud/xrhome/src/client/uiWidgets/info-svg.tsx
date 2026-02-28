/* eslint-disable max-len */
import React from 'react'

interface Icon {
  className?: string
  fill?: string
  width?: string
  height?: string
}

const InfoSvg: React.FC<Icon> = ({
  className, fill = 'currentColor', width = '12px', height = '12px',
}) => (
  <svg className={className} width={width} height={height} viewBox='0 0 12 12' version='1.1' xmlns='http://www.w3.org/2000/svg'>
    <path
      fill={fill}
      fillRule='evenodd'
      clipRule='evenodd'
      d='M6 0C2.68652 0 0 2.68749 0 6C0 9.31444 2.68652 12 6 12C9.31348 12 12 9.31444 12 6C12 2.68749 9.31348 0 6 0ZM6.00008 2.6613C6.56127 2.6613 7.01621 3.11624 7.01621 3.67743C7.01621 4.23862 6.56127 4.69356 6.00008 4.69356C5.43888 4.69356 4.98395 4.23862 4.98395 3.67743C4.98395 3.11624 5.43888 2.6613 6.00008 2.6613ZM7.06456 9.09678C7.22489 9.09678 7.35488 8.96678 7.35488 8.80645V8.22581C7.35488 8.06548 7.22489 7.93548 7.06456 7.93548H6.77423V5.51613C6.77423 5.3558 6.64424 5.22581 6.48391 5.22581H4.93553C4.77519 5.22581 4.6452 5.3558 4.6452 5.51613V6.09678C4.6452 6.25711 4.77519 6.3871 4.93553 6.3871H5.22585V7.93548H4.93553C4.77519 7.93548 4.6452 8.06548 4.6452 8.22581V8.80645C4.6452 8.96678 4.77519 9.09678 4.93553 9.09678H7.06456Z'
    />
  </svg>
)

export {InfoSvg}
