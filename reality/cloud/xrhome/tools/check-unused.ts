/* eslint-disable no-console */
import util from 'util'
import fs from 'fs'
import path from 'path'
import precinct from 'precinct'
import type {DeepReadonly} from 'ts-essentials'

import {makeRunQueue} from '../src/shared/run-queue'

const readDir = util.promisify(fs.readdir)
const statFile = util.promisify(fs.stat)
const readFile = util.promisify(fs.readFile)

const runQueue = makeRunQueue(100)

const IGNORED_UNUSED_PACKAGES = new Set([
  // Used by unit tests
  '@playwright/test',
  '@types/mocha',
  '@types/supertest',
  'aws-sdk-mock',
  'chai-as-promised',
  'chai-datetime',
  'chai-sorted',
  'chai',
  'mocha-jenkins-reporter',
  'mocha',
  'proxyquire',
  'sinon',
  'sqlite3',
  'supertest',
  'ts-mocha',

  '@8thwall/embed8',  // There's a sneaky require that isn't detected by precinct
  'real-semantic-ui-react',  // alias of semantic-ui-react

  // Used by shared ecs code
  '@automerge/automerge',
  '@tweenjs/tween.js',
  'base64-js',
  'three-nebula',
  'yoga-layout',

  // Used by g8-git
  'capnp-ts',

  // Needed for transitive/peer dependencies
  'pg',  // sequelize
  'react-with-styles',  // react-dates
  'styled-components',  // react-elastic-carousel
  'googleapis',  // we're using gaxios from it

  // Used by code editor
  'monaco-textmate',
  'diff-match-patch',

  // Used by webpack
  '@babel/core',
  '@babel/node',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-decorators',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-syntax-export-default-from',
  '@babel/plugin-transform-object-assign',
  '@babel/plugin-transform-react-jsx',
  '@babel/plugin-transform-runtime',
  '@babel/plugin-transform-spread',
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/preset-typescript',
  '@babel/register',
  'assert',
  'babel-loader',
  'babel-plugin-css-modules-transform',
  'browserify-zlib',
  'buffer',
  'console-browserify',
  'constants-browserify',
  'copy-webpack-plugin',
  'crypto-browserify',
  'css-loader',
  'domain-browser',
  'events',
  'file-loader',
  'html-webpack-plugin',
  'https-browserify',
  'os-browserify',
  'path-browserify',
  'process',
  'punycode',
  'querystring-es3',
  'raw-loader',
  'react-refresh',
  'sass-loader',
  'sass',
  'stream-browserify',
  'stream-http',
  'string_decoder',
  'string-replace-loader',
  'style-loader',
  'terser-webpack-plugin',
  'timers-browserify',
  'to-string-loader',
  'tslib',
  'tty-browserify',
  'typescript',
  'vm-browserify',
  'webpack-node-externals',
  'worker-loader',

  // Used by storybook
  '@storybook/addon-essentials',
  '@storybook/addon-interactions',
  '@storybook/addon-links',
  '@storybook/addon-onboarding',
  '@storybook/addon-styling-webpack',
  '@storybook/blocks',
  '@storybook/react-webpack5',
  '@storybook/react',
  '@storybook/testing-library',
  'storybook',

  // Used by CLI tools
  '@typescript-eslint/eslint-plugin',
  'csv-writer',
  'esm',
  'gulp-cli',
  'node-temp-mail',
  'patch-package',
  'sequelize-cli',
  'sequelize-cli',
  'ts-node',
  'tsconfig-paths',

  // Used as ambient types by typescript
  '@types/apple-signin-api',
  '@types/google.accounts',
  '@types/google.maps',
])

const ENTRY_POINTS = [
  'src/client/apps/image-targets/conical/unconify.worker.js',
  'src/client/apps/image-targets/conical/unconify.worker.d.ts',
  'src/client/index.tsx',
  'src/client/lightship/index.tsx',
  'src/client/arcade/arcade-index.tsx',
  'src/client/worker/index.ts',
  'src/client/desktop/index.tsx',
  'src/client/desktop/global.d.ts',
  'src/server/apps-server-entry.ts',
  'src/server/apps-server.ts',
  'src/server/console-server.ts',
  'src/server/scripts/staging-deploy.js',
  'src/client/studio/worker/gltf-transform-worker.ts',
  'src/server/app.ts',
  'src/client/smoke-test.tsx',
  'src/server/studio-use-ws-server.ts',
  'gulpfile.ts',
  'src/third_party/react-ace/worker/javascript-worker.ts',
  'tools/check-unused.ts',
  'deploy.js',
]

