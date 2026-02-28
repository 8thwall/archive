import MailchimpClient from '@mailchimp/mailchimp_marketing'

import {SecretsProvider} from '../secrets-provider/secrets-provider-api'
import type {IMailchimp, ListConfig} from './mailchimp-api'

const MAILCHIMP_API_KEY_PATH_PREFIX = '/8w/secrets/8w_mailchimp_api_key'

const testListConfig = {
  listId: '2204eab57c',
  consoleUserGroupId: 'bee492a19f',
}

const prodListConfig = {
  listId: '896ac3c43f',
  consoleUserGroupId: '8816374af5',
}

const getConfig = async () => {
  const {getParameter} = SecretsProvider.use()
  return JSON.parse(await getParameter({name: MAILCHIMP_API_KEY_PATH_PREFIX, raw: true}))
}

const createMailchimp = (): IMailchimp => {
  let mailchimpClient_
  const initMailchimp = async () => {
    MailchimpClient.setConfig(await getConfig())

    return MailchimpClient
  }

  const getClient = async (): MailchimpClient => {
    mailchimpClient_ = mailchimpClient_ || await initMailchimp()

    return mailchimpClient_
  }

  const getListConfig = (): ListConfig => (
    BuildIf.ALL_QA ? testListConfig : prodListConfig
  )

  return {
    getClient,
    getListConfig,
  }
}

export {
  createMailchimp,
}
