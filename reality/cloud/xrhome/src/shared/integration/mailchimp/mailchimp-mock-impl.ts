import MailchimpClient from '@mailchimp/mailchimp_marketing'

import type {IMailchimp, ListConfig} from './mailchimp-api'
import {SecretsProvider} from '../secrets-provider/secrets-provider-api'

const MAILCHIMP_API_KEY_PATH_PREFIX = '/8w/secrets/8w_mailchimp_api_key'

const MOCK_LIST_CONFIG = {
  listId: 'fake-list-id',
  consoleUserGroupId: 'fake-console-user-group-id',
}

type MemberAttributes = {
  id: string
  // eslint-disable-next-line camelcase
  email_address: string
  // eslint-disable-next-line camelcase
  list_id: string
}

const getConfig = async () => {
  const {getParameter} = SecretsProvider.use()
  return JSON.parse(await getParameter({name: MAILCHIMP_API_KEY_PATH_PREFIX, raw: true}))
}

const createMailchimpMock = (): IMailchimp => {
  let mailchimpClient_: MailchimpClient
  let encryptEmail_: (email: string) => string = email => email
  let members: MemberAttributes[] = []

  const initMailchimp = async (): MailchimpClient => {
    MailchimpClient.setConfig(await getConfig())

    return {
      searchMembers: {
        search: async (email: string) => {
          const filteredMembers = members.filter(member => member.email_address === email)
          return Promise.resolve({
            exact_matches: {
              members: filteredMembers,
              total_items: filteredMembers.length,
            },
          })
        },
      },
      lists: {
        updateListMember: async (
          listId: string, contactId: string, attributes: MemberAttributes
        ) => {
          if (listId !== MOCK_LIST_CONFIG.listId) {
            return Promise.reject()
          }
          let newMember: MemberAttributes
          members = members.map((member) => {
            if (member.id === contactId) {
              newMember = {
                ...member,
                id: encryptEmail_(attributes.email_address),
                ...attributes,
              }
              return newMember
            }
            return member
          })
          return newMember ? Promise.resolve(newMember) : Promise.reject()
        },
        addListMember: async (member: MemberAttributes) => {
          members.push(member)
          return Promise.resolve(member)
        },
      },
      // NOTE(johnny): These methods are not a part of the MailchimpClient API.
      reset: () => {
        members = []
        encryptEmail_ = email => email
      },
      setEncryptEmail: (encryptEmail: (email: string) => string) => {
        encryptEmail_ = encryptEmail
      },
    }
  }

  const getClient = async (): MailchimpClient => {
    mailchimpClient_ = mailchimpClient_ || await initMailchimp()

    return mailchimpClient_
  }

  const getListConfig = (): ListConfig => MOCK_LIST_CONFIG

  return {
    getClient,
    getListConfig,
  }
}

export {
  MOCK_LIST_CONFIG,
  createMailchimpMock,
}
