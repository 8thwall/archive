import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {PublishPageWrapper} from '../../publishing/publish-page-wrapper'
import {PublishTipBanner} from '../../publishing/publish-tip-banner'
import {useNaeStyles} from './nae-styles'
import {combine} from '../../../common/styles'
import {PrimaryButton} from '../../../ui/components/primary-button'
import {useCurrentGit} from '../../../git/hooks/use-current-git'
import useCurrentApp from '../../../common/use-current-app'
import {
  downloadBlob,
  zipEditorFolder,
  downloadAndExtractBundle,
  downloadAndZipAllImageTargetsForApp,
} from '../../../common/download-utils'
import useActions from '../../../common/use-actions'
import imageTargetsActions from '../../../image-targets/actions'
import {Icon} from '../../../ui/components/icon'
import {makeRunQueue} from '@nia/reality/shared/run-queue'
import {StaticBanner} from '../../../ui/components/banner'
import {SecondaryButton} from '../../../ui/components/secondary-button'
import {SpaceBetween} from '../../../ui/layout/space-between'
import {StandardLink} from '../../../ui/components/standard-link'
import {resolveAll} from '../../../../shared/async'
import {generateIndexHtml, type ScriptInfo} from '../../../common/generate-index-html-export'
import {getDisplayNameForApp} from '../../../../shared/app-utils'
import {extractScriptDependency} from './scripts'
import {basename} from '../../editor-common'

/* eslint-disable max-len */
const RUNTIME_BUNDLE_URL = 'https://cdn.8thwall.com/web/ecs/resources/bundle-202601131620.zip'
const STUDIO_BUILD_CONFIG_URL = 'https://cdn.8thwall.com/web/offline-code-export/studio/build-config/bundle-202601131539.zip'
const EDITOR_BUILD_CONFIG_URL = 'https://cdn.8thwall.com/web/offline-code-export/editor/build-config/bundle-202601131538.zip'
const XR_BUNDLE_URL = 'https://cdn.8thwall.com/web/offline-code-export/xr/bundle-202512051446.zip'
const XREXTRAS_SHARED_RESOURCES_URL = 'https://cdn.8thwall.com/web/offline-code-export/xrextras/xrextras-shared-resources-mkd7rymy.zip'
/* eslint-enable max-len */

interface IExportFlowCode {
  isStudio: boolean
  buildable?: boolean
}

interface ISupportedFeaturesSection {
  projectType: 'studio' | 'cloud-editor'
  buildable?: boolean
}

const useStyles = createUseStyles({
  featureList: {
    margin: 0,
    padding: 0,
    paddingLeft: '1rem',
  },
})

const SupportedFeaturesSection: React.FC<ISupportedFeaturesSection> =
({projectType, buildable}) => {
  const {t} = useTranslation('cloud-editor-pages')
  const classes = useStyles()
  return (
    <section>
      <SpaceBetween direction='vertical'>
        <div>
          {t('export_flow_code.included_features')}
          <ul className={classes.featureList}>
            <li>{t('export_flow_code.feature.code')}</li>
            <li>{t('export_flow_code.feature.image_targets')}</li>
            {buildable &&
              <>
                <li>{t('export_flow_code.feature.build_scripts')}</li>
                <li>{t('export_flow_code.feature.xr_engine')}</li>
                {projectType === 'cloud-editor' &&
                  <>
                    <li>{t('export_flow_code.feature.xr_extras')}</li>
                    <li>{t('export_flow_code.feature.landing_page')}</li>
                  </>
              }
                {projectType === 'studio' &&
                  <li>{t('export_flow_code.feature.studio_runtime')}</li>
              }
              </>
            }
          </ul>
        </div>
        {buildable &&
          <StaticBanner type='danger'>
            <div>
              {t('export_flow_code.disclaimer.unsupported')}
              <ul className={classes.featureList}>
                <li>{t('export_flow_code.feature.vps_maps')}</li>
                <li>{t('export_flow_code.feature.hand_tracking')}</li>
                <li>{t('export_flow_code.feature.modules_backends')}</li>
              </ul>
            </div>
          </StaticBanner>
        }
      </SpaceBetween>
    </section>
  )
}

