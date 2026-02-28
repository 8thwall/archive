import {SES} from 'aws-sdk'

import type {EmailClient, SendEmailParams} from './email-api'

const DEFAULT_NO_REPLY = 'no-reply@8thwall.com'
const Charset = 'UTF-8'

const createEmailSESClient = (options?: SES.ClientConfiguration): EmailClient => {
  const ses = new SES(options)

  const sendEmail = (
    {to, reply, subject, html, text}: SendEmailParams
  ) => new Promise<any>((resolve, reject) => {
    const params = {
      Destination: {
        BccAddresses: [],
        CcAddresses: [],
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {Charset, Data: html},
          Text: {Charset, Data: text || html},
        },
        Subject: {Charset, Data: subject},
      },
      ReplyToAddresses: [reply || DEFAULT_NO_REPLY],
      Source: reply || DEFAULT_NO_REPLY,
    }
    ses.sendEmail(params, (err, data) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(`[email.sendEmail] to=${to} subject=${subject} ERROR`, err)
        reject(new Error(`Email not sent to ${to} because ${err.message}`))
        return
      }
      resolve(data)
    })
  })

  return {
    sendEmail,
  }
}

export {
  createEmailSESClient,
}
