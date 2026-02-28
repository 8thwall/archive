type Url = `https://${string}`

type ThirdPartyDomain = (
  'cdn.jsdelivr.net' | 'unpkg.com' | 'preview.babylonjs.com' | 'cdnjs.cloudflare.com'
)

// NOTE(christoph): We don't want to reference cdn.8thwall.com URLs in script tags
type ScriptSrc = `https://${ThirdPartyDomain}/${string}` | `./external/${string}`

type ResolvedScriptDependency = {
  url?: Url
  path?: string
  scriptSrc?: ScriptSrc
}

const CDN_WEB: Url = 'https://cdn.8thwall.com/web'

const joinVersion = (name: string, divider: string, version: string): string => {
  if (version) {
    return `${name}${divider}${version}`
  } else {
    return name
  }
}

const makeJsDelivrNpmUrl = (
  project: string,
  version: string,
  file: string
): ResolvedScriptDependency => ({
  scriptSrc: `https://cdn.jsdelivr.net/npm/${joinVersion(project, '@', version)}/${file}`,
})

const makeJsDelivrGitUrl = (
  project: string,
  version: string,
  file: string
): ResolvedScriptDependency => ({
  scriptSrc: `https://cdn.jsdelivr.net/gh/${joinVersion(project, '@v', version)}/${file}`,
})

const makeUnpkgUrl = (project: string,
  version: string,
  file: string): ResolvedScriptDependency => ({
  scriptSrc: `https://unpkg.com/${joinVersion(project, '@', version)}/${file}`,
})

const aframeForVersion = (version: string): Url => {
  if (version === '' || version === 'beta') {
    return `${CDN_WEB}/aframe/8frame-0.9.2.min.js`
  }
  return `${CDN_WEB}/aframe/8frame-${version}.min.js`
}

const threejsForVersion = (version: string): ResolvedScriptDependency => {
  if (!version) {
    return null
  }
  if (version.endsWith('multiview')) {
    return {url: `${CDN_WEB}/threejs/r${version}/three.min.js`}
  }
  const releaseNumber = version.split('.')[0]
  const number = Number(releaseNumber)
  if (number <= 128) {
    return {scriptSrc: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r${version}/three.min.js`}
  } else if (version.includes('.')) {
    return {scriptSrc: `https://cdn.jsdelivr.net/npm/three@0.${version}/build/three.min.js`}
  } else {
    return {scriptSrc: `https://cdn.jsdelivr.net/npm/three@0.${version}.0/build/three.min.js`}
  }
}

const extractScriptDependency = (
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  version: string
): ResolvedScriptDependency | null => {
  switch (name) {
    case 'aframe':
      return {url: aframeForVersion(version)}
    case 'babylonjs':
      if (version === 'beta') {
        return {scriptSrc: 'https://preview.babylonjs.com/babylon.js'}
      }
      return makeJsDelivrNpmUrl('babylonjs', version, 'babylon.min.js')
    case 'threejs':
      return threejsForVersion(version)
    case '@8thwall.xrextras':
      return {
        // Built with `./apps/client/public/web/xrextras/tools/bundle.sh` from
        // https://github.com/8thwall/code8/pull/5223
        // When updating this, make sure to also update XREXTRAS_SHARED_RESOURCES_URL in
        // reality/cloud/xrhome/src/client/editor/modals/nae/export-flow-code.tsx.
        url: `${CDN_WEB}/offline-code-export/xrextras/xrextras-mkd7rymy.zip`,
        path: 'external/xrextras/',
        scriptSrc: './external/xrextras/xrextras.js',
      }
    case '@aframe.aframe-extras':
      return makeJsDelivrGitUrl('donmccurdy/aframe-extras', version, 'dist/aframe-extras.min.js')
    case '@aframe.aframe-physics-system':
      return makeJsDelivrGitUrl(
        'donmccurdy/aframe-physics-system',
        version || 'v4.0.1',
        'dist/aframe-physics-system.min.js'
      )
    case '@mrcs.holovideoobject':
      return null
    case '@react.react':
      return makeUnpkgUrl('react', version, 'umd/react.production.min.js')
    case '@react.react-dom':
      return makeUnpkgUrl('react-dom', version, 'umd/react-dom.production.min.js')
    case '@react.react-router-dom':
      return makeUnpkgUrl(
        'react-router-dom',
        // NOTE(christoph): Something broke in version 6 so we froze it
        version || '5.3.0',
        'umd/react-router-dom.min.js'
      )
    case '@vuejs.vue':
      return null
    case '@8thwall.landing-page':
      return {
        // Built with `./apps/client/public/web/landing8/tools/bundle.sh` from
        // https://github.com/8thwall/code8/pull/5226
        url: `${CDN_WEB}/offline-code-export/landing-page/landing-page-mkd7ktqc.zip`,
        path: 'external/landing-page/',
        scriptSrc: './external/landing-page/landing-page.js',
      }
    case '@8thwall.coaching-overlay':
      return {
        url: `${CDN_WEB}/coaching-overlay/${joinVersion('coaching-overlay', '-', version)}.js`,
      }
    default:
      return null
  }
}

export {
  extractScriptDependency,
}
