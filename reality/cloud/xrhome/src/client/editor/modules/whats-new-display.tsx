import React from 'react'

import type {VersionInfo} from '../../../shared/module/module-target-api'
import {getVersionSpecifier} from '../../../shared/module/module-version-patches'
import FeaturedDescriptionRenderer from '../../apps/widgets/featured-description-renderer'
import {createThemedStyles} from '../../ui/theme'
import AutoHeading from '../../widgets/auto-heading'
import AutoHeadingScope from '../../widgets/auto-heading-scope'

const useStyles = createThemedStyles(theme => ({
  versionInfo: {
    color: theme.fgMuted,
  },
}))

interface IWhatsNew {
  recentVersion: VersionInfo
}

const WhatsNew: React.FC<IWhatsNew> = ({recentVersion}) => {
  const classes = useStyles()
  return (
    <div>
      <AutoHeadingScope>
        <AutoHeading>
          What&apos;s New
        </AutoHeading>
        <p className={classes.versionInfo}>
          Version {getVersionSpecifier(recentVersion.patchTarget)}
        </p>
        <FeaturedDescriptionRenderer source={recentVersion.versionDescription} />
      </AutoHeadingScope>
    </div>
  )
}

export {WhatsNew}
