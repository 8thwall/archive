import React from 'react'
import {createUseStyles} from 'react-jss'
import {useHistory} from 'react-router-dom'
import {Button, Header} from 'semantic-ui-react'
import {useTranslation, Trans} from 'react-i18next'

import {getDisplayNameForApp} from '../../../shared/app-utils'
import {stripeTimeToDate} from '../../../shared/time-utils'
import {FluidCardContainer, FluidCardContent} from '../../widgets/fluid-card'
import {
  brandPurple, headerSanSerif, mobileViewOverride, tinyViewOverride,
} from '../../static/styles/settings'
import {standardizeStripeSource, getPaymentMethods} from '../../billing/billing-utils'
import {formatToCurrency} from '../../../shared/billing/currency-formatter'
import {useLicenseMetadata} from '../../contracts/contract-pricing-formatter'
import LinkOut from '../../uiWidgets/link-out'
import type {ILicensePackage} from '../../contracts/contract-utils'
import {useSelector} from '../../hooks'
import useCurrentApp from '../../common/use-current-app'
import {useAppPathsContext} from '../../common/app-container-context'

const useStyles = createUseStyles({
  rootContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0',
  },
  heading: {
    width: '100%',
  },
  title: {
    maxWidth: '22em',
    fontFamily: `${headerSanSerif} !important`,
    textAlign: 'center',
  },
  topContainer: {
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'center',
    'margin': '5em',
    '& h1': {
      '& span': {
        marginRight: '0.25em',
      },
    },
  },
  actionButton: {
    margin: '3em 0 !important',
  },
  purchaseSummary: {
    'width': '50rem',
    'padding': '2.5em !important',
    [mobileViewOverride]: {
      minWidth: '0',
      width: '70vw',
    },
    [tinyViewOverride]: {
      minWidth: '0',
      width: '80vw',
    },
    '& h3': {
      fontWeight: 'lighter !important',
      marginBottom: '0 !important',
    },
    '& h4': {
      marginBottom: '0 !important',
    },
  },
  campaignSchedule: {
    extend: 'purchaseSummary',
    marginTop: '1em !important',
  },
  contractLink: {
    color: 'inherit',
    textDecoration: 'underline',
  },
  totalContainer: {
    'margin-bottom': '1em',
    '& p': {
      'margin': '0',
    },
  },
  supportText: {
    'color': brandPurple,
    'margin-top': '2em',
    '& a': {
      fontWeight: 'bolder',
    },
  },
})

const PurchaseSummary = ({license}) => {
  const {t, i18n} = useTranslation(['app-pages'])
  const app = useCurrentApp()
  const classes = useStyles()
  const contract = useSelector(
    state => state.contracts.allContracts.find(c => c.uuid === app.ContractUuid)
  )
  const invoiceInfo = useSelector(state => state.billing.latestInvoiceInfo)
  const upcomingInvoiceInfo =
    useSelector(state => state.billing.upcomingAppLicenseInvoiceInfo)
  const {
    invoicePrice,
    invoiceIntervalText,
    subscriptionPrice,
    subscriptionIntervalText,
  } = useLicenseMetadata(license)
  const paymentMethod = useSelector(getPaymentMethods)?.find(
    pm => pm.id === invoiceInfo.paymentMethod
  )

  if (!license || !contract || !invoiceInfo || !upcomingInvoiceInfo) {
    return null
  }

  const licenseName = license.name || ''
  const formattedLicenseName = licenseName.includes('|')
    ? `${licenseName.split('|')[0]} ${licenseName.split('|')[1]}`
    : licenseName
  const rawInvoiceText = license.invoiceLicense
    ? `${invoicePrice} ${invoiceIntervalText}`
    : ''
  const invoiceText = rawInvoiceText ? `${rawInvoiceText}, ` : ''
  const priceText = license.subLicense ? `${subscriptionPrice} ${subscriptionIntervalText}` : ''
  const dueDateText = invoiceInfo.dueDate
    ? new Intl.DateTimeFormat(i18n.language, {dateStyle: 'long'})
      .format(stripeTimeToDate(invoiceInfo.dueDate))
    : ''
  const totalText = formatToCurrency(invoiceInfo.total)
  const pmInfo = paymentMethod ? standardizeStripeSource(paymentMethod) : null

  const isMinimumPaymentContract = !!license?.invoiceLicense
  const nextChargeTimeText = new Intl.DateTimeFormat(i18n.language, {dateStyle: 'long'})
    .format(stripeTimeToDate(upcomingInvoiceInfo.periodEnd))
  const nextChargeText = pmInfo
    ? t('purchase_license_page.purchase_summary.next_charge_on', {nextChargeTimeText})
    : t('purchase_license_page.purchase_summary.next_invoice_on', {nextChargeTimeText})

  return (
    <FluidCardContainer>
      <FluidCardContent className={classes.purchaseSummary}>
        <Header as='h3'>
          {t('purchase_license_page.purchase_summary.heading.purchase_summary')}
        </Header>
        <Header as='h4'>
          {t('purchase_license_page.purchase_summary.heading.project_title')}
        </Header>
        <p>{getDisplayNameForApp(app)}</p>
        <Header as='h4'>
          {t('purchase_license_page.purchase_summary.heading.subscription')}
        </Header>
        <p>{`${formattedLicenseName} - ${invoiceText}${priceText}`}</p>
        <Header as='h4'>
          {t('purchase_license_page.purchase_summary.heading.agreement')}
        </Header>
        <LinkOut className={classes.contractLink} url={contract.pdfSignedUrl}>
          {contract.name}
        </LinkOut>
        <Header as='h4'>
          {pmInfo
            ? t('purchase_license_page.purchase_summary.heading.payment_method')
            : t('purchase_license_page.purchase_summary.heading.invoice_due_date')
          }
        </Header>
        <p>
          {pmInfo
            ? `${pmInfo.name.toUpperCase()} XXXX-XXXX-XXXX-${pmInfo.last4}`
            : `${dueDateText}`
          }
        </p>
        <Header as='h4'>
          {pmInfo
            ? t('purchase_license_page.purchase_summary.heading.amount_charged')
            : t('purchase_license_page.purchase_summary.heading.amount_invoiced')
          }
        </Header>
        <div className={classes.totalContainer}>
          <p>{totalText}</p>
          {!isMinimumPaymentContract &&
            <p><i>{nextChargeText}</i></p>
          }
        </div>

        <p className={classes.supportText}>
          <Trans
            ns='app-pages'
            i18nKey='purchase_license_page.purchase_summary.contact_billing'
            components={{
              1: <LinkOut url='mailto:billing@8thwall.com' />,
            }}
          />
        </p>
      </FluidCardContent>
    </FluidCardContainer>
  )
}