const IGNORED_PATHS = [
  '/src/shared/',
  '/src/client/static/public',
  '/src/client/static/root',
  '/src/client/static/index.html',
  '/src/client/desktop/index.html',
  '/src/client/static/lightship.html',
  '/src/client/static/arcade/arcade-index.html',
  '/src/client/ui/stories',
  '/src/client/static/g8-git',
  '/src/client/static/semantic',
  '/src/client/ui/semantic-ui-react.ts',
  '/src/shared/build8.ts',
  '/src/server/templates/',
  '/src/server/scripts/',
  '/src/server/public/',
  '/src/server/arcade/arcade-robots.txt',
  '/src/server/arcade/arcade-sitemap.xml',
  '/src/third_party/',
  '/src/shared/static.d.ts',
  '/src/shared/module/',
  '/src/shared/globals.d.ts',
  '/src/server/favicon.png',

  // Imported from src/third_party
  '/src/client/editor/texteditor/maybe-wire-grammars.ts',
  '/src/client/static/icons/editor-error.svg',
  '/src/client/static/icons/editor-warning.svg',
  '/src/client/editor/texteditor/syntaxes/',
]

// We'll need these eventually
const WAITING_FOR_USE = [
  '/src/client/ui/components/primary-radio-button.tsx',
  'src/client/common/delay.ts',
  'src/client/common/use-previous.ts',
  'src/client/static/brand_infin8.png',
  'src/client/studio/configuration/row-floating-panel-button.tsx',
  'src/client/ui/components/standard-modal-actions.tsx',
  'src/client/ui/components/standard-modal-content.tsx',
  'src/client/ui/components/standard-modal-header.tsx',
  'src/client/ui/components/standard-placeholder-paragraph.tsx',
  'src/client/ui/components/toast.tsx',
  'src/client/ui/typography.tsx',
]

const isIgnoredFile = (filePath: string) => (
  /(\/i18n\/.*\.(json|html)$)|.DS_Store|eslintrc|\.gitignore|(\.md$)|mock|\/BUILD$/
    .test(filePath) ||
  IGNORED_PATHS.some(e => filePath.includes(e))
)

const listFiles = async (files: string[], filePath: string) => {
  if (isIgnoredFile(filePath)) {
    return
  }
  const info = await runQueue.next(async () => statFile(filePath))

  if (info.isDirectory()) {
    const contents = await runQueue.next(async () => readDir(filePath))
    await Promise.all(contents.map(c => listFiles(files, path.join(filePath, c))))
  } else if (info.isFile()) {
    files.push(filePath)
  } else {
    console.warn('Ignoring', filePath)
  }
}

type AnalysisContext = {
  attemptedFiles: Set<string>
  crawledFiles: Set<string>
  resolvedDeps: Record<string, string[]>
  externalDeps: Set<string>
}

const BINARY_EXTENSIONS = [
  '.png', '.jpg', '.svg', '.webp', '.mp4', '.woff', '.wasm', '.gif', '.ico', '.json', '.capnp',
  '.webm', '.md',
]
const CODE_EXTENSIONS = ['.ts', '.js', '.tsx', '.d.ts']
const CODE_RESOLUTION_SUFFIXES = [...CODE_EXTENSIONS, ...CODE_EXTENSIONS.map(e => `/index${e}`)]

const parserByExtension: DeepReadonly<Record<string, string>> = {
  '.js': 'commonjs',
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.scss': 'scss',
  '.css': 'scss',
}

const storeExternalDependency = (importedName: string, ctx: AnalysisContext) => {
  if (importedName[0] === '@') {
    const [scope, packageName] = importedName.split('/')
    ctx.externalDeps.add(`${scope}/${packageName}`)
  } else {
    const name = importedName.split('/')[0]
    ctx.externalDeps.add(name)
    ctx.externalDeps.add(`@types/${name}`)
  }
}

