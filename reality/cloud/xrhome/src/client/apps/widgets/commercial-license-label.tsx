import * as React from 'react'
import type {FunctionComponent} from 'react'
import {Label, SemanticSIZES} from 'semantic-ui-react'

import '../../static/styles/licenses.scss'
import type {AppCommercialStatus} from '../../common/types/db'

interface LicenseLabelProps {
  /** Additional classes. */
  className?: string

  /* A label can take the width of its container. */
  fluid?: boolean

  /* A label requires a type of license. */
  licenseType: AppCommercialStatus

  /**
   * Called after user's click.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, data: any) => void

  /* A label can have different sizes. */
  size?: SemanticSIZES
}

const CommercialLicenseLabel: FunctionComponent<LicenseLabelProps> =
  ({className, fluid, licenseType, onClick, size}) => (
    <Label
      className={`${className || ''} ${licenseType} thin-label ${fluid ? 'fluid' : ''}`}
      onClick={onClick}
      size={size}
    >
      {licenseType}
    </Label>
  )

export default CommercialLicenseLabel
