import React from 'react'
import ReactMarkdown from 'react-markdown'

import {MarkdownLinkVideo} from './markdown-link-video'

interface IFreeformMarkdownPreview {
  className?: string
  children: string
}

const FreeformMarkdownPreview: React.FC<IFreeformMarkdownPreview> = ({
  children, className,
}) => (
  <ReactMarkdown source={children} className={className} renderers={{link: MarkdownLinkVideo}} />
)

export {FreeformMarkdownPreview}
