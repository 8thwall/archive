import React from 'react'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

// this is the inner circle with whatever you want inside
const CustomProgressBar = ({children, ...otherProps}) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}
  >
    <div style={{position: 'absolute', width: '100%', height: '100%'}}>
      <CircularProgressbar {...otherProps} />
    </div>
    <div
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  </div>
)

// this is the component imported to the view
const GradientCircularBar = ({percentage, endColor, startColor, gradientId, children, className}) => {
  const gradientTransform = 'rotate(90)'
  return (
    <div className={className}>
      <svg style={{height: 0, width: 0}}>
        <defs>
          <linearGradient id={gradientId} gradientTransform={gradientTransform}>
            <stop offset='0%' stopColor={startColor} />
            <stop offset='100%' stopColor={endColor} />
          </linearGradient>
        </defs>
      </svg>
      <CustomProgressBar
        percentage={percentage}
        strokeWidth='15'
        styles={{path: {stroke: `url(#${gradientId})`, height: '100%'}}}
      >
        {children}
      </CustomProgressBar>
    </div>
  )
}

export default GradientCircularBar
