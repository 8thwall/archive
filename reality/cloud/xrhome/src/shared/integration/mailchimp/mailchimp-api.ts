import type MailchimpClient from '@mailchimp/mailchimp_marketing'

import {entry} from '../../registry'

interface ListConfig {
  listId: string
  consoleUserGroupId: string
}

interface IMailchimp {
  getClient: () => Promise<MailchimpClient>
  getListConfig: () => ListConfig
}

const Mailchimp = entry<MailchimpClient>('mailchimp')

export {Mailchimp}
export type {IMailchimp, ListConfig}
