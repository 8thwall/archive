import {clearAutomatedMrCommentsFromCi} from './gitlab-service'

const run = async () => {
  await clearAutomatedMrCommentsFromCi(process.argv[2])
}

run()
