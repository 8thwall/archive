import * as React from 'react'
import {Form} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import type {IContract} from '../../common/types/models'
import '../../static/styles/contract-select.scss'
import {useSelector} from '../../hooks'

const createContractOption = (contract, t) => {
  const isDefault = !contract.AccountUuid
  const optionDescription = (
    <>
      {contract.name}
      {isDefault &&
        <span className='default-indicator'>{' '}
          {t('purchase_license_page.contract_select.default_indicator')}
        </span>
      }
    </>
  )

  return {
    key: contract.uuid,
    text: optionDescription,
    content: optionDescription,
    value: contract.uuid,
  }
}

// onContractSelected calls with the uuid of the contract selected
//                    you need to look up your contract information from your component
interface IContractSelect {
  selectedContract: IContract
  onContractSelected(contractUuid: string): void
}
const ContractSelect: React.FC<IContractSelect> = ({selectedContract, onContractSelected}) => {
  const {t} = useTranslation(['app-pages'])
  const contracts = useSelector(state => state.contracts.availableContracts)
  const onChange = (ev, data) => {
    onContractSelected(data.value)
  }

  const sortedContracts = [...contracts].sort((c1, c2) => {
    // Default contracts should always appear last
    if (c1.AccountUuid && !c2.AccountUuid) {
      return -1
    }
    if (!c1.AccountUuid && c2.AccountUuid) {
      return 1
    }

    // Otherwise, show in the order in which the contract was signed.
    return new Date(c1.signedDate).getTime() - new Date(c2.signedDate).getTime()
  })
  const contractOptions = sortedContracts.map(contract => createContractOption(contract, t))

  return (
    <Form.Select
      options={contractOptions}
      value={selectedContract?.uuid}
      placeholder={t('purchase_license_page.contract_select.placeholder')}
      onChange={onChange}
      className='contract-select'
    />
  )
}

export {ContractSelect}
