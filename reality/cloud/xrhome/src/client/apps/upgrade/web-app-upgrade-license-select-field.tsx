import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import type {ILicensePackage} from '../../contracts/contract-utils'
import {gray4} from '../../static/styles/settings'
import {LaunchLicenseSelect} from '../widgets/launch-license-select'

const useProjectSelectStyles = createUseStyles({
  taxApplicable: {
    color: gray4,
    fontStyle: 'italic',
    lineHeight: '20px',
  },
})

interface Props {
  isDefaultContract?: boolean
  licenses: ILicensePackage[]
  onLicenseSelect: (license: ILicensePackage) => void
  defaultValue: string
}

const WebAppUpgradeLicenseSelectField: React.FC<Props> = ({
  isDefaultContract,
  licenses,
  onLicenseSelect,
  defaultValue,
}) => {
  const {t} = useTranslation(['app-pages'])
  const styles = useProjectSelectStyles()
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        {t('purchase_license_page.web_app_upgrade_subscription_select_field.label')}
      </label>
      <p>
        {t('purchase_license_page.web_app_upgrade_subscription_select_field.description')}
      </p>
      <LaunchLicenseSelect
        isDefaultContract={isDefaultContract}
        licenses={licenses}
        onLicenseSelected={onLicenseSelect}
        allowSkip={false}
        defaultValue={defaultValue}
      />
      <p className={styles.taxApplicable}>
        {t('purchase_license_page.web_app_upgrade_license_select_field.tax')}
      </p>
    </>
  )
}

export default WebAppUpgradeLicenseSelectField
