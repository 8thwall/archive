import {useEffect, useState} from 'react'

/**
 * Sample usage:
 *
 * const Component = () => {
 *   const imgSrc = https://cdn.8thwall.com/images/discovery/hero/abc123
 *   const loadedImg = useProgressiveImg(imgSrc)
 *   return <img src={loadedImg || placeholder} />
 * }
 *
 * @param src The original image source.
 * @returns Returns null if the image is loading or the original image source.
 */
const useLoadedImage = (src: string) => {
  const [sourceLoaded, setSourceLoaded] = useState<string>(null)

  useEffect(() => {
    setSourceLoaded(null)
    const img = new Image()
    img.src = src
    img.onload = () => setSourceLoaded(src)
  }, [src])

  return sourceLoaded
}

export {
  useLoadedImage,
}
