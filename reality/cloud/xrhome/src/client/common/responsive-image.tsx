import React from 'react'

interface IResponsiveImage extends Omit<React.HTMLAttributes<HTMLImageElement>, 'src'> {
  sizeSet: Record<string, string>
  width: number
  alt: string
}

const ResponsiveImage: React.FunctionComponent<IResponsiveImage> = ({
  width, sizeSet, alt, ...rest
}) => {
  if (!sizeSet) {
    return null
  }
  const pixelRatio = (typeof window !== 'undefined' && window.devicePixelRatio) || 1
  const desiredWidth = pixelRatio * width
  const numericSizes = Object.keys(sizeSet).map(Number).sort((a, b) => a - b)
  const pickedSize = numericSizes.find(s => s >= desiredWidth) ||
    numericSizes[numericSizes.length - 1]

  return <img width={width} alt={alt} src={sizeSet[pickedSize]} {...rest} />
}

export default ResponsiveImage

export type {IResponsiveImage}
