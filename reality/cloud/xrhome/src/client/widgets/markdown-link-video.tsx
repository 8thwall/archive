import React from 'react'

import {EmbedVideoComponent, parseVideo} from '../../shared/markdown-videos'
import {StandardLink} from '../ui/components/standard-link'

const MarkdownLinkVideo = ({children, href, ...props}) => {
  if (children.length === 1) {
    const video = parseVideo(href)
    if (video) {
      return (
        <EmbedVideoComponent
          {...props}
          type={video.type}
          video={video.id}
        />
      )
    }
  }
  return <StandardLink href={href} {...props}>{children}</StandardLink>
}

export {MarkdownLinkVideo}
