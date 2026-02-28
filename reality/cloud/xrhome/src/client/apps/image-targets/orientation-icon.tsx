import * as React from 'react'

import portraitIcon from '../../static/portrait.png'
import landscapeIcon from '../../static/landscape.png'
import conicalPortraitIcon from '../../static/curvedOrientationPortrait.svg'
import conicalLandscapeIcon from '../../static/curvedOrientationLandscape.svg'
import type {enum_ImageTargets_type as ImageTargetsType} from '../../common/types/db'

const PlanarOrientationIcon = ({isLandscape = false, className = null}) => (
  <img
    className={className}
    src={isLandscape ? landscapeIcon : portraitIcon}
    alt={`${isLandscape ? 'Landscape' : 'Portrait'} icon`}
  />
)

const ConicalOrientationIcon = ({isLandscape = false, className = null}) => (
  <img
    className={className}
    src={isLandscape ? conicalLandscapeIcon : conicalPortraitIcon}
    alt={`${isLandscape ? 'Landscape' : 'Portrait'} icon`}
  />
)

interface IOrientationIcon {
  isLandscape: boolean
  type?: ImageTargetsType
  className?: string
}
const OrientationIcon: React.FunctionComponent<IOrientationIcon> = ({
  isLandscape = false, type = 'PLANAR', className = null,
}) => (
  (type === 'CONICAL' || type === 'CYLINDER')
    ? (
      <ConicalOrientationIcon isLandscape={isLandscape} className={className} />
    )
    : (
      <PlanarOrientationIcon isLandscape={isLandscape} className={className} />
    )
)

export default OrientationIcon
