import {entry} from '../../registry'

type EmailAddress = string

interface SendEmailParams {
  /**
   * The email address to send an email to.
   */
  to: EmailAddress

  /**
   * The reply-to email address. This will appear as the sender of the email.
   */
  reply?: EmailAddress

  /**
   * The subject of the email.
   */
  subject: string

  /**
   * The body of the email in HTML format.
   */
  html: string

  /**
   * The body of the email in text format.
   */
  text?: string
}

interface EmailClient {
  sendEmail: (params: SendEmailParams) => Promise<any>
}

const Email = entry<EmailClient>('email')

export {
  EmailClient,
  SendEmailParams,
  Email,
}
