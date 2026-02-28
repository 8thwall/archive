import React from 'react'
import ReactMarkdown, {NodeType} from 'react-markdown'

import AutoHeading from '../../widgets/auto-heading'
import {MarkdownLinkVideo} from '../../widgets/markdown-link-video'

const allowedTypes: NodeType[] = [
  'root', 'text', 'break', 'paragraph', 'emphasis', 'strong', 'heading', 'list', 'listItem',
]

interface IFeaturedDescriptionRenderer {
  source: string
  headingClassName?: string
  isModuleOverview?: boolean
}

const FeaturedDescriptionRenderer: React.FC<IFeaturedDescriptionRenderer> = ({
  source, headingClassName, isModuleOverview: moduleOverview,
}) => (
  <ReactMarkdown
    source={source}
    allowedTypes={moduleOverview ? allowedTypes.concat('link') : allowedTypes}
    unwrapDisallowed
    renderers={{
      heading: props => <AutoHeading {...props} className={headingClassName} />,
      link: moduleOverview && MarkdownLinkVideo,
    }}
  />
)

export default FeaturedDescriptionRenderer
