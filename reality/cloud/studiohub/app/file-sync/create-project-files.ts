// @dep(//reality/cloud/studiohub/app/file-sync:studio-tsconfig)

import fs from 'fs/promises'
import path from 'path'
import type {RuntimeVersionTarget} from '@nia/c8/ecs/src/shared/runtime-version'
import {studioTsconfigJson} from 'reality/cloud/studiohub/app/file-sync/studio-tsconfig'
import {
  generateRuntimeUrl,
  generateDev8Url,
  generateRuntimeArtifactUrl,
} from '@nia/reality/shared/studio/generate-url'
import type {Expanse} from '@nia/c8/ecs/src/shared/scene-graph'
import {loadEcsManifest} from '@nia/reality/shared/studio/load-ecs-manifest'

import Handlebars from 'handlebars'

import {makeCodedError} from '../../errors'
import {getAppServerUrl} from '../app-server-url'
import {getProjectSrcPath} from '../../project-helpers'

type GenerateIndexHtmlParams = {
  appKey: string
  runtimeUrl: string
  dev8Url: string
}

const generateIndexHtml = (params: GenerateIndexHtmlParams) => {
  // NOTE(dat): When we serve locally, the webpack-dev-server is NOT first-party to xrweb. To allow
  // third-party cookies, we need to set the xrweb script tag to use-credentials. This is different
  // from how we do it on prod. On prod, we serve xrweb as a first party script. The page is at
  // dat-default-8w.8thwall.app and xrweb is at dat-default-8w.8thwall.app/xrweb.
  // TODO(dat): Switch to serving xrweb locally from webpack-dev-server. This will allow us to
  // update crossorigin back to anonymous. This is also closer to how prod does it.
  /* eslint-disable max-len */
  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Studio Project</title>
    <script>window.DEV_8W_NO_BUILD_RELOAD = true;</script>
    <script>if (new URLSearchParams(window.location.search).has('channel')) sessionStorage.setItem('ORIGINAL_PAGE_URL', window.location.href)</script>
    <script>if (sessionStorage.getItem('ORIGINAL_PAGE_URL') && window.location.href !== sessionStorage.getItem('ORIGINAL_PAGE_URL')) window.location.href = sessionStorage.getItem('ORIGINAL_PAGE_URL')</script>
    <script src="${getAppServerUrl()}/xrweb?appKey={{appKey}}&s=1" crossorigin="use-credentials"></script>
    <script src="{{runtimeUrl}}" crossorigin="anonymous"></script>
    <script src="{{dev8Url}}" crossorigin="anonymous"></script>
  </head>
  <body>
  </body>
</html>`
  /* eslint-enable max-len */
  const compiledTemplate = Handlebars.compile(template)
  return compiledTemplate(params)
}

const generateEcsDefinition = async (runtimeTarget: RuntimeVersionTarget | null) => {
  try {
    const url = generateRuntimeArtifactUrl(runtimeTarget, 'ecs-definition-file.ts')

    const ecsResponse = await fetch(url)
    if (!ecsResponse.ok) {
      throw new Error(`Failed to fetch ECS definitions: ${ecsResponse.status}`)
    }
    return await ecsResponse.text()
  } catch (error) {
    throw makeCodedError('Error fetching ECS definitions', 500)
  }
}

const writeFileIfChanged = async (filePath: string, newContent: string) => {
  const existingContent = await fs.readFile(filePath, 'utf8').catch(() => '')
  if (existingContent !== newContent) {
    await fs.writeFile(filePath, newContent, 'utf8')
  }
}

const generateProjectFiles = async (
  projectLocation: string,
  runtimeTarget: RuntimeVersionTarget | null,
  appKey: string
) => {
  const genDirPath = path.join(projectLocation, '.gen')
  const typesDir = path.join(genDirPath, 'types')
  await fs.mkdir(typesDir, {recursive: true})

  const indexHtmlPath = path.join(genDirPath, 'index.html')
  const ecsTypePath = path.join(typesDir, 'ecs.d.ts')

  const srcPath = getProjectSrcPath(projectLocation)
  const {manifest} = await loadEcsManifest({srcPath, manifestFile: 'manifest.json'})

  const runtimeUrl = generateRuntimeUrl(manifest || null, runtimeTarget)
  const dev8Url = generateDev8Url(manifest || null, runtimeTarget)
  const html = generateIndexHtml({appKey, runtimeUrl, dev8Url})

  const ecsDef = await generateEcsDefinition(runtimeTarget)

  // Only write files if content has changed to avoid triggering webpack hot reload
  await Promise.all([
    writeFileIfChanged(indexHtmlPath, html),
    writeFileIfChanged(ecsTypePath, ecsDef),
  ])
}

const projectSetup = async (savePath: string) => {
  const tsconfigPath = path.join(savePath, 'tsconfig.json')
  const packageJsonPath = path.join(savePath, 'package.json')

  // Create .gen directory structure but don't generate HTML/types yet
  const genDirPath = path.join(savePath, '.gen')
  const typesDir = path.join(genDirPath, 'types')

  try {
    await Promise.all([
      fs.mkdir(typesDir, {recursive: true}),
      fs.writeFile(tsconfigPath, studioTsconfigJson, 'utf8'),
      fs.writeFile(packageJsonPath, '{}', 'utf8'),
    ])
  } catch (error) {
    throw makeCodedError('Error writing project files', 500)
  }
}

const updateGeneratedFiles = async (
  projectLocation: string,
  appKey: string
) => {
  try {
    const srcPath = getProjectSrcPath(projectLocation)
    const expanseFilePath = path.join(srcPath, '.expanse.json')
    let runtimeTarget: RuntimeVersionTarget | null

    try {
      const expanseContent = await fs.readFile(expanseFilePath, 'utf8')
      const expanse: Expanse = JSON.parse(expanseContent)
      runtimeTarget = expanse?.runtimeVersion || null
    } catch (e) {
      return
    }

    await generateProjectFiles(projectLocation, runtimeTarget, appKey)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to update generated files for expanse:', error)
  }
}

export {
  projectSetup,
  updateGeneratedFiles,
}
