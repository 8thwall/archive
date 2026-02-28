#!/usr/bin/env npx ts-node
import {google} from 'googleapis'

/* eslint-disable max-len */
const RELEASE_DOC_URL = '<REMOVED_BEFORE_OPEN_SOURCING>'
// There is a Google Sheet which lists out the current captains' Slack IDs:
const CALENDAR_ID = '<REMOVED_BEFORE_OPEN_SOURCING>'
const CALENDAR_URL = `https://docs.google.com/spreadsheets/d/${CALENDAR_ID}/edit?gid=180345441`
/* eslint-enable max-len */

const checkVariableSet = (variable: string) => {
  if (!process.env[variable]) {
    // eslint-disable-next-line no-console
    console.error(`Missing environment variable: ${variable}`)
    process.exit(1)
  }
}

checkVariableSet('GCP_SERVICE_ACCOUNT_EMAIL')
checkVariableSet('GCP_SERVICE_ACCOUNT_PRIVATE_KEY')
checkVariableSet('SLACK_TOKEN')

interface ReleaseCaptains {
  main: string
  growthQa: string
  platformQa: string
  techQa: string
  gsbQa: string
  genAiQa: string
}

// NOTE: The private key stored on Jenkins secrets manager replaces newline characters with
// a backslash + 'n' character. We replace those combinations of strings with a newline.
const fetchReleaseCaptainSlackIds = async (): Promise<ReleaseCaptains> => {
  const auth = new google.auth.JWT({
    email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheetsClient = google.sheets('v4')
  const response = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: CALENDAR_ID,
    range: 'Users!A2:F2',
    auth,
  })

  const [[main, growthQa, platformQa, techQa, gsbQa, genAiQa]] = response.data.values

  return {
    main,
    growthQa,
    platformQa,
    techQa,
    gsbQa,
    genAiQa,
  }
}

const buildNotificationMessage = (captains: ReleaseCaptains) => `\
Happy Monday! :pikachu_dancing:

The Release Captain this week is <@${captains.main}> :ship:

Please kick-off the <${RELEASE_DOC_URL}|release process> as soon as possible. Once ready, \
notify the following QA leads:
- Growth QA: <@${captains.growthQa}>
- Platform QA: <@${captains.platformQa}>
- Tech Dev QA: <@${captains.techQa}>
- GSB QA: <@${captains.gsbQa}>
- GenAI QA: <@${captains.genAiQa}>

The full schedule of release captains can be <${CALENDAR_URL}|found here>.`

const sendWeeklyReleaseNotification = async () => {
  const captains = await fetchReleaseCaptainSlackIds()

  const message = buildNotificationMessage(captains)

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    body: new URLSearchParams({
      channel: '8w-xrhome-release-team',
      token: process.env.SLACK_TOKEN,
      username: 'jenkins.bot',
      text: message,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    // eslint-disable-next-line no-console
    throw new Error(`Failed to send message: ${response.status} - ${errorText}`)
  }
}

sendWeeklyReleaseNotification()
