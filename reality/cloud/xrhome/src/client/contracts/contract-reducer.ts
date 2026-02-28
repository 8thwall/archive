import type {DeepReadonly} from 'ts-essentials'

import type {ContractReduxState} from './contract-types'

const initialState: DeepReadonly<ContractReduxState> = {
  allContracts: [],
  availableContracts: [],
  userLicenses: [],
  pending: false,
}

const Reducer = (state = initialState, action): DeepReadonly<ContractReduxState> => {
  switch (action.type) {
    case 'CONTRACT_SET_ALL':
      return {...state, allContracts: action.contracts}
    case 'CONTRACT_SET_AVAILABLE':
      return {...state, availableContracts: action.contracts}
    case 'CONTRACT_SET_PENDING':
      return {...state, pending: action.pending}
    case 'CONTRACT_SET_CLEAR':
      return {...state, availableContracts: []}
    case 'CONTRACT_LICENSE_SET':
      return {...state, userLicenses: action.licenses.templates}
    case 'CONTRACT_LICENSE_CLEAR':
      return {...state, userLicenses: []}
    case 'CONTRACT_ACCEPT_ADD':
      return {
        ...state,
        availableContracts: [
          ...state.availableContracts.map((c) => {
            if (c.uuid !== action.contractAccept.ContractUuid) {
              return c
            } else {
              return {
                ...c,
                AccountContractAgreements: [
                  ...c.AccountContractAgreements,
                  action.contractAccept,
                ],
              }
            }
          }),
        ],
      }
    default:
      return state
  }
}

export default Reducer
