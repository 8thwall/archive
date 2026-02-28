import React, {useState} from 'react'
import {Button} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import type {IContract} from '../../common/types/models'
import {ContractSelect} from '../../contracts/widgets/contract-select'
import {isContractAccepted} from '../../../shared/contract-utils'
import ContractPreviousAccept from '../../contracts/widgets/contract-previous-accept'
import {ContractPdfModal} from '../../contracts/contract-pdf-modal'
import useStyles from './web-app-upgrade-jss'
import {combine} from '../../common/styles'
import ButtonLink from '../../uiWidgets/button-link'
import {useSelector} from '../../hooks'
import {useUserUuid} from '../../user/use-current-user'

interface Props {
  selectedContract: IContract
  onContractSelect: (contractUuid: string) => void
  onCancel: () => void
}

const WebAppUpgradeCommercialAgreementField: React.FC<Props> = ({
  selectedContract,
  onContractSelect,
  onCancel,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const team = useSelector(state => state.team?.roles)
  const userUuid = useUserUuid()
  const classes = useStyles()

  const [isContractPdfModalOpen, setIsContractPdfModalOpen] = useState(false)

  const previousAccept = isContractAccepted(selectedContract)

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>{t('purchase_license_page.web_app_upgrade_agreement_field.label')}
      </label>
      <p>
        {/* eslint-disable-next-line max-len */}
        {t('purchase_license_page.webapp_upgrade_commercial_agreement_field.before_subscription_purchase')}
      </p>
      <ContractSelect selectedContract={selectedContract} onContractSelected={onContractSelect} />
      <div>
        {selectedContract && previousAccept
          ? (
            <ContractPreviousAccept
              selectedContract={selectedContract}
              userUuid={userUuid}
              team={team}
            />
          )
          : (
            <>
              <Button
                primary
                content={(
                  <b>
                    {t('purchase_license_page.webapp_upgrade_commercial_agreement_field.' +
                    'button.view_accept_agreement')}
                  </b>
                )}
                onClick={() => { setIsContractPdfModalOpen(true) }}
                disabled={!selectedContract}
                a8='click;xr-home-upgrade;view-and-accept-agreement'
              />
              <ButtonLink
                className={combine(classes.simpleActionButton, classes.cancelButton)}
                onClick={onCancel}
                a8='click;xr-home-upgrade;cancel-cta'
              >
                {t('button.cancel', {ns: 'common'})}
              </ButtonLink>
            </>
          )
        }
        {selectedContract &&
          <ContractPdfModal
            contract={selectedContract}
            onContractAccept={() => { setIsContractPdfModalOpen(false) }}
            isOpen={isContractPdfModalOpen}
            onClose={() => { setIsContractPdfModalOpen(false) }}
          />
        }
      </div>
    </>
  )
}

export default WebAppUpgradeCommercialAgreementField
