import React, {useState, useEffect} from 'react'
import {useHistory, Redirect} from 'react-router-dom'
import {Button, Dimmer} from 'semantic-ui-react'
import {join} from 'path'
import {useTranslation, Trans} from 'react-i18next'

import {useSelector} from '../../hooks'
import {
  getPathPrefixForLicensePurchase, PurchaseLicensePathEnum, getPathForAccount, AccountPathEnum,
} from '../../common/paths'
import contractActions from '../../contracts/contract-actions'
import invoiceActions from '../../invoices/actions'
import appsBillingActions from '../../billing/apps-billing-actions'
import {formatToCurrency} from '../../../shared/billing/currency-formatter'
import {getDefaultPaymentMethod} from '../../billing/billing-utils'
import {getAppStatusUpgrade, isPaidCommercial} from '../../../shared/app-utils'
import {
  usePerViewMetadata, useSubscriptionPaymentInterval, getFormattedAmountDue,
  useInvoicePaymentInterval,
} from '../../contracts/contract-pricing-formatter'
import {
  isContractAccepted,
  isActiveDefaultContract,
  areInvoicePaymentsAllowed,
} from '../../../shared/contract-utils'
import {addTimeWithInterval} from '../../../shared/add-time-with-interval'
import {convertLicensesToPackages} from '../../contracts/contract-utils'
import {combine} from '../../common/styles'
import ButtonLink from '../../uiWidgets/button-link'
import StripeLock from '../../uiWidgets/stripe-lock'
import useStyles from './web-app-upgrade-jss'
import WebAppUpgradePaymentOptions from './web-app-upgrade-payment-options'
import {UpgradePaymentType} from './web-app-upgrade-payment'
import AddPaymentMethod from '../../billing/payment-method/add-payment-method'
import WebAppUpgradeCommercialAgreementField from './web-app-upgrade-commerical-agreement-field'
import WebAppUpgradeLicenseSelectField from './web-app-upgrade-license-select-field'
import WebAppUpgradeTerms from './web-app-upgrade-terms'
import PurchaseLicenseFormLayout from './purchase-license-form-layout'
import ColoredMessage from '../../messages/colored-message'
import ErrorMessage from '../widgets/error-message'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import useActions from '../../common/use-actions'
import {stripeTimeToDate} from '../../../shared/time-utils'
import useCurrentApp from '../../common/use-current-app'
import useCurrentAccount from '../../common/use-current-account'
import {useAppPathsContext} from '../../common/app-container-context'
import LinkOut from '../../uiWidgets/link-out'
import {Loader} from '../../ui/components/loader'
import {Icon} from '../../ui/components/icon'

interface IWebAppUpgrade {
  isRecurring: boolean
}

