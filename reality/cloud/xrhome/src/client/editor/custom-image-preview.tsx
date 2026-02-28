import * as React from 'react'

import {loadHdr} from '../../third_party/rgbe-loader/load-hdr'
import {fileExt} from './editor-common'
import type {AdditionalAssetData} from './asset-preview-types'

interface ImagePreviewData {
  width: number
  height: number
  image?: ImageData
}

const NO_DATA: ImagePreviewData = {width: 0, height: 0, image: null}

// Call different loaders for custom images to image data based on file extension.
const loadCustomImage = (url) => {
  const ext = fileExt(url)
  if (ext === 'hdr') {
    return loadHdr(url)
  }

  return Promise.resolve(NO_DATA)
}

interface ICustomImagePreview {
  src: string
  onMoreData: (data: Pick<AdditionalAssetData, 'dimension'>) => void
  onAssetLoad?: () => void
}

const CustomImagePreview: React.FC<ICustomImagePreview> = ({src, onMoreData, onAssetLoad}) => {
  const [imageData, setImageData] = React.useState<ImagePreviewData>(NO_DATA)

  const canvasRef = React.useCallback((node) => {
    if (node === null) {
      return
    }
    node.width = imageData.width
    node.height = imageData.height
    if (imageData.image) {
      const ctx = node.getContext('2d')
      ctx.putImageData(imageData.image, 0, 0)
    }
    if (imageData.width && imageData.height) {
      onMoreData({
        dimension: {
          width: imageData.width,
          height: imageData.height,
        },
      })
      onAssetLoad?.()
    }
  }, [imageData])

  React.useEffect(() => {
    loadCustomImage(src)
      .catch((e) => {
        console.warn(`Failed to load ${src}.`)
        console.error(e)
        return NO_DATA
      })
      .then(res => setImageData(res))
  }, [src])

  return (
    <canvas ref={canvasRef} />
  )
}

export default CustomImagePreview
