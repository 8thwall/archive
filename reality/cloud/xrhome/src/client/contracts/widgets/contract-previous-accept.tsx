import * as React from 'react'
import format from 'date-fns/format'
import {Trans} from 'react-i18next'

import type {IContract} from '../../common/types/models'
import {Icon} from '../../ui/components/icon'

interface IContractPreviousAccept {
  selectedContract: IContract
  userUuid: string
  team: any
}

const DATE_FORMAT = 'MM/dd/yy'
const ContractPreviousAccept: React.FC<IContractPreviousAccept> = ({
  selectedContract,
  userUuid,
  team,
}) => {
  const isApprovedOutside = !selectedContract?.isAvailableAsCanned && !!selectedContract?.signedDate
  let previousAcceptBy = null
  let previousAcceptAt = null
  if (isApprovedOutside) {
    // Custom contracts can be signed outside of our system. If they are, just display
    // the date they were signed.
    previousAcceptAt = format(new Date(selectedContract.signedDate), DATE_FORMAT)
  } else {
    const previousAccept = selectedContract?.AccountContractAgreements?.[0]
    if (previousAccept) {
      previousAcceptAt = format(new Date(previousAccept.acceptedAt), DATE_FORMAT)
      if (userUuid !== previousAccept.acceptedBy && team) {
        // find the accepted user in your team
        const acceptedUser = team.find(u => u.uuid === previousAccept.acceptedBy)
        if (acceptedUser) {
          previousAcceptBy = `${acceptedUser.given_name} ${acceptedUser.family_name}`
        }
      }
    }
  }
  const contractLink = (
    <a
      target='_blank'
      className='contract-link'
      href={selectedContract?.pdfSignedUrl}
      rel='noopener noreferrer'
    >
      {{contractLink: selectedContract?.name}}
    </a>
  )

  return (
    <div className='accent'>
      {isApprovedOutside &&
        <Trans
          ns='app-pages'
          i18nKey='purchase_license_page.contract_previous_accept.contract_previously_accepted'
        >
          {contractLink} was previously accepted on {{previousAcceptAt}}.
        </Trans>
      }
      {!isApprovedOutside && !previousAcceptBy && previousAcceptAt &&
        <Trans
          ns='app-pages'
          i18nKey='purchase_license_page.contract_previous_accept.you_accepted_contract'
        >
          You accepted {contractLink} on {{previousAcceptAt}}.
        </Trans>
      }
      {!isApprovedOutside && !previousAcceptBy && !previousAcceptAt &&
        <Trans
          ns='app-pages'
          i18nKey='purchase_license_page.contract_previous_accept.you_accepted_contract_unknown'
        >
          You accepted {contractLink} on an unknown date.
        </Trans>
      }
      {!isApprovedOutside && previousAcceptBy && previousAcceptAt &&
        <Trans
          ns='app-pages'
          i18nKey='purchase_license_page.contract_previous_accept.team_accepted_contract'
        >
          {{previousAcceptBy}} accepted {contractLink} on {{previousAcceptAt}}.
        </Trans>
      }
      {!isApprovedOutside && previousAcceptBy && !previousAcceptAt &&
        <Trans
          ns='app-pages'
          i18nKey='purchase_license_page.contract_previous_accept.team_accepted_contract_unknown'
        >
          {{previousAcceptBy}} accepted {contractLink} on an unknown date.
        </Trans>
      }
      {' '}<Icon inline stroke='checkmark' />
    </div>
  )
}

export default ContractPreviousAccept