/* eslint-disable local-rules/hardcoded-copy, max-len, local-rules/multiline-ternary */
const EXPANSE_JSON_PATH = '\n    - Your scene graph is in `src/.expanse.json`. If you are on Mac and don\'t see this, press `Cmd + Shift + .` to show hidden files.'
const FONT8_UPDATE_NOTE = '\n      - Custom `.font8` fonts need to be updated to the `.font8` file in the folder, i.e., if your font is at `assets/myfont.font8/`, update your code to reference `assets/myfont.font8/myfont_file.font8`.'

const generateSrcImageTargetsContent = (isStudio: boolean) => `- \`src/\`: Contains all your original project code and assets.${isStudio ? EXPANSE_JSON_PATH : ''}
    - References to asset bundles will need to be updated. Asset bundles are now plain folders. For example,
      - GLTF bundles need to be updated to the \`.gltf\` file in the folder, i.e., if your model is at \`assets/mymodel.gltf/\`, update your code to reference \`assets/mymodel.gltf/mymodel_file.gltf\`.${isStudio ? FONT8_UPDATE_NOTE : ''}
- \`image-targets/\`: Contains your project's image targets (if any).
  - The image target with the \`_target\` suffix is the image target loaded by the engine. The others are used for various display purposes, but are exported for your convenience.`

const generateBuildableReadmeContent = (isStudio: boolean) => `### Your Exported Project
This zip contains your project source code, assets, image targets, and configuration needed to build and publish your 8th Wall project. It does not connect to any 8th Wall services, so will work even after the 8th Wall servers are shut down.

### Setup
If node/npm are not installed, install using https://github.com/nvm-sh/nvm or https://nodejs.org/en/download.

Run \`npm install\` in this folder.

### Development
Run \`npm run serve\` to run the development server.

#### Testing on Mobile
To test your project on mobile devices, especially for AR experiences that require camera access, you'll need to serve your development server over HTTPS. We recommend using [ngrok](https://ngrok.com/) to create a secure tunnel to your local server. After setting up ngrok, add the following configuration to \`config/webpack.config.js\` under the \`devServer\` section:

\`\`\`javascript
devServer: {
  // ... existing config
  allowedHosts: ['.ngrok-free.dev']
}
\`\`\`

### Publishing
Run \`npm run build\` to generate a production build. The resulting build will be in \`dist/\`. You can host this bundle on any web server you want.

### Project Overview
${generateSrcImageTargetsContent(isStudio)}
  - To enable image targets, call this in \`app.js\` or \`app.ts\` file. (Note: \`app.js\` or \`app.ts\` may not be created by default; you will need to create this file yourself.) The autoload targets will have a \`"loadAutomatically": true\` property in their json file.
\`\`\`javascript
const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/target1.json'),
      require('../image-targets/target2.json'),
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
\`\`\`
- \`config/\`: Contains the necessary webpack configuration and typescript definitions to support project development.
- \`external/\`: Contains dependencies used by your project, loaded in \`index.html\`.
  - If you are not using the XR Engine, you can remove the xr.js script tag from \`index.html\` and delete the \`external/xr/\` folder to save bandwidth.
  - You can also customize whether \`face\`, \`slam\`, or both, are loaded on the \`data-preload-chunks\` attribute.

### Final Notes
Please reach out to support@8thwall.com with any questions not yet answered in the docs. Thank you for being part of 8th Wall's story!`

const generateReadmeContent = (isStudio: boolean) => `### Your Exported Project
This zip contains your project source code, assets, and image targets.

### Project Overview
${generateSrcImageTargetsContent(isStudio)}

### Final Notes
Please reach out to support@8thwall.com with any questions not yet answered in the docs. Thank you for being part of 8th Wall's story!`
/* eslint-enable local-rules/hardcoded-copy, max-len, local-rules/multiline-ternary */

type ProgressState = {
  stage: 'code'
} | {
  stage: 'assets'
  current: number
  total: number
} | {
  stage: 'targets'
  current: number
  total: number
} | {
  stage: 'dependencies'
  current: number
  total: number
} | {
  stage: 'complete-with-warnings'
  warnings: string[]
  blob: Blob
}

type Dependency = {
  url: string
  path: string
  name: string
  scriptSrc?: string
  scriptAttributes?: Record<string, string>
}

