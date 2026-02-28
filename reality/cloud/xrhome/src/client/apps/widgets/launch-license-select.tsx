import * as React from 'react'
import {Label, Menu} from 'semantic-ui-react'
import {useTranslation, Trans} from 'react-i18next'

import {useLicenseMetadata} from '../../contracts/contract-pricing-formatter'
import {formatToCurrency} from '../../../shared/billing/currency-formatter'
import '../../static/styles/licenses.scss'
import {calculateSavingsBetweenLicenses, type ILicensePackage} from '../../contracts/contract-utils'
import {CornerRibbon} from '../../uiWidgets/corner-ribbon'

const LAUNCH_LICENSE_SKIP = 'SKIP'

const StandardOption = ({isDefaultContract, license, index, licenses}) => {
  const {t} = useTranslation(['app-pages'])
  const {
    invoicePrice,
    invoiceIntervalText,
    subscriptionPrice,
    subscriptionIntervalText,
    viewsIncluded,
    perViewPrice,
  } = useLicenseMetadata(license)
  // Only display "BEST VALUE" label for the default contract pricing plans
  let bestValue = false
  let savingsText = null
  if (isDefaultContract) {
    bestValue = index === licenses.length - 1  // Mark the highest price license as "BEST VALUE"
    if (index === 0) {
      // Cheapest, $0 savings
      savingsText = (
        <p className='saving-price-zero'>
          <b>
            {t('purchase_license_page.launch_license_select.savings_zero')}
          </b>
        </p>
      )
    } else {
      const baseLicense = licenses[0]
      const savings = calculateSavingsBetweenLicenses(baseLicense, license)
      const savingsInCurrency = formatToCurrency(
        savings,
        {decimalPlaces: savings % 100 === 0 ? 0 : 2}
      )
      const interval = baseLicense.subLicense.interval.toLowerCase()
      savingsText = (
        <p className='saving-price'>
          <Trans
            ns='app-pages'
            i18nKey='purchase_license_page.launch_license_select.save_amount'
          >
            save <b>{{savingsInCurrency}} / {{interval}}</b>
          </Trans>
        </p>
      )
    }
  }
  const licenseName = (license && license.name) || ''
  const formattedLicenseName = licenseName.includes('|')
    ? (
      <span>{
      licenseName.split('|')[0]} <Label color='purple'>{licenseName.split('|')[1]}</Label>
      </span>
    )
    : licenseName

  const invoiceText = invoicePrice
    ? (
      <p>
        <span>{invoicePrice.replace(/\D00$/, '')}</span> {invoiceIntervalText}
      </p>
    )
    : null
  const viewsIncludedText = viewsIncluded
    ? (
      <Trans
        ns='app-pages'
        i18nKey='purchase_license_page.launch_license_select.views_included'
      >
        <span>{{viewsIncluded}}</span> <strong>views</strong> included
      </Trans>
    )
    : null

  return (
    <div className='descriptive-option-new'>
      <div>
        {bestValue &&
          <p className='best-value-ribbon'>
            {t('purchase_license_page.launch_license_select.ribbon_best_value')}
          </p>
        }
        <h4>{formattedLicenseName}</h4>
      </div>
      <div className='price'>
        {invoiceText}
        <p>
          <span>{subscriptionPrice.replace(/\D00$/, '')}</span> {subscriptionIntervalText}
        </p>
      </div>
      {license.subLicense?.stripeUsagePlanId &&
        <>
          <div className='views-included'>
            <p>
              {viewsIncludedText}
            </p>
          </div>
          <div><p>({perViewPrice})</p></div>
        </>
      }
      {!license.subLicense?.stripeUsagePlanId && savingsText && <div>{savingsText}</div>
      }
    </div>
  )
}

const createStandardOption = isDefaultContract => (license, index, licenses) => {
  const optionText = (
    <StandardOption
      isDefaultContract={isDefaultContract}
      license={license}
      index={index}
      licenses={licenses}
    />
  )

  return ({
    key: license.subLicense.uuid,
    value: license.subLicense.uuid,
    text: optionText,
    content: optionText,
  })
}

interface ILaunchLicenseSelectProp {
  isDefaultContract?: boolean  // Only display "Best Value" label for the default
  licenses: ILicensePackage[]
  onLicenseSelected?(license: ILicensePackage): void
  allowSkip?: boolean  // allow the user to skip the selection
  defaultValue?: string  // uuid of the default picked launch license
  disabled?: boolean  // view only mode
}

const LaunchLicenseSelect: React.FC<ILaunchLicenseSelectProp> = ({
  isDefaultContract = false, licenses, onLicenseSelected,
  allowSkip = true, defaultValue, disabled = false,
}) => {
  const {t} = useTranslation(['app-pages', 'billing'])
  const [activeItem, setActiveItem] = React.useState(defaultValue)

  if (!licenses || licenses.length === 0) {
    return null
  }

  // Sort the license by the price and mark the highest as the "BEST VALUE"
  if (licenses.length > 1) {
    licenses.sort((l1, l2) => l1.subLicense?.amount - l2.subLicense?.amount)
  }
  const licenseOptions = licenses.map(createStandardOption(isDefaultContract))
  if (allowSkip) {
    // Add an option for nothing
    licenseOptions.push({
      key: LAUNCH_LICENSE_SKIP,
      value: LAUNCH_LICENSE_SKIP,
      text: <em>Skip for now - I&apos;ll decide later.</em>,
      content: <em>Skip for now - I&apos;ll decide later.</em>,
    })
  }

  const onChange = (licenseUuid) => {
    const license = licenses.find(l => l.subLicense.uuid === licenseUuid)
    setActiveItem(licenseUuid)
    onLicenseSelected?.(license)
  }

  if (!activeItem && defaultValue) {
    onChange(defaultValue)
  }

  return (
    <Menu fluid vertical className='app-license-select'>
      {licenseOptions.map(l => (
        <Menu.Item
          key={l.key}
          name={l.value}
          active={activeItem === l.value}
          onClick={(ev, data) => onChange(data.name || data.value)}
          disabled={disabled}
        >
          {activeItem === l.value &&
              activeItem !== LAUNCH_LICENSE_SKIP &&
                <CornerRibbon
                  color='purple'
                  location='top-right'
                  size='tiny'
                  className='strong'
                >
                  {t('purchase_license_page.launch_license_select.corner_ribbon.selected')}
                </CornerRibbon>
            }
          {l.content}
        </Menu.Item>
      ))}
    </Menu>
  )
}

export {LaunchLicenseSelect, LAUNCH_LICENSE_SKIP}
