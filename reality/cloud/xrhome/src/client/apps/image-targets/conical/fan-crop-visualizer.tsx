/* eslint-disable quote-props */
import React from 'react'
import {createUseStyles} from 'react-jss'

import type {CropAreaPixels} from '../../../common/image-cropper'
import {combine} from '../../../common/styles'
import {lerp0, Point, computePixelPointsFromRadius} from './unconify'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    '& > svg': {
      flex: '1 0 0',
    },
  },
})

interface IFanCropVisualizer {
  image: string
  width: number
  height: number
  topRadius: number
  bottomRadius: number
  unconedWidth: number
  unconedHeight: number
  cropPixels: CropAreaPixels
  isLandscape: boolean
  className: string
}

// Shows the crop of the unconified image visualized on the original rainbow image
const FanCropVisualizer: React.FunctionComponent<IFanCropVisualizer> = ({
  image, width, height, topRadius, bottomRadius, unconedWidth, unconedHeight, cropPixels,
  isLandscape, className,
}) => {
  const classes = useStyles()
  if (isLandscape) {
    // in the unrotated image:
    // 0,0 is the top left corner
    // +x (+left) goes from left to right
    // +y (+top) goes from top to bottom
    // in the rotated image the image is rotated +90 clockwise and then:
    // 0,0 is the top left corner
    // +x (+left) goes from left to right
    // +y (+top) goes from top to the bottom
    cropPixels = {
      top: unconedHeight - cropPixels.width - cropPixels.left,
      left: cropPixels.top,
      width: cropPixels.height,
      height: cropPixels.width,
    }
  }
  const {apex, theta, isFez} = computePixelPointsFromRadius(topRadius, bottomRadius, width)
  const absTopRadius = Math.abs(topRadius)

  const toFanPoint = (unconedPoint: Point): Point => {
    // angle between the vertical line going through the apex and the line (apex, unconedPoint)
    const arcAngle = (unconedWidth / 2 - unconedPoint.x) / unconedWidth * theta
    const r = rAtPoint(unconedPoint, isFez)
    const x = apex.x - r * Math.sin(arcAngle)
    let y = apex.y - r * Math.cos(arcAngle)
    if (isFez) {
      y = height - y
    }
    return {
      x,
      y,
    }
  }

  const rAtPoint = (unconedPoint: Point, isFez: boolean): number => {
    if (isFez) {
      return lerp0(bottomRadius, absTopRadius, (unconedHeight - unconedPoint.y) / unconedHeight)
    }

    return lerp0(bottomRadius, absTopRadius, unconedPoint.y / unconedHeight)
  }

  // these points are the corner locations the crop back on the rainbow image.  Everything outside
  // of the mask created by these points will be darker.
  const tl = toFanPoint({x: cropPixels.left, y: cropPixels.top})
  const tr = toFanPoint({x: cropPixels.left + cropPixels.width, y: cropPixels.top})
  const bl = toFanPoint({x: cropPixels.left, y: cropPixels.top + cropPixels.height})
  const br = toFanPoint({x: cropPixels.left + cropPixels.width, y: cropPixels.top + cropPixels.height})
  // this is the bottom and top radius of the crop. They should be the exact same as the topRadius
  // and bottomRadius unless the crop is zoomed in.
  const tlR = rAtPoint({x: cropPixels.left, y: cropPixels.top}, isFez)
  const brR = rAtPoint({x: cropPixels.left + cropPixels.width, y: cropPixels.top + cropPixels.height}, isFez)

  return (
    <div className={combine(className, classes.container)}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <mask id='mask-path' x='0' y='0' width='1' height='1'>
            <rect x='0' y='0' width={width} height={height} fill='white' />
            <path
              d={`M${tl.x},${tl.y}
                    A ${tlR} ${tlR} 0 0 ${isFez ? 0 : 1} ${tr.x},${tr.y}
                    L ${br.x},${br.y}
                    A ${brR} ${brR} 0 0 ${isFez ? 1 : 0} ${bl.x},${bl.y}
                    Z`}
              fill='black'
            />
          </mask>
        </defs>
        <g>
          <image href={image} />
        </g>
        <g fill='#61DAFB'>
          <rect x='0' y='0' width={width} height={height} mask='url(#mask-path)' fill='#464766' fillOpacity='0.6' />
        </g>
      </svg>
    </div>
  )
}

export default FanCropVisualizer
