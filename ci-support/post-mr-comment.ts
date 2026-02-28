import fs from 'fs'

import {postMrCommentFromCi} from './gitlab-service'

const run = async () => {
  const messageFromStdin = fs.readFileSync(0, 'utf8')
  await postMrCommentFromCi(messageFromStdin)
}

run()
