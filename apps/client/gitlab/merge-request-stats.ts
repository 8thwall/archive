/**
 * This script retrieves merge request statistics from GitLab for a given set of users and time
 * period.
 *
 * @remarks
 * The script can be run from the command line with the following options:
 * - `--start` or `-s`: The start date for the time period to retrieve statistics for (required).
 * - `--end` or `-e`: The end date for the time period to retrieve statistics for, (defaults to the
 *                    most recent data), exclusive.
 * - `--users` or `-u`: A list of usernames to retrieve statistics for (required). Use `all` to
 *                      retrieve statistics for all active users.
 *
 * @example
 * ```
 * bazel run //apps/client/gitlab:merge-request-stats -- -s 2023-01-01 -e 2023-06-30 -u user1 user2
 * ```
 */
import fetch, {Response} from 'node-fetch'
import commandLineArgs from 'command-line-args'
import {promises as fs} from 'fs'
import keychain from 'keychain'
import {createObjectCsvWriter as createCsvWriter} from 'csv-writer'

const getGitlabAccessToken = () => new Promise<string>((resolve, reject) => {
  keychain.getPassword({
    account: process.env.USER,  // Fix this if your gitlab user is different from your OS user.
    service: 'gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com',
    type: 'internet',
  }, (err, pass) => {
    if (err) {
      reject(err)
    } else {
      resolve(pass)
    }
  })
})

// Truncate a date to the beginning of the month.
const dateTruncMonth = date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))

// Truncate a date to the beginning of the day.
const dateTruncDay = date => new Date(
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
)

const tomorrow = date => new Date(
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
)

const yesterday = date => new Date(
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1)
)

const getDateString = date => `${date.toISOString().slice(0, 10)}`

// Add all the months between the start and end dates to the userData object.
const addMonthsToObject = (obj, start, end) => {
  const month = dateTruncMonth(start)
  const endMonth = dateTruncMonth(end)
  while (month <= endMonth) {
    const monthKey =
      `${month.getUTCFullYear()}-${(month.getUTCMonth() + 1).toString().padStart(2, '0')}`
    obj[monthKey] = 0
    month.setUTCMonth(month.getUTCMonth() + 1)
  }
}

// Query the GitLab access token from the Apple keychain.
const accessToken = await getGitlabAccessToken()

const optionDefinitions = [
  // The start date to consider.
  {name: 'start', alias: 's', type: date => dateTruncDay(new Date(date))},
  // The end date to consider, inclusive.
  {
    name: 'end',
    alias: 'e',
    type: date => dateTruncDay(new Date(date)),
    defaultValue: tomorrow(dateTruncDay(new Date())),
  },
  // The users to retrieve statistics for. Use `all` to retrieve statistics for all active users.
  {name: 'users', alias: 'u', type: String, multiple: true, defaultOption: true},
]

const authoredMrQuery = q => `
{
  users(usernames: ["${q.user}"]) {
    nodes {
      name
      authoredMergeRequests(
        state: merged,
        after: "${q.cursor}",
        mergedAfter: "${q.start.toISOString()}",
        mergedBefore: "${q.lastDay.toISOString()}"
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          createdAt
          mergedAt
          title
          state
          id
          diffStatsSummary {
            fileCount
            changes
            additions
            deletions
          }
        }
      }
    }
  }
}
`

const reviewedMrQuery = q => `
{
  users(usernames: ["${q.user}"]) {
    nodes {
      name
      id
      reviewRequestedMergeRequests(
        state: merged,
        after: "${q.cursor}",
        mergedAfter: "${q.start.toISOString()}",
        mergedBefore: "${q.lastDay.toISOString()}"
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          title
          commenters {
            edges {
              node {
                id
              }
            }
          }
          approvedBy {
            edges {
              node {
                id
              }
            }
          }
          createdAt
          mergedAt
          state
        }
      }
    }
  }
}
`

/* eslint-disable no-console */

const MAX_REQUESTS = 50
const MAX_RETRIES = 5
const RETRY_PAUSE_SECONDS = 2

