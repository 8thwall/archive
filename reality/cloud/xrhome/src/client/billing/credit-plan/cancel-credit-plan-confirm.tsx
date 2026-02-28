import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'react-i18next'

import {TertiaryButton} from '../../ui/components/tertiary-button'
import {tinyViewOverride} from '../../static/styles/settings'
import {useCreditQuery} from '../use-credit-query'
import {getActiveCreditGrant} from '../../../shared/feature-utils'
import useCurrentAccount from '../../common/use-current-account'
import {CREDIT_GRANT_FEATURE} from '../../../shared/feature-config'
import {SecondaryButton} from '../../ui/components/secondary-button'
import {Icon} from '../../ui/components/icon'

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
})

interface ICancelCreditPlanConfirm {
  onCloseClick: () => void
  onConfirmClick: () => void
}

const CancelCreditPlanConfirm: React.FC<ICancelCreditPlanConfirm> = ({
  onCloseClick, onConfirmClick,
}) => {
  const {i18n, t} = useTranslation(['account-pages'])
  const account = useCurrentAccount()
  const classes = useStyles()

  const {data} = useCreditQuery()
  const cycleEndDate = new Date(
    data.categorizedCreditGrants.PAID_PLAN?.slice().reverse().find(g => g.expiresAt).expiresAt
  )
  const formattedCycleEndDate = Intl.DateTimeFormat(i18n.language).format(cycleEndDate)

  const activeCreditGrant = getActiveCreditGrant(account.Features)

  return (
    <>
      {/* eslint-disable-next-line local-rules/hardcoded-copy */}
      <Icon stroke='warning' size={2.5} />
      <h2 className={classes.header}>
        {t(`plan_billing_page.cancel_credit_plan_confirm.heading.${
          (activeCreditGrant?.optionName).toLowerCase()
        }`)}
      </h2>
      <p className={classes.bodyText}>
        <Trans
          ns='account-pages'
          i18nKey='plan_billing_page.cancel_credit_plan_confirm.description.end_date'
          values={{
            endDate: formattedCycleEndDate,
            creditAmount: CREDIT_GRANT_FEATURE[activeCreditGrant?.optionName].creditAmount,
          }}
          components={{
            1: <b />,
          }}
        />
      </p>
      <div className={classes.buttonGroup}>
        <SecondaryButton onClick={onCloseClick}>
          {t('plan_billing_page.cancel_credit_plan_confirm.button.return_to_account')}
        </SecondaryButton>
        <TertiaryButton onClick={onConfirmClick}>
          {t('plan_billing_page.cancel_credit_plan_confirm.button.yes_cancel_plan')}
        </TertiaryButton>
      </div>
    </>
  )
}

export {
  CancelCreditPlanConfirm,
}