const UpgradePaymentSuccessful = ({dashPath, license}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const history = useHistory()

  const onSubmit = () => {
    history.push(dashPath)
  }
  const titleText =
    t('purchase_license_page.upgrade_payment_successful.title_text.subscription')
  const actionButtonText =
    t('purchase_license_page.upgrade_payment_successful.button.return_dashboard')
  return (
    <div className={classes.topContainer}>
      <Header as='h1' className={classes.title}>
        <span role='img' aria-label='party popper'>🎉</span>
        {titleText}
      </Header>
      <Button
        primary
        className={classes.actionButton}
        onClick={onSubmit}
      >
        {actionButtonText}
      </Button>
      <PurchaseSummary license={license} />
    </div>
  )
}

const UpgradePaymentError = ({dashPath}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const history = useHistory()

  const onSubmit = () => {
    history.push(dashPath)
  }

  // TODO(Wayne): more sophisticated to check if there is a invoice or not. This is specifically
  // for the case that first free DEV license for WebBusiness account
  return (
    <div className={classes.topContainer}>
      <Header as='h1'>
        <span role='img' aria-label='error'>❌</span>
        {t('purchase_license_page.upgrade_payment_error.header.payment_failed')}
      </Header>
      <p>
        <Trans
          ns='app-pages'
          i18nKey='purchase_license_page.upgrade_payment_error.error_description'
          components={{
            2: <LinkOut url='mailto:billing@8thwall.com' />,
          }}
        />
      </p>
      <Button
        primary
        className={classes.actionButton}
        onClick={onSubmit}
      >
        {t('purchase_license_page.upgrade_payment_error.button.go_to_project_dashboard')}
      </Button>
    </div>
  )
}

interface IWebAppUpgradeConfirmation {
  license: ILicensePackage
}

const WebAppUpgradeConfirmation: React.FC<IWebAppUpgradeConfirmation> = ({
  license,
}) => {
  const appsPath = useAppPathsContext()
  const latestInvoiceInfo = useSelector(state => state.billing.latestInvoiceInfo)
  const hasInvoice = !!latestInvoiceInfo?.status
  const paymentSucceeded = latestInvoiceInfo?.status === 'paid' ||
    (latestInvoiceInfo?.status === 'draft' && latestInvoiceInfo?.billing === 'send_invoice') ||
    (latestInvoiceInfo?.status === 'open' && latestInvoiceInfo?.billing === 'send_invoice')

  return (!hasInvoice || paymentSucceeded
    ? (
      <UpgradePaymentSuccessful
        dashPath={appsPath.getPathForApp()}
        license={license}
      />
    )
    : (
      <UpgradePaymentError dashPath={appsPath.getPathForApp()} />
    )
  )
}

export default WebAppUpgradeConfirmation