const resolveDependencies = async (filePath: string, ctx: AnalysisContext) => {
  if (ctx.attemptedFiles.has(filePath)) {
    return
  }
  ctx.attemptedFiles.add(filePath)
  const ext = path.extname(filePath)
  if (BINARY_EXTENSIONS.includes(ext)) {
    return
  }

  let contents: string
  try {
    contents = await runQueue.next(() => readFile(filePath, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
      if (!CODE_EXTENSIONS.includes(ext)) {
        console.warn('Not found:', filePath)
      }
      return
    }
    throw err
  }

  const withExtensionDeps: string[] = []
  try {
    const type = parserByExtension[ext]

    if (!type) {
      console.warn('Unknown extension:', filePath)
      return
    }

    const deps: string[] = precinct(contents, {type, scss: {url: true}})
    const dir = path.dirname(filePath)
    deps.forEach(((importPath) => {
      if (!importPath.startsWith('.')) {
        storeExternalDependency(importPath, ctx)
        return
      }

      const fullPath = path.resolve(dir, importPath)

      if (path.extname(fullPath)) {
        withExtensionDeps.push(fullPath)
      } else {
        withExtensionDeps.push(...CODE_RESOLUTION_SUFFIXES.map(e => fullPath + e))
      }
    }))
  } catch (err) {
    console.error('Error while parsing', filePath)
    console.error(err)
    throw err
  }
  ctx.crawledFiles.add(filePath)
  ctx.resolvedDeps[filePath] = withExtensionDeps
  await Promise.all(withExtensionDeps.map(dep => resolveDependencies(dep, ctx)))
}

const logValidationFailures = (message: string, array: string[]) => {
  if (!array.length) {
    return
  }

  console.log(message.replace('COUNT', String(array.length)))
  array.forEach((e) => {
    console.log(`  ${e}`)
  })
}

// eslint-disable-next-line arrow-parens
const intersect = <T>(a: Set<T>, b: Set<T>): Array<T> => [...a].filter(e => b.has(e))

// eslint-disable-next-line arrow-parens
const subtract = <T>(a: Set<T>, b: Set<T>): Array<T> => [...a].filter(e => !b.has(e))

const run = async () => {
  const ctx: AnalysisContext = {
    attemptedFiles: new Set(),
    crawledFiles: new Set(),
    resolvedDeps: {},
    externalDeps: new Set(),
  }

  console.warn('Listing files')

  const allFiles: string[] = []
  await listFiles(allFiles, path.join(process.cwd(), 'src'))

  console.warn('Listed', allFiles.length, 'source files.')

  await Promise.all(ENTRY_POINTS.map(filename => (
    resolveDependencies(path.join(process.cwd(), filename), ctx)
  )))

  // NOTE(christoph): Some scss constructs like "meta.load-css(...)" aren't being detected
  //  as imports so force them to resolve here.
  await Promise.all(allFiles.filter(e => e.endsWith('.scss')).map(filePath => (
    resolveDependencies(filePath, ctx)
  )))

  console.warn('Crawled', ctx.crawledFiles.size, 'files.')

  const waitingForUsePaths = WAITING_FOR_USE.map(f => path.join(process.cwd(), f))

  waitingForUsePaths.forEach((f) => {
    if (ctx.attemptedFiles.has(f)) {
      console.warn('File is no longer unused, please remove from WAITING_FOR_USE list:', f)
    }
  })

  const unusedFiles = allFiles.filter(file => (
    !waitingForUsePaths.includes(file) && !ctx.attemptedFiles.has(file)
  )).sort()

  logValidationFailures(
    'Found COUNT unused files.',
    unusedFiles.map(e => path.join(path.relative(process.cwd(), e)))
  )

  // Validating all dependencies are used by something
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'))

  const dependencies = [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.devDependencies),
  ]

  const unusedExternals = dependencies.filter(e => (
    !ctx.externalDeps.has(e) && !IGNORED_UNUSED_PACKAGES.has(e)
  ))
  logValidationFailures('Found COUNT unused dependencies.', unusedExternals)

  logValidationFailures(
    'Found COUNT ignored dependencies that are not installed.',
    subtract(IGNORED_UNUSED_PACKAGES, new Set(dependencies))
  )

  logValidationFailures(
    'Found COUNT ignored dependencies that are actually used.',
    intersect(IGNORED_UNUSED_PACKAGES, ctx.externalDeps)
  )
}

run()
