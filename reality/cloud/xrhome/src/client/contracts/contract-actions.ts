import {batch} from 'react-redux'

import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'

const getAllContractsForAcc = () => (dispatch, getState) => {
  const url = `/v1/contracts/${getState().accounts.selectedAccount}`
  dispatch(authenticatedFetch(url)).then((res) => {
    const contracts = res
    dispatch({type: 'CONTRACT_SET_ALL', contracts})
  }).catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const getAvailableContractsForAccOld = () => (dispatch, getState) => {
  const url = `/v1/contracts/available/${getState().accounts.selectedAccount}`
  dispatch(authenticatedFetch(url)).then((res) => {
    const contracts = res
    dispatch({type: 'CONTRACT_SET_AVAILABLE', contracts})
  }).catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const getAvailableContractsForAcc = (accountUuid: string) => async (dispatch) => {
  batch(() => {
    dispatch({type: 'CONTRACT_SET_PENDING', pending: true})
    dispatch({type: 'ERROR', msg: null})
  })

  try {
    const url = `/v1/contracts/available/${accountUuid}`
    const contracts = await dispatch(authenticatedFetch(url))
    dispatch({type: 'CONTRACT_SET_AVAILABLE', contracts})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  } finally {
    dispatch({type: 'CONTRACT_SET_PENDING', pending: false})
  }
}

const getAvailableContractsForApp = (AppUuid: string) => async (dispatch) => {
  batch(() => {
    dispatch({type: 'CONTRACT_SET_PENDING', pending: true})
    dispatch({type: 'ERROR', msg: null})
  })
  try {
    const url = `/v1/contracts/apps/available/${AppUuid}`
    const contracts = await dispatch(authenticatedFetch(url))
    dispatch({type: 'CONTRACT_SET_AVAILABLE', contracts})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  } finally {
    dispatch({type: 'CONTRACT_SET_PENDING', pending: false})
  }
}

const clearAvailableContracts = () => (dispatch) => {
  dispatch({type: 'CONTRACT_SET_CLEAR'})
}

const getLicensesForContractCreation = contract => (dispatch) => {
  const url = `/v1/contracts/new/${contract.uuid}`
  dispatch({type: 'CONTRACT_LICENSE_CLEAR'})
  dispatch(authenticatedFetch(url)).then((res) => {
    dispatch({type: 'CONTRACT_LICENSE_SET', licenses: res})
  }).catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const getLicensesForAppUpgrade = AppUuid => (dispatch) => {
  const url = `/v1/contracts/upgrade/${AppUuid}`
  dispatch({type: 'CONTRACT_LICENSE_CLEAR'})
  dispatch(authenticatedFetch(url)).then((res) => {
    dispatch({type: 'CONTRACT_LICENSE_SET', licenses: res})
  }).catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const acceptContractForAcc = contractUuid => (dispatch, getState) => dispatch(authenticatedFetch(
  `/v1/contracts/accept/contract/${contractUuid}/account/${getState().accounts.selectedAccount}`,
  {method: 'POST'}
)).then((contractAccept) => {
  window.dataLayer.push({event: 'acceptAgreement'})
  dispatch({type: 'CONTRACT_ACCEPT_ADD', contractAccept})
  return contractAccept
})

const rawActions = {
  getAllContractsForAcc,
  getAvailableContractsForAccOld,
  getAvailableContractsForAcc,
  getAvailableContractsForApp,
  clearAvailableContracts,
  getLicensesForContractCreation,
  getLicensesForAppUpgrade,
  acceptContractForAcc,
}

type ContractActions = DispatchifiedActions<typeof rawActions>

const actions = dispatchify(rawActions)

export {
  actions as default,
  ContractActions,
}