const ExportFlowCode: React.FC<IExportFlowCode> = ({isStudio, buildable}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const classes = useNaeStyles()
  const app = useCurrentApp()
  const git = useCurrentGit()
  const {fetchAllImageTargetsForApp} = useActions(imageTargetsActions)
  const [progressState, setProgressState] = React.useState<ProgressState | null>(null)

  const isBuilding = !!progressState && progressState.stage !== 'complete-with-warnings'

  const handleExport = async () => {
    try {
      setProgressState({stage: 'code'})

      const JsZip = (await import('jszip')).default
      const zip = new JsZip()

      const warnings: string[] = []

      zip.file(
        'README.md',
        buildable ? generateBuildableReadmeContent(isStudio) : generateReadmeContent(isStudio)
      )

      try {
        await zipEditorFolder({
          zip,
          filesByPath: git.filesByPath,
          folderPrefixToAdd: 'src/',
          onProgress: (current, total) => {
            setProgressState({stage: 'assets', current, total})
          },
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        warnings.push(t('export_flow_code.feature.code'))
      }

      if (BuildIf.EXPORT_BUILDABLE_CODE_20251205 && buildable) {
        const scripts: (string | ScriptInfo)[] = []
        const dependencies: Dependency[] = []
        let completed = 0
        if (isStudio) {
          dependencies.push({
            url: RUNTIME_BUNDLE_URL,
            path: 'external/runtime/',
            name: t('export_flow_code.feature.studio_runtime'),
            scriptSrc: './external/runtime/runtime.js',
          })
          dependencies.push({
            url: STUDIO_BUILD_CONFIG_URL,
            path: '',
            name: t('export_flow_code.feature.build_scripts'),
          })
        } else {
          dependencies.push({
            url: EDITOR_BUILD_CONFIG_URL,
            path: '',
            name: t('export_flow_code.feature.build_scripts'),
          })
          const headContent = git.filesByPath['head.html']?.content
          if (headContent) {
            const {parseHead} = await import('./parse-head')
            const parsedDependencies = await parseHead(headContent)
            parsedDependencies.forEach(({name, version}) => {
              const resolved = extractScriptDependency(name, version)
              if (resolved?.url) {
                const path = resolved.path || `external/scripts/${basename(resolved.url)}`
                const scriptSrc = resolved.scriptSrc || `./${path}`
                dependencies.push({
                  url: resolved.url,
                  path,
                  name,
                  scriptSrc,
                })
              } else if (resolved?.scriptSrc) {
                scripts.push(resolved.scriptSrc)
              } else {
                warnings.push(name)
              }
            })

            if (parsedDependencies.find(dependency => dependency.name === '@8thwall.xrextras') ||
              parsedDependencies.find(dependency => dependency.name === '@8thwall.landing-page')) {
              dependencies.push({
                url: XREXTRAS_SHARED_RESOURCES_URL,
                path: 'external/xrextras-shared-resources/',
                name: 'xrextras-shared-resources',
              })
            }
          }
        }

        dependencies.push({
          url: XR_BUNDLE_URL,
          path: 'external/xr/',
          name: t('export_flow_code.feature.xr_engine'),
          scriptSrc: './external/xr/xr.js',
          scriptAttributes: {
            'data-preload-chunks': 'face, slam',
          },
        })

        if (dependencies.length) {
          setProgressState({stage: 'dependencies', current: 0, total: dependencies.length})

          const queue = makeRunQueue(10)
          await resolveAll(dependencies.map(dependency => queue.next(async () => {
            const {url, path, name, scriptSrc, scriptAttributes} = dependency
            try {
              if (url.endsWith('.zip')) {
                await downloadAndExtractBundle(zip, url, path)
              } else {
                const res = await fetch(url, {mode: 'cors', credentials: 'omit'})
                if (!res.ok) {
                  throw new Error(`Error downloading ${url}: ${res.status} - ${res.statusText}`)
                }
                const blob = await res.blob()
                zip.file(path, blob)
              }
              if (scriptSrc) {
                if (scriptAttributes) {
                  scripts.push({
                    src: scriptSrc,
                    attributes: scriptAttributes,
                  })
                } else {
                  scripts.push(scriptSrc)
                }
              }
              completed++
              setProgressState({
                stage: 'dependencies',
                current: completed,
                total: dependencies.length,
              })
            } catch (error) {
            // eslint-disable-next-line no-console
              console.error(error)
              warnings.push(name)
            }
          })))
        }

        let headContent = null
        let bodyContent = null
        if (!isStudio) {
          headContent = git.filesByPath['head.html']?.content
          bodyContent = git.filesByPath['body.html']?.content
        }
        try {
          const indexHtmlContent = await generateIndexHtml({
            title: getDisplayNameForApp(app),
            description: app.appDescription || '',
            scripts,
            headContent,
            bodyContent,
          })
          zip.file('src/index.html', new Blob([indexHtmlContent], {type: 'text/html'}))
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
          warnings.push('index.html')
        }
      }

      const imageTargetWarnings = await downloadAndZipAllImageTargetsForApp(
        zip,
        app.uuid,
        fetchAllImageTargetsForApp,
        t,
        setProgressState
      )
      warnings.push(...imageTargetWarnings)

      const zipBlob = await zip.generateAsync({type: 'blob'})

      if (warnings.length) {
        setProgressState({
          stage: 'complete-with-warnings',
          warnings,
          blob: zipBlob,
        })
      } else {
        downloadBlob(zipBlob, `${app.appName}.zip`)
        setProgressState(null)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      setProgressState(null)
    }
  }

  const renderDisplayText = () => {
    if (!progressState) {
      return null
    }
    switch (progressState.stage) {
      case 'code':
        return t('export_flow_code.status.code')
      case 'assets':
        return t('export_flow_code.status.assets', {
          current: progressState.current,
          total: progressState.total,
        })
      case 'targets':
        return t('export_flow_code.status.image_targets', {
          current: progressState.current,
          total: progressState.total,
        })
      case 'dependencies':
        return t('export_flow_code.status.dependencies', {
          current: progressState.current,
          total: progressState.total,
        })
      case 'complete-with-warnings':
        return progressState.warnings.length
          ? (
            <div className={classes.iconAndTextContainer}>
              <Icon stroke='info' color='danger' size={0.75} />
              <span className={combine(classes.displayText, classes.error)}>
                {t('export_flow_code.status.error', {
                  warnings: progressState.warnings.join(', '),
                })}
              </span>
            </div>
          )
          : (
            <div className={classes.iconAndTextContainer}>
              <span className={combine(classes.displayText, classes.success)}>
                {t('export_flow_code.status.complete')}
              </span>
            </div>
          )
      default:
        return null
    }
  }

  const renderActionButton = () => {
    if (progressState?.stage === 'complete-with-warnings') {
      return (
        <SpaceBetween direction='horizontal'>
          <SecondaryButton height='small' onClick={handleExport}>
            {t('export_flow_code.button.retry')}
          </SecondaryButton>
          <PrimaryButton
            height='small'
            onClick={() => {
              downloadBlob(progressState.blob, `${app.appName}.zip`)
              setProgressState(null)
            }}
          >
            { t('export_flow_code.button.download_anyway')}
          </PrimaryButton>
        </SpaceBetween>
      )
    }

    return (
      <PrimaryButton
        height='small'
        loading={!!progressState}
        onClick={handleExport}
        disabled={!BuildIf.EXPORT_BUILDABLE_CODE_20251205 && buildable}
        a8='click;cloud-editor-export-flow;export'
      >
        {!BuildIf.EXPORT_BUILDABLE_CODE_20251205 && buildable
          ? t('export_flow_code.button.coming_soon')
          : t('export_flow_code.button.export')
        }
      </PrimaryButton>
    )
  }

  const getHeadline = () => {
    if (!buildable) {
      return t('export_flow_code.heading')
    }
    if (BuildIf.EXPORT_BUILDABLE_CODE_20251205) {
      return t('export_flow_code.heading_buildable')
    }
    return t('export_flow_code.heading_coming_soon')
  }

  return (
    <PublishPageWrapper
      headline={getHeadline()}
      headlineType='web'
      showProgressBar={isBuilding}
      displayText={renderDisplayText()}
      actionButton={renderActionButton()}
    >
      <div className={classes.rightCol}>
        {isBuilding && <div className={combine(classes.dimmer, classes.smallMonitorVisible)} />}
        <PublishTipBanner
          iconStroke='pointLight'
          content={(
            <Trans
              ns='cloud-editor-pages'
              i18nKey={
                buildable
                  ? 'export_flow_code.message.explanation_buildable'
                  : 'export_flow_code.message.explanation'
              }
              components={{
                docLink: <StandardLink newTab href='https://8th.io/code-export-docs' />,
              }}
            />
          )}
        />
        <SupportedFeaturesSection
          projectType={isStudio
            ? 'studio'
            : 'cloud-editor'}
          buildable={buildable}
        />
      </div>
    </PublishPageWrapper>
  )
}

export {ExportFlowCode}
