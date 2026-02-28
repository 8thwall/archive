import React from 'react'

import type {AdditionalAssetData} from '../asset-preview-types'

interface IImagePreview {
  src: string
  alt: string
  onMoreData: (data: Pick<AdditionalAssetData, 'dimension'>) => void
}

const ImagePreview: React.FunctionComponent<IImagePreview> = ({src, alt, onMoreData}) => {
  const onLoad = (e) => {
    onMoreData({
      dimension: {
        width: e.target.naturalWidth,
        height: e.target.naturalHeight,
      },
    })
  }

  return (
    <img src={src} onLoad={onLoad} alt={alt} />
  )
}

interface IVideoPreview {
  src: string
  onMoreData: (data: Pick<AdditionalAssetData, 'dimension' |'duration'>) => void
}

const VideoPreview: React.FunctionComponent<IVideoPreview> = ({src, onMoreData}) => {
  const onLoadedMetadata = (e) => {
    onMoreData({
      dimension: {
        width: e.target.videoWidth,
        height: e.target.videoHeight,
      },
      duration: e.target.duration,
    })
  }

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video controls src={src} onLoadedMetadata={onLoadedMetadata} />
  )
}

interface IAudioPreview {
  src: string
  onMoreData: (data: Pick<AdditionalAssetData, 'duration'>) => void
}

const AudioPreview: React.FunctionComponent<IAudioPreview> = ({src, onMoreData}) => {
  const onLoadedMetadata = (e) => {
    onMoreData({
      duration: e.target.duration,
    })
  }

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio controls src={src} onLoadedMetadata={onLoadedMetadata} />
  )
}

export {
  ImagePreview,
  VideoPreview,
  AudioPreview,
}
