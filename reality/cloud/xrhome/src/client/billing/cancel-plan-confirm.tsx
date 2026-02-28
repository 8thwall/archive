import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'react-i18next'

import {TertiaryButton} from '../ui/components/tertiary-button'
import ButtonLink from '../uiWidgets/button-link'
import warningBlack from '../static/icons/warning_black.svg'
import {gray5, tinyViewOverride} from '../static/styles/settings'
import useCurrentAccount from '../common/use-current-account'
import hostSelf from '../static/host_self.svg'
import {hexColorWithAlpha} from '../../shared/colors'
import icons from '../apps/icons'
import {
  CONFIRM_DOWNGRADE_ACCOUNT_MESSAGES,
  LostFeaturesOnDowngrade,
} from '../apps/upgrade/web-app-upgrade-constants'

const useStyles = createUseStyles({
  sadFace: {
    margin: '0 auto',
  },
  header: {
    fontWeight: 700,
    margin: '0.7em 0',
  },
  bodyText: {
    fontSize: '1.1em',
    [tinyViewOverride]: {
      padding: '0',
    },
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1em',
  },
  lostFeaturesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '1em',
    padding: '0 0 2em 0',
    [tinyViewOverride]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  featureCard: {
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5em',
    boxShadow: `0px 0px 10px 0px ${hexColorWithAlpha(gray5, 0.1)}`,
    width: 'fit-content',
    padding: '0 2em',
    height: '4em',
    [tinyViewOverride]: {
      width: '18em',
    },
  },
})

interface ICancelPlanConfirm {
  endDate: string
  onCloseClick: () => void
  onConfirmClick: () => void
}

const FeatureCard = ({feature}: {feature: LostFeaturesOnDowngrade}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  switch (feature) {
    case LostFeaturesOnDowngrade.CLOUD_EDITOR:
      return (
        <div className={classes.featureCard}>
          <img
            src={icons.downgradeCloudEditorGrey}
            alt={t('plan_billing_page.plan_features.cloud_editor')}
          />
          <div>{t('plan_billing_page.plan_features.cloud_editor')}</div>
        </div>
      )

    case LostFeaturesOnDowngrade.CONNECTED_DOMAINS:
      return (
        <div className={classes.featureCard}>
          <img
            src={icons.downgradeConnectedDomainsGrey}
            alt={t('plan_billing_page.plan_features.connected_domains')}
          />
          <div>{t('plan_billing_page.plan_features.connected_domains')}</div>
        </div>
      )

    case LostFeaturesOnDowngrade.SELF_HOSTING:
      return (
        <div className={classes.featureCard}>
          <img
            src={hostSelf}
            alt={t('plan_billing_page.plan_features.app_key')}
          />
          <p>{t('plan_billing_page.plan_features.app_key')}</p>
        </div>
      )
    case LostFeaturesOnDowngrade.LOCAL_DEVELOPMENT:
      return (
        <div className={classes.featureCard}>
          <img
            src={icons.upgradeLocalDevGrey}
            alt={t('plan_billing_page.plan_features.local_dev')}
          />
          <p>{t('plan_billing_page.plan_features.local_dev')}</p>
        </div>
      )
    case LostFeaturesOnDowngrade.COMMERCIAL_LICENSE:
      return (
        <div className={classes.featureCard}>
          <img
            src={icons.upgradeLicenseGrey}
            alt={t('plan_billing_page.plan_features.commercial_license')}
          />
          <p>{t('plan_billing_page.plan_features.commercial_license')}</p>
        </div>
      )
    case LostFeaturesOnDowngrade.PRIVATE_PROFILES:
      return (
        <div className={classes.featureCard}>
          <img
            src={icons.upgradePublicProfileGrey}
            alt={t('plan_billing_page.plan_features.private_profiles')}
          />
          <p>{t('plan_billing_page.plan_features.private_profiles')}</p>
        </div>
      )
    default:
      return null
  }
}

const CancelPlanConfirm: React.FC<ICancelPlanConfirm> = ({
  endDate, onCloseClick, onConfirmClick,
}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const account = useCurrentAccount()
  const hasLostFeatures =
    CONFIRM_DOWNGRADE_ACCOUNT_MESSAGES[account.accountType].lostFeaturesOnDowngrade.length > 0

  return (
    <>
      {/* eslint-disable-next-line local-rules/hardcoded-copy */}
      <img draggable={false} className={classes.sadFace} alt='warning' src={warningBlack} />
      <h2 className={classes.header}>
        {t(CONFIRM_DOWNGRADE_ACCOUNT_MESSAGES[account.accountType].downgradeHeading)}
      </h2>
      <p className={classes.bodyText}>
        <b>{t(CONFIRM_DOWNGRADE_ACCOUNT_MESSAGES[account.accountType].downgradeWarning)}</b>
        <br />
        <Trans
          ns='account-pages'
          i18nKey={CONFIRM_DOWNGRADE_ACCOUNT_MESSAGES[account.accountType].downgradeToBasic}
          values={{endDate}}
          components={{
            b: <b />,
          }}
        />
      </p>
      <p className={classes.bodyText}>
        {hasLostFeatures &&
          <span>
            {t('plan_billing_page.cancel_plan_confirm.lost_features')}
          </span>
        }
      </p>
      {hasLostFeatures &&
        <div className={classes.lostFeaturesContainer}>
          {CONFIRM_DOWNGRADE_ACCOUNT_MESSAGES[account.accountType].lostFeaturesOnDowngrade
            .map(feature => <FeatureCard key={feature} feature={feature} />)
          }
        </div>
      }
      <div className={classes.buttonGroup}>
        <ButtonLink onClick={onCloseClick}>
          {t('plan_billing_page.cancel_plan_confirm.button.return_to_account')}
        </ButtonLink>
        <TertiaryButton onClick={onConfirmClick}>
          {t('plan_billing_page.cancel_plan_confirm.button.yes_cancel_plan')}
        </TertiaryButton>
      </div>
    </>

  )
}

export {
  CancelPlanConfirm,
}
