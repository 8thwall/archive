// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)
//
// Usage:
// $ bazel run //ci-support/i18n:translate -- \
//   --dry-run \
//   --base-directory-source=ci-support/i18n/test/json/en-US \
//   --base-directory-output=ci-support/i18n/test/json \
//   --content-type=json \
//   --locale-directory-specifier="{language}-{country}" \
//   --translation-engine=mock \
//   --languages=fr,jp \
//   --sources=ci-support/i18n/test/json/en-US/a.json,ci-support/i18n/test/json/en-US/b.json
//
// Script that translates files.

import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'

import {checkArgs} from 'c8/cli/args'
import {setTranslationConfig, TranslationContentType} from './translation/translation-config'
import {Language, TranslationEngine} from './translation/translation-engine'
import {mockTranslationEngine} from './translation/translation-engine-mock'
import {runTranslationTask} from './translation/translation-task'
import {chatGPTCost, translationEngineChatGPT} from './translation/translation-engine-chatgpt'

const HELP = `translate usage:
  translate \\
    [--help] \\
    [--dry-run] \\
    --base-directory-source=[path/to/src] \\
    --base-directory-output=[path/to/out] \\
    --contentType=[json|md] \\
    --locale-directory-specifier=[specifier] \\
    --translation-engine=[mock] \\
    --languages=[language1,language2,...] \\
    --sources=[path/to/src/file1,path/to/src/file2,...]
`

const args = checkArgs({
  optionalFlags: ['dry-run'],
  requiredFlags: [
    'base-directory-source',
    'base-directory-output',
    'content-type',
    'locale-directory-specifier',
    'translation-engine',
    'languages',
    'sources',
  ],
  optionsForFlag: {
    'content-type': ['json', 'md'],
    'translation-engine': ['mock', 'chatgpt'],
  },
  maxOrdered: 0,
  help: HELP,
})

const translationEngine = (engine) : TranslationEngine => {
  switch (engine) {
    case 'chatgpt':
      return translationEngineChatGPT()
    case 'mock':
      return mockTranslationEngine()
    default:
      throw new Error(`Unsupported translation engine '${engine}'`)
  }
}

const main = async () => {
  const sources = (args.sources as string).split(',')
  const languages = (args.languages as string).split(',') as Language[]
  const engine = translationEngine(args['translation-engine'])

  // Set config values for how inputs and outputs should be mapped, how content should be
  // interpreted, and how translation should be done.
  setTranslationConfig({
    baseDirectoryOutput: args['base-directory-output'] as string,
    baseDirectorySource: args['base-directory-source'] as string,
    contentType: args['content-type'] as TranslationContentType,
    localeDirectorySpecifier: args['locale-directory-specifier'] as string,
    translationEngine: engine,
  })

  // Get the set of work that needs to be done by reading in all of the files and creating a
  // separate translation task per language that we are targeting.
  const tasks = sources.map(src => {
    if (!fs.existsSync(src)) {
      throw new Error(`File ${src} cannot be read`)
    }
    const content = fs.readFileSync(src, {encoding: 'utf8', flag: 'r'}) as string
    return languages.map((language) => ({path: src, content, language}))
  }).flat()

  // Start running all of the translation tasks and wait for them all to finish. As soon as each
  // one is done, write its output to disk. That way, if one of the tasks fails, not all of the work
  // is lost. If we're running in dry-run mode, write the output to the console instead.
  await Promise.all(
    tasks.map(async (task) => {
      // Run the translation task and wait for it to finish.
      const result = await runTranslationTask(task)

      // If we're in dry run mode, print out the result.
      if (args['dry-run']) {
        console.log(JSON.stringify(result, null, 2))
        return
      }

      // Otherwise, write the output to the desired file, creating the destination directory if
      // needed.
      console.log(`Updating ${result.path}`)
      const dir = path.dirname(result.path)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true})
      }
      fs.writeFileSync(result.path, result.content)
    })
  )

  if (args['translation-engine'] === 'chatgpt') {
    console.log('Total ChatGPT cost: ', chatGPTCost())
  }
}

try {
  main()
} catch (e) {
  console.error(e)
  process.exit(1)
}
