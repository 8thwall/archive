import React from 'react'

import FeaturedDescriptionRenderer from '../apps/widgets/featured-description-renderer'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import FeaturedContentBlock from './widgets/featured-content-block'

interface IFeaturedDescriptionDisplay {
  featuredDescriptionText: string
  isModuleOverview?: boolean
}

const FeaturedDescriptionDisplay: React.FC<IFeaturedDescriptionDisplay> = ({
  featuredDescriptionText, isModuleOverview,
}) => (
  <FeaturedContentBlock>
    <AutoHeadingScope>
      <FeaturedDescriptionRenderer
        source={featuredDescriptionText}
        isModuleOverview={isModuleOverview}
      />
    </AutoHeadingScope>
  </FeaturedContentBlock>
)

export default FeaturedDescriptionDisplay
