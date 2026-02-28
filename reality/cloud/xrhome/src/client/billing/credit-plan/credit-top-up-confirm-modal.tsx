import React from 'react'
import {createUseStyles} from 'react-jss'
import {Trans, useTranslation} from 'react-i18next'

import {tinyViewOverride} from '../../static/styles/settings'
import {calculateExpiresAtDate} from '../../../shared/credits/grant-validity-periods'
import {StandardModal} from '../../editor/standard-modal'
import {SecondaryButton} from '../../ui/components/secondary-button'

const useStyles = createUseStyles({
  modalContainer: {
    padding: '3em',
    flexDirection: 'column',
    display: 'flex',
    gap: '2em',
    [tinyViewOverride]: {
      padding: '1.5em',
    },
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em',
    fontSize: '1.125em',
    textAlign: 'center',
  },
  heading: {
    fontWeight: 700,
    fontSize: '1.5em',
    margin: '0',
  },
  expirationDate: {
    textAlign: 'center',
    fontSize: '1.125em',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

interface ICreditTopUpConfirmModal {
  creditAmount: number
  onClose: () => void
}

const CreditTopUpConfirmModal: React.FC<ICreditTopUpConfirmModal> = (
  {creditAmount, onClose}
) => {
  const {t} = useTranslation(['account-pages', 'common'])
  const classes = useStyles()
  const creditExpirationDate = calculateExpiresAtDate('ONE_MONTH', new Date())

  return (
    <StandardModal
      onClose={onClose}
      closeOnDimmerClick
    >
      <div className={classes.modalContainer}>
        <div className={classes.headingContainer}>
          <h2 className={classes.heading}>
            <Trans
              ns='account-pages'
              i18nKey='plan_billing_page.credit_top_up_confirm_modal.heading'
              values={{creditAmount}}
            />
          </h2>
        </div>
        <div className={classes.expirationDate}>
          <Trans
            ns='account-pages'
            i18nKey='plan_billing_page.credit_top_up_confirm_modal.credits_expiration'
            values={{expirationDate: creditExpirationDate.toLocaleDateString()}}
            components={{1: <b />}}
          />
        </div>
        <div className={classes.buttonGroup}>
          <SecondaryButton onClick={onClose}>
            {t('button.close', {ns: 'common'})}
          </SecondaryButton>
        </div>
      </div>
    </StandardModal>
  )
}

export default CreditTopUpConfirmModal
