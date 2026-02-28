/* eslint-disable no-console */
import util from 'util'
import fs from 'fs'
import path from 'path'
import {format} from 'date-fns'

const MIGRATION_DIRECTORY = '../../../../prod8/migrations/xrhome/typed'
const MIGRATION_TEMPLATE_NAME = 'migration-template.ts'

const copyFile = util.promisify(fs.copyFile)

const generateMigration = async (filename: string) => {
  const timestamp = format(Date.now(), 'yyyyMMddHHmmss')
  const generatedFile = path.resolve(path.join(MIGRATION_DIRECTORY, `${timestamp}-${filename}.ts`))
  const template = path.join(__dirname, MIGRATION_TEMPLATE_NAME)

  await copyFile(template, generatedFile)
  console.log(`Successfully generated typed migration file: ${generatedFile}`)
}

const run = async () => {
  const args = process.argv.slice(2)
  if (!args.length) {
    throw new Error('Migration name was not specified\n')
  }
  const filename = args[0]
  await generateMigration(filename)
}

run()