try {
  const options = commandLineArgs(optionDefinitions)

  if (options.users.length === 0) {
    throw new Error('No users specified')
  }

  if (!options.start) {
    throw new Error('No start date specified')
  }

  if (options.start > options.end) {
    throw new Error('Start date is after end date')
  }

  options.lastDay = yesterday(options.end)

  let usersToQuery = options.users

  if (options.users.length === 1 && options.users[0] === 'all') {
    let page = 1
    const perPage = 100

    const allUsers: string[] = []

    /* eslint-disable no-await-in-loop */
    for (;;) {
      // eslint-disable-next-line max-len
      const url = `https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/api/v4/users?per_page=${perPage}&page=${page}`
      const fetchOptions = {
        method: 'GET',
        headers: {'PRIVATE-TOKEN': accessToken},
      }

      const response = await fetch(url, fetchOptions)
      const result = (await response.json()) as any[]

      if (result.length > 0) {
        console.log(`Retrieved ${result.length} users in page ${page}`)
      }

      const ignoreUsers = ['semgrep', 'securitybot', 'buildbot']

      result.forEach((user) => {
        // Ignore users that aren't active or contain dashes or underscores in their username, or
        // are in the blacklist.
        if (user.state === 'active' &&
            user.username.indexOf('-') === -1 &&
            user.username.indexOf('_') === -1 &&
            !ignoreUsers.includes(user.username)) {
          allUsers.push((user as any).username)
        }
      })

      if (result.length === 0 || page >= MAX_REQUESTS) {
        break
      }
      page += 1
      /* eslint-enable no-await-in-loop */
    }
    allUsers.forEach((user) => {
      console.log(user)
    })
    usersToQuery = allUsers
  }

  const userRows: any[] = []

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < usersToQuery.length; i++) {
    const user = usersToQuery[i]
    const userData = {
      'username': user,
      'name': '',
      'commented': 0,
      'approved': 0,
      'authored': 0,
      'small': 0,
      'medium': 0,
      'large': 0,
      'xlarge': 0,
      'xxlarge': 0,
    }
    userRows.push(userData)

    // Add all the months between the start and end dates to the userData object.
    addMonthsToObject(userData, options.start, options.lastDay)

    const executeQueryWithRetry = async (query, callback) => {
      let requestCount = 0
      let hasNextPage = true
      let cursor = ''

      while (requestCount < MAX_REQUESTS && hasNextPage) {
        requestCount += 1

        const request = query({
          user,
          start: options.start,
          lastDay: options.lastDay,  // The gilab API seems to be inclusive of the end date.
          cursor,
        })

        for (let retry = 0; retry < MAX_RETRIES; retry++) {
          // eslint-disable-next-line max-len
          const response: Response = await fetch('https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/api/graphql', {
            method: 'POST',
            body: JSON.stringify({query: request}),
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`)
          } else {
            const payload = await response.json() as any
            if (payload.errors) {
              payload.errors.forEach((e) => {
                e.locations.forEach((loc) => {
                  console.log(`[${e.path}:${loc.line}:${loc.column}] ${e.message}`)
                })
              })
            } else {
              const callbackResult = callback(payload)
              hasNextPage = callbackResult.hasNextPage
              cursor = callbackResult.cursor
              break
            }
          }
          if (retry >= MAX_RETRIES) {
            throw new Error('Too many retries')
          } else {
            const retryTime = RETRY_PAUSE_SECONDS * (2 ** retry)
            console.log(`Retrying ${query.name} for ${user} in ${retryTime} seconds`)
            await new Promise(r => setTimeout(r, 1000 * retryTime))
          }
        }
      }
    }

    // Here we are going to retry the authoredMrQuery until
    // successful, then populate the userData object.
    await executeQueryWithRetry(authoredMrQuery, (payload) => {
      const mergeRequests = payload.data.users.nodes[0].authoredMergeRequests

      console.log(`Retrieved ${mergeRequests.nodes.length} authored MRs for ${user}`)

      userData.name = payload.data.users.nodes[0].name

      mergeRequests.nodes.forEach((mr) => {
        const month = dateTruncMonth(new Date(mr.mergedAt))
        const monthKey =
          `${month.getUTCFullYear()}-${(month.getUTCMonth() + 1).toString().padStart(2, '0')}`
        const dss = mr.diffStatsSummary

        const addsModifies = dss.additions + dss.changes
        if (addsModifies < 100) {
          userData.small += 1
        } else if (addsModifies < 500) {
          userData.medium += 1
        } else if (addsModifies < 1000) {
          userData.large += 1
        } else if (addsModifies < 5000) {
          userData.xlarge += 1
        } else {
          userData.xxlarge += 1
        }

        userData.authored += 1
        userData[monthKey] += 1
      })

      return {
        hasNextPage: mergeRequests.pageInfo.hasNextPage,
        cursor: mergeRequests.pageInfo.endCursor,
      }
    })

    await executeQueryWithRetry(reviewedMrQuery, (payload) => {
      const mergeRequests = payload.data.users.nodes[0].reviewRequestedMergeRequests

      console.log(`Retrieved ${mergeRequests.nodes.length} reviewed MRs for ${user}`)

      const {id} = payload.data.users.nodes[0]

      mergeRequests.nodes.forEach((mr) => {
        let commented = false
        let approved = false

        mr.commenters.edges.forEach((commenter) => {
          if (commenter.node.id === id) {
            commented = true
          }
        })

        mr.approvedBy.edges.forEach((approver) => {
          if (approver.node.id === id) {
            approved = true
          }
        })

        if (commented) {
          userData.commented += 1
        }

        if (approved) {
          userData.approved += 1
        }
      })

      return {
        hasNextPage: mergeRequests.pageInfo.hasNextPage,
        cursor: mergeRequests.pageInfo.endCursor,
      }
    })

    console.log(JSON.stringify(userData))
  }
  /* eslint-enable no-await-in-loop */

  const dateRange =
    `${options.start.toISOString().slice(0, 10)}-to-${options.end.toISOString().slice(0, 10)}`
  const filename = `mr-stats-${dateRange}.csv`

  // Write out the userRows to a csv file.
  const csvWriter = createCsvWriter({
    path: filename,
    header: Object.keys(userRows[0]).map(key => ({id: key, title: key})),
  })

  const mergedAfter = getDateString(options.start)
  const mergedBefore = getDateString(options.end)

  const allMonths = {}
  addMonthsToObject(allMonths, options.start, options.lastDay)

  // Write the approved and authored rows as hyperlinks.
  userRows.forEach((row) => {
    // eslint-disable-next-line max-len
    row.approved = '=HYPERLINK("https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/dashboard/merge_requests?' +
      `scope=all&state=merged&merged_after=${mergedAfter}&merged_before=${mergedBefore}&` +
      `reviewer_username=${row.username}&approved_by_usernames[]=${row.username}", ${row.approved})`
    // eslint-disable-next-line max-len
    row.authored = '=HYPERLINK("https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/dashboard/merge_requests?' +
      `scope=all&state=merged&merged_after=${mergedAfter}&merged_before=${mergedBefore}&` +
      `author_username=${row.username}", ${row.authored})`

    Object.keys(allMonths).forEach((monthKey) => {
      const monthStartDate = new Date(`${monthKey}-01`)
      const monthEndDate =
        new Date(Date.UTC(monthStartDate.getUTCFullYear(), monthStartDate.getUTCMonth() + 1, 1))
      const monthStart = getDateString(new Date(Math.max(options.start, monthStartDate.getTime())))
      const monthEnd = getDateString(new Date(Math.min(options.end, monthEndDate.getTime())))
      // eslint-disable-next-line max-len
      row[monthKey] = '=HYPERLINK("https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/dashboard/merge_requests?' +
        `scope=all&state=merged&merged_after=${monthStart}&merged_before=${monthEnd}&` +
        `author_username=${row.username}", ${row[monthKey]})`
    })
  })

  await csvWriter.writeRecords(userRows)

  const absolutePath = await fs.realpath(filename)
  console.log(`CSV file has been saved to ${absolutePath}`)
} catch (e) {
  console.error(e)
  process.exit(1)
}