// TODO(Brandon): Stop passing isRecurring once we move to white label licenses, since this
// prop will no longer be supported.
const WebAppUpgrade: React.FC<IWebAppUpgrade> = ({isRecurring}) => {
  const app = useCurrentApp()
  const account = useCurrentAccount()

  const {getPathForApp} = useAppPathsContext()
  const contracts = useSelector(s => s.contracts.availableContracts)
  const userLicenses = useSelector(s => s.contracts.userLicenses)
  const appContract = useSelector(s => (
    app?.ContractUuid && s.contracts.allContracts?.find(c => c.uuid === app?.ContractUuid)
  ))
  const defaultPaymentMethod = useSelector(s => getDefaultPaymentMethod(s))
  const upcomingAppLicenseInvoicePreview = useSelector(
    s => s.invoices.upcomingAppLicenseInvoicePreview
  )
  const isLoadingInvoicePreview = useSelector(
    s => s.invoices.pending.upcomingAppLicenseInvoicePreview
  )
  const hasErrorWithInvoicePreview = useSelector(
    s => s.invoices.error.upcomingAppLicenseInvoicePreview
  )

  const {upgradeAppWithContracts} = useActions(appsBillingActions)
  const {getLicensesForContractCreation, getLicensesForAppUpgrade} = useActions(contractActions)
  const {getUpcomingAppLicenseInvoicePreview} = useActions(invoiceActions)

  const {t, i18n} = useTranslation(['app-pages', 'common'])
  const [selectedContractUuid, setSelectedContractUuid] = useState(null)
  const [selectedContract, setSelectedContract] = useState(selectedContractUuid &&
    contracts.find(c => c.uuid === selectedContractUuid))
  const [selectedLaunchLicense, setSelectedLaunchLicense] = useState(null)
  const [targetLicense, setTargetLicense] = useState(null)
  const [paymentSource, setPaymentSource] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showRecurringMessage, setShowRecurringMessage] = useState<boolean>(false)
  const contractsLoading = useSelector(state => state.contracts.pending) || contracts.length < 1
  const launchLicenses = convertLicensesToPackages(userLicenses).filter(l => l.type === 'CAMPAIGN')
  const {getAvailableContractsForApp} = useActions(contractActions)
  const [isMissingBillingInfo, setIsMissingBillingInfo] = useState(false)

  const classes = useStyles()
  const history = useHistory()

  useAbandonableEffect(async (executor) => {
    await executor(getAvailableContractsForApp(app.uuid))
  }, [])

  useEffect(() => {
    if (paymentSource?.type === UpgradePaymentType.INVOICE &&
      !areInvoicePaymentsAllowed(account, selectedContract)) {
      // User previously selected an invoice payment type, however, they've now switched to a
      // contract which does not allow for invoice payments. Clear the payment selection
      // to force the user to select a new source.
      setPaymentSource(null)
    }

    if (selectedContract?.isRecurringContract && !isRecurring) {
      setShowRecurringMessage(true)
    }

    if (showRecurringMessage && !selectedContract?.isRecurringContract) {
      setShowRecurringMessage(false)
    }
  }, [selectedContract])

  useEffect(() => {
    if (getAppStatusUpgrade(app) === 'LAUNCH' && !!app.ContractUuid) {
      getLicensesForAppUpgrade(app.uuid)
    }
  }, [])

  useEffect(() => {
    if (getAppStatusUpgrade(app) === 'LAUNCH' && launchLicenses?.length === 1) {
      setSelectedLaunchLicense(launchLicenses[0])
    } else if (!selectedLaunchLicense) {
      setSelectedLaunchLicense(launchLicenses.find(l => l.packageId === app.launchPackageId))
    }
  }, [userLicenses])

  useEffect(() => {
    setSelectedContract(selectedContractUuid &&
      contracts.find(c => c.uuid === selectedContractUuid))
  }, [contracts])

  useEffect(() => {
    setTargetLicense(selectedLaunchLicense)

    if (selectedLaunchLicense) {
      const launchLicense =
        selectedLaunchLicense.invoiceLicense || selectedLaunchLicense.subLicense
      const prices =
        [launchLicense.stripeSubPlanId, launchLicense.stripeUsagePlanId].filter(Boolean)
      getUpcomingAppLicenseInvoicePreview(account, prices)
    }
  }, [selectedLaunchLicense])

  useEffect(() => {
    if (!paymentSource && defaultPaymentMethod) {
      setPaymentSource({type: UpgradePaymentType.IMMEDIATE, sourceId: defaultPaymentMethod.id})
    }
  }, [defaultPaymentMethod])

  const updateSelectedContract = (newSelectedContractUuid) => {
    const isADifferentContract = newSelectedContractUuid !== selectedContractUuid
    const newSelectedContract = contracts.find(c => c.uuid === newSelectedContractUuid)
    setSelectedContractUuid(newSelectedContractUuid)
    setSelectedContract(newSelectedContract)
    setSelectedLaunchLicense(isADifferentContract ? null : selectedLaunchLicense)

    getLicensesForContractCreation(newSelectedContract)
  }

  useEffect(() => {
    if (!selectedContractUuid && !app?.ContractUuid && contracts?.length === 1) {
      updateSelectedContract(contracts[0].uuid)
    }
  }, [selectedContractUuid, contracts])

  useEffect(() => {
    if (app?.ContractUuid &&
      contracts.some(contract => contract.uuid === app?.ContractUuid)) {
      updateSelectedContract(app.ContractUuid)
    }
  }, [contracts])

  const onLaunchLicenseSelect = (license) => {
    setSelectedLaunchLicense(license)
  }

  const onCancel = () => {
    history.push(getPathForApp())
  }

  const onThankYou = () => {
    history.push({
      pathname: join(
        getPathPrefixForLicensePurchase(account, app),
        PurchaseLicensePathEnum.thankYou
      ),
      state: {
        currentStep: PurchaseLicensePathEnum.thankYou,
        selectedLicense: targetLicense,
      },
    })
  }

  const onPurchaseComplete = async () => {
    setIsMissingBillingInfo(false)
    setLoading(true)

    try {
      await upgradeAppWithContracts(
        app.uuid,
        null,
        paymentSource.sourceId,
        targetLicense.subLicense.uuid,
        targetLicense.invoiceLicense && targetLicense.invoiceLicense.uuid,
        targetLicense.tiers && targetLicense.tiers.map(tier => tier.uuid),
        isRecurring
      )
      onThankYou()
    } catch (err) {
      if (err.status === 422) {  // Currently only for the unrecognized location error for now
        setIsMissingBillingInfo(true)
      }
      setLoading(false)
    }
  }

  const canCompletePurchase = () => {
    const statusUpgrade = getAppStatusUpgrade(app)

    // Terms of the contract must have been accepted before purchases are allowed.
    // This checks for unpaid commercial to paid commercial upgrade. Legacy upgrades from
    // DEVELOP to LAUNCH assume the contract is already accepted.
    if (statusUpgrade === 'LAUNCH' && !app.ContractUuid && !isContractAccepted(selectedContract)) {
      return false
    }

    // Ensure a launch license is selected for launch upgrades.
    if (statusUpgrade === 'LAUNCH' && !selectedLaunchLicense) {
      return false
    }

    // The user needs to select a payment source before completing a purchase.
    if (!paymentSource) {
      return false
    }

    return true
  }

  const getLoaderText = () => t('purchase_license_page.web_app_upgrade.loading_text')
  const allowLicenseSelection =
    isContractAccepted(selectedContract || appContract) && launchLicenses.length > 0
  const allowPaymentSelection =
    isContractAccepted(selectedContract || appContract) && targetLicense
  const isMinimumPaymentContract = !!targetLicense?.invoiceLicense
  const subscriptionPaymentText = useSubscriptionPaymentInterval(selectedLaunchLicense)
  const invoicePaymentText = useInvoicePaymentInterval(selectedLaunchLicense)
  const {perViewPrice} = usePerViewMetadata(targetLicense)

  if (isPaidCommercial(app) && !loading) {
    return <Redirect to={getPathForApp()} />
  }

  let itemizedCharges
  if (isLoadingInvoicePreview) {
    itemizedCharges = <Loader inline />
  } else if (selectedLaunchLicense &&
    !hasErrorWithInvoicePreview && upcomingAppLicenseInvoicePreview) {
    const appLicenseSubtotal = formatToCurrency(upcomingAppLicenseInvoicePreview?.subtotal)
    const appLicenseTax = formatToCurrency(upcomingAppLicenseInvoicePreview?.tax)
    const appLicenseChargeText = paymentSource?.type === UpgradePaymentType.INVOICE
      ? t('purchase_license_page.launch_license_select.total_invoiced_today',
        {priceAmount: formatToCurrency(upcomingAppLicenseInvoicePreview?.total)})
      : t('purchase_license_page.launch_license_select.total_due_today',
        {priceAmount: formatToCurrency(upcomingAppLicenseInvoicePreview?.total)})

    // Note(wayne): Use Stripe invoice line item to define the next charge time and amount
    // Otherwise, get/calculate them the original way from targetLicense
    const invoiceLineItems = upcomingAppLicenseInvoicePreview.lines.data
    const planLineItem = invoiceLineItems.find(
      line => line.price.id === targetLicense?.subLicense.stripeSubPlanId
    )
    let nextChargeTimeText
    let nextChargeAmountText
    if (planLineItem) {
      nextChargeTimeText = new Intl.DateTimeFormat(i18n.language, {dateStyle: 'long'})
        .format(stripeTimeToDate(planLineItem.period.end))
      nextChargeAmountText = formatToCurrency(planLineItem.amount)
    } else {
      const nextChargeTime = targetLicense && addTimeWithInterval(
        new Date(), targetLicense.subLicense?.interval, targetLicense.subLicense?.intervalCount
      )
      nextChargeTimeText = nextChargeTime
        ? new Intl.DateTimeFormat(i18n.language, {dateStyle: 'long'}).format(nextChargeTime)
        : ''
      nextChargeAmountText = targetLicense ? getFormattedAmountDue(targetLicense) : ''
    }

    const nextCharge = (
      <p>
        <i>
          <b>
            {paymentSource?.type === UpgradePaymentType.INVOICE
              ? t('purchase_license_page.web_app_upgrade.next_invoice_on', {nextChargeTimeText})
              : t('purchase_license_page.web_app_upgrade.next_charge_on', {nextChargeTimeText})}
          </b>{' '}
          <span>{nextChargeAmountText} </span>
          {targetLicense?.subLicense?.stripeUsagePlanId &&
            <span>+ {perViewPrice} </span>
          }
          <span>+ {t('purchase_license_page.web_app_upgrade.plus_tax')}</span>
        </i>
      </p>
    )

    itemizedCharges = (
      <>
        <h4>
          {t('purchase_license_page.launch_license_select.subscription_amount')}{' '}
          {appLicenseSubtotal} {invoicePaymentText || subscriptionPaymentText}
        </h4>
        <h4>{t('purchase_license_page.launch_license_select.tax_amount', {appLicenseTax})}</h4>
        <h2>{appLicenseChargeText}</h2>
        {!isMinimumPaymentContract && nextCharge}
      </>
    )
  } else {
    // NOTE(wayne): Ideally we should never get here
    // if the customer billing address and plan tax_behavior are set correctly
    itemizedCharges = (
      <ErrorMessage icon='exclamation'>
        {t('purchase_license_page.web_app_upgrade.button.error_itemized_charges')}
      </ErrorMessage>
    )
  }

  return (
    <>
      {contractsLoading &&
        <PurchaseLicenseFormLayout>
          <div className={classes.contractsPending}>
            <Loader inline />
          </div>
        </PurchaseLicenseFormLayout>
      }
      {!contractsLoading &&
        <PurchaseLicenseFormLayout>
          <WebAppUpgradeCommercialAgreementField
            selectedContract={selectedContract}
            onContractSelect={updateSelectedContract}
            onCancel={onCancel}
          />
          {showRecurringMessage && allowLicenseSelection &&
            <ColoredMessage className={classes.coloredMessage} color='blue'>
              <p>
                <Trans
                  ns='app-pages'
                  i18nKey='purchase_license_page.web_app_upgrade.button.integration_project_type'
                >
                  You have selected an agreement that is related to an Integration project type.
                  Your project will be changed
                  from &ldquo;Campaign&rdquo; to <b>&ldquo;Integration&rdquo;.</b>
                </Trans>
              </p>
            </ColoredMessage>
          }
          {allowLicenseSelection &&
            <WebAppUpgradeLicenseSelectField
              isDefaultContract={isActiveDefaultContract(selectedContract || appContract)}
              licenses={launchLicenses}
              onLicenseSelect={onLaunchLicenseSelect}
              defaultValue={selectedLaunchLicense && selectedLaunchLicense.subLicense.uuid}
            />
          }

          {allowPaymentSelection &&
            <>
              <WebAppUpgradePaymentOptions
                appContract={selectedContract || appContract}
                selectedSource={paymentSource}
                onPaymentSourceSelect={s => setPaymentSource(s)}
              />
              <AddPaymentMethod />

              <div className={classes.planCharge}>
                {itemizedCharges}
              </div>
              <WebAppUpgradeTerms targetLicense={targetLicense} />
            </>
          }
          {/* eslint-disable local-rules/hardcoded-copy */}
          {isMissingBillingInfo &&
            <ColoredMessage
              className={classes.coloredMessage}
              color='red'
              iconName='exclamation circle'
            >
              <div className={classes.coloredMessageContent}>
                {t('purchase_license_page.colored_message.error_missing_billing_information')}
                <LinkOut
                  className={classes.linkOut}
                  url={getPathForAccount(account, AccountPathEnum.account)}
                >
                  {t('purchase_license_page.colored_message.billing_information_link_out')}&nbsp;
                  <Icon stroke='external' inline />
                </LinkOut>
              </div>
            </ColoredMessage>
          }
          {/* eslint-enable local-rules/hardcoded-copy */}
          {allowLicenseSelection &&
            <div className={classes.action}>
              <div className={classes.left}>
                <Button
                  className={combine('offset-shadow', classes.actionButton)}
                  primary
                  type='submit'
                  onClick={onPurchaseComplete}
                  disabled={!canCompletePurchase()}
                  a8='click;xr-home-upgrade;complete-purchase-cta'
                >
                  {t('purchase_license_page.web_app_upgrade.button.complete_purchase')}
                </Button>
                <ButtonLink
                  className={combine(classes.simpleActionButton, classes.cancelButton)}
                  onClick={onCancel}
                  a8='click;xr-home-upgrade;cancel-cta'
                >
                  {t('button.cancel', {ns: 'common'})}
                </ButtonLink>
              </div>
              <div className={classes.right}>
                <StripeLock />
              </div>
            </div>
          }
        </PurchaseLicenseFormLayout>
      }
      <Dimmer active={loading} inverted>
        <Loader>{getLoaderText()}</Loader>
      </Dimmer>
    </>
  )
}

export default WebAppUpgrade
