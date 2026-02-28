import path from 'path'
import {promises as fs} from 'fs'

import * as htmlparser2 from 'htmlparser2'
import {render as serialize} from 'dom-serializer'

import type {
  AssetDownloadedCallbackArgs,
} from '@nia/reality/app/nae/packager/html-app-asset-provider'

import {
  sanitizePath,
  isAssetUrl,
  shouldUseXrEngine,
} from '@nia/reality/app/nae/packager/html-app-asset-utils'

import type {HtmlAppConfig} from '@nia/reality/shared/nae/nae-types'
import type {StoredAssetManifest} from '@nia/c8/ecs/src/shared/asset-manifest'

const replaceAbsoluteUrls = (
  htmlText: string,
  urlPrefix: string,
  scriptsToExclude: string[],
  forceDeferXrWeb: boolean
) => {
  const dom = htmlparser2.parseDocument(htmlText)
  htmlparser2.DomUtils.findAll((elem) => {
    const targetTypes = ['script', 'tag']
    if (targetTypes.includes(elem.type)) {
      // Remove script tags that match any in scriptsToExclude
      if (elem.name === 'script' &&
          scriptsToExclude.some(script => elem.attribs?.src?.endsWith(script))) {
        htmlparser2.DomUtils.removeElement(elem)
        return false
      }

      if (elem.attribs) {
        // Replace absolute URLs in src, data-xrweb-src, and href attributes
        for (const key of ['src', 'data-xrweb-src', 'href']) {
          if (elem.attribs[key]) {
            let url = elem.attribs[key]
            url = url
              .replace(/https?:\/\/[^/\s"']+\//g, urlPrefix)
              .replace(/^\//, urlPrefix)
            elem.attribs[key] = url

            // NOTE(lreyna): This is somewhat of a temporary solution to avoid app8 from logging
            // errors when the xrweb script is not included with the bundled. Though, there might be
            // other cases in the future where we would want to force defer loading of xrweb.
            // See: apps/client/public/web/app8/src/app8.js
            if (forceDeferXrWeb && key === 'data-xrweb-src') {
              elem.attribs['data-xrweb-defer'] = 'true'
            }
          }
        }
      }

      // Also replace absolute URLs in inline script/style content
      if (elem.children?.length > 0) {
        for (const child of elem.children) {
          if (child.type === 'text' && child.data) {
            child.data = child.data.replace(/(['"`])\/([^/][^'"`]*)\1/g, `$1${urlPrefix}$2$1`)
          }
        }
      }
    }
    return false
  }, dom.children)

  return serialize(dom)
}

const createOnAssetDownloadedLocalCallback = (
  appConfig: HtmlAppConfig,
  baseDownloadPath: string,
  urlPrefix: string
) => async (args: AssetDownloadedCallbackArgs) => {
  /* eslint-disable no-console */
  const {response, requestUrl} = args

  let urlPath = new URL(requestUrl).pathname

  // NOTE(lreyna): At the moment, dev8 scripts don't properly connect to the webpack dev server,
  // so we remove them from the build using this flag.
  const fileNameExcludesPattern: string[] = [
    'dev8.js',
  ]

  try {
    // Check if response is ok and body is readable
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is empty')
    }

    if (!appConfig.appInfo?.appName) {
      throw new Error('App config is missing app name')
    }

    if (fileNameExcludesPattern.some(pattern => urlPath.endsWith(pattern))) {
      console.log(`Skipping excluded asset ${urlPath}`)
      return
    }

    // We assume that a fetched `text/html` asset with no extension is
    // the main HTML file of the app.
    // This should be the case for apps built through xrhome.
    // - See: reality/cloud/xrhome/src/shared/hosting-urls.ts
    // This is also needed for the `dist_{commitId}-{buildHash}.js` file to have the correct
    // relative path to the main HTML file.
    const contentType = response.headers.get('content-type') || ''
    const isAppRoot = response.url.endsWith(`/${appConfig.appInfo.appName}/`)
    if (contentType.includes('text/html') && !urlPath.endsWith('.html')) {
      urlPath = isAppRoot ? 'index.html' : path.join(urlPath, 'index.html')
    }

    // Only sanitize asset urls, since we can control how they are referenced in the app.
    // We do this by manipulating the assetManifest in the bundle.js file.
    if (isAssetUrl(requestUrl)) {
      urlPath = sanitizePath(urlPath)
    }
    const filePath = path.join(baseDownloadPath, urlPath)
    const dirPath = path.dirname(filePath)

    await fs.mkdir(dirPath, {recursive: true})

    let fileContent: Buffer

    if (contentType.includes('text/html')) {
      const text = await response.text()
      const modifiedText = replaceAbsoluteUrls(
        text,
        urlPrefix,
        fileNameExcludesPattern,
        !shouldUseXrEngine(appConfig)
      )
      fileContent = Buffer.from(modifiedText, 'utf8')
    } else if (
      contentType.includes('application/javascript') ||
        contentType.includes('text/javascript')
    ) {
      // TODO(lreyna): Maybe only replace urls that are going to be bundled in the app...
      const text = await response.text()
      const ORIGINS_TO_REPLACE = ['https://cdn.8thwall.com/', 'https://static.8thwall.app/']
      let modifiedText = text
        .replace(/(?<!:)\/\/cdn\.8thwall\.com\//g, match => `https:${match}`)
        .replace(/https?:\/\/[^/\s"']+\//g, (match) => {
          if (ORIGINS_TO_REPLACE.some(url => match.startsWith(url))) {
            return urlPrefix
          }

          // TODO(lreyna): Set up a better way to handle /v/ endpoints for static / offline,
          // this works as a temporary solution. We can probably do a different regex
          // e.g. xr-simd-27.4.11.427.js has 'fetch(`https://${Og()}/v/${A}/${B}${g}`)'
          // Force the /v/ endpoints to use the custom schema
          if (requestUrl.includes('cdn.8thwall.com/xr-') && match.includes('${')) {
            return urlPrefix
          }

          return match
        })

      if (requestUrl.endsWith('bundle.js')) {
        if (args.assetManifest) {
          const assetMap = args.assetManifest.assets as Record<string, string>
          const newAssetMap = Object.fromEntries(
            Object.entries(assetMap).map(([key, value]) => [
              key, urlPrefix + sanitizePath(value).replace(/^\//, ''),
            ])
          )

          const assetManifestString = JSON.stringify(args.assetManifest)
          const newAssetManifestString = JSON.stringify(
            {assets: newAssetMap} as StoredAssetManifest
          )

          modifiedText = modifiedText.replace(assetManifestString, newAssetManifestString)
        }

        // Need to handle `require` statements which will have paths like: /{app_name}/asset/path
        const {appName} = appConfig.appInfo
        const assetLoaderRegex = new RegExp(`\\.exports="/${appName}/assets/`, 'g')
        modifiedText = modifiedText.replace(assetLoaderRegex, `.exports="${urlPrefix}assets/`)
      }

      fileContent = Buffer.from(modifiedText, 'utf8')
    } else {
      const buffer = await response.arrayBuffer()
      fileContent = Buffer.from(buffer)
    }

    await fs.writeFile(filePath, fileContent)
    console.log(`Wrote asset to ${filePath}`)
  } catch (error) {
    console.error(`Failed to write asset for ${urlPath}:`, error)
  }
  /* eslint-enable no-console */
}

export {
  createOnAssetDownloadedLocalCallback,
}
