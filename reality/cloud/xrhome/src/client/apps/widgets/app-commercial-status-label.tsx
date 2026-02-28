import * as React from 'react'

import CommercialLicenseLabel from './commercial-license-label'

/**
 * Convenience component for displaying a CommercialLicenseLabel for the
 * commercial status of an app.
 */
const AppCommercialStatusLabel = ({app, className = ''}) => {
  if (!app?.commercialStatus || app?.commercialStatus === 'LAUNCH') {
    return null
  }

  return (
    <CommercialLicenseLabel className={className} licenseType={app.commercialStatus} />
  )
}

export default AppCommercialStatusLabel
