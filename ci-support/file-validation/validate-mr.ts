import {clearAutomatedMrCommentsFromCi, postMrCommentFromCi} from '../gitlab-service'
import {Notification, getErrors} from './validate'

const COMMENT_MATCH = '💽'

const getLine = (error: Notification) => [
  error.type, error.file, error.message,
].join(': ')

const run = async () => {
  try {
    const forkPoint = process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA
    if (!forkPoint) {
      throw new Error('Expected CI_MERGE_REQUEST_DIFF_BASE_SHA to be defined')
    }
    const currentSha = process.env.CI_COMMIT_SHA
    if (!currentSha) {
      throw new Error('Expected CI_COMMIT_SHA to be defined')
    }
    const notifications = await getErrors(forkPoint, currentSha)

    await clearAutomatedMrCommentsFromCi(COMMENT_MATCH)
    if (!notifications.length) {
      // eslint-disable-next-line no-console
      console.log('No new errors or warnings to report')
      return
    }

    const summaryLines: string[] = []

    const outputLine = (line: string) => {
      if (summaryLines.length < 25) {
        summaryLines.push(line)
      }
      // eslint-disable-next-line no-console
      console.log(line)
    }

    notifications.forEach((error) => {
      outputLine(getLine(error))
    })

    const fullMessage = `
<details><summary>
${notifications.length === 1 ? '1 file has' : `${notifications.length} files have`}
validation issues:
</summary>

\`\`\`

${summaryLines.join('\n')}

\`\`\`

${COMMENT_MATCH} [Full output](${process.env.CI_JOB_URL})

</details>`

    await postMrCommentFromCi(fullMessage)

    if (notifications.some(e => e.type === 'error')) {
      process.exit(1)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

run()
