// @sublibrary(:dom-core-lib)
import type {EnvironmentSettings} from './environment'
import type {Destination} from './fetch-api'
import type {ModuleScript} from './script'
import type {Window} from './window'
import {
  environmentSettingsSym,
} from './document-symbols'
import {
  importMapSym,
} from './window-symbols'
import type {
  ImportMap,
  ModuleSpecifierMap,
} from './import-map'

type ImportAttributeRecord = {
  key: string
  value: string
}

type ModuleRequestRecord = {
  specifier: string
  attributes: ImportAttributeRecord[]
}

const moduleTypeFromModuleRequest = (
  moduleRequest: ModuleRequestRecord
): string | null => {
  // 1. Let moduleType be "javascript".
  let moduleType: string | null = 'javascript'

  // 2. If moduleRequest.[[Attributes]] has a Record entry such that entry.[[Key]] is "type", then:
  for (const entry of moduleRequest.attributes) {
    if (entry.key === 'type') {
      // 1. If entry.[[Value]] is "javascript", then set moduleType to null.
      if (entry.value === 'javascript') {
        moduleType = null
      } else {
        // 2. Otherwise, set moduleType to entry.[[Value]].
        moduleType = entry.value
      }
    }
  }
  // 3. Return moduleType.
  return moduleType
}

// The module type allowed steps, given a string moduleType and an environment settings object
// settings, are as follows:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#module-type-allowed
const moduleTypeAllowed = (
  moduleType: string | null,
  settings: EnvironmentSettings  // eslint-disable-line @typescript-eslint/no-unused-vars
): moduleType is ('javascript' | 'css' | 'json'
) => {
  // 1. If moduleType is not "javascript", "css", or "json", then return false.
  if (moduleType === null || !['javascript', 'css', 'json'].includes(moduleType)) {
    return false
  }

  // 2. If moduleType is "css" and the CSSStyleSheet interface is not exposed in settings's realm,
  // then return false.
  // [NOT IMPLEMENTED]

  // 3. Return true.
  return true
}

// The fetch destination from module type steps, given a destination defaultDestination and a string
// moduleType, are as follows:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#fetch-destination-from-module-type
const fetchDestinationFromModuleType = (
  defaultDestination: Destination, moduleType: string
): Destination => {
  // 1. If moduleType is "json", then return "json".
  if (moduleType === 'json') {
    return 'json'
  }

  // 2. If moduleType is "css", then return "style".
  if (moduleType === 'css') {
    return 'style'
  }

  // 3. Return defaultDestination.
  return defaultDestination
}

// To resolve a URL-like module specifier, given a string specifier and a URL baseURL:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#resolving-a-url-like-module-specifier
const resolveUrlLikeModuleSpecifier = (specifier: string, baseURL: string): URL | null => {
  // 1. If specifier starts with "/", "./", or "../", then:
  if (specifier.match(/^\/|\.\.?\/.*/)) {
    let url: URL
    try {
      // 1. Let url be the result of URL parsing specifier with baseURL.
      url = new URL(specifier, baseURL)
    } catch (e) {
      // 2. If url is failure, then return null.
      // Example: One way this could happen is if specifier is "../foo" and baseURL is a data: URL.
      return null
    }
    // 3. Return url.
    // Note: This includes cases where specifier starts with "//", i.e., scheme-relative URLs. Thus,
    // url might end up with a different host than baseURL.
    return url
  }

  // 2. Let url be the result of URL parsing specifier (with no base URL).
  let url: URL
  try {
    url = new URL(specifier)
  } catch (e) {
    // If url is failure, then return null.
    return null
  }

  // 3. Return url.
  return url
}

// To resolve an imports match, given a string normalizedSpecifier, a URL-or-null asURL, and a
// module specifier map specifierMap:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#resolving-an-imports-match
const resolveImportsMatch = (
  normalizedSpecifier: string,
  asURL: URL | null,
  specifierMap: ModuleSpecifierMap
): URL | null => {
  // 1. For each specifierKey → resolutionResult of specifierMap:
  for (const [specifierKey, resolutionResult] of Object.entries(specifierMap)) {
    // 1. If specifierKey is normalizedSpecifier, then:
    if (specifierKey === normalizedSpecifier) {
      // 1. If resolutionResult is null, then throw a TypeError indicating that resolution of
      // specifierKey was blocked by a null entry.
      // Note: This will terminate the entire resolve a module specifier algorithm, without any
      // further fallbacks.
      if (resolutionResult === null) {
        throw new TypeError(
          `Resolution of specifierKey ${specifierKey} was blocked by a null entry`
        )
      }

      // 2. Assert: resolutionResult is a URL.
      if (!(resolutionResult instanceof URL)) {
        throw new Error('resolutionResult is not a URL')
      }

      // 3. Return resolutionResult.
      return resolutionResult
    }

    // 2. If all of the following are true:
    if (
      // specifierKey ends with U+002F (/);
      specifierKey.endsWith('/') &&
      // specifierKey is a code unit prefix of normalizedSpecifier:
      //  - "input starts with potentialPrefix" can be used as a
      //    synonym for "potentialPrefix is a code unit prefix of input"; and
      normalizedSpecifier.startsWith(specifierKey) &&
      // either asURL is null, or asURL is special,
      (asURL === null ||
        ['ftp:', 'file:', 'http:', 'https:', 'ws:', 'wss:'].includes(asURL.protocol))
    ) {  // then:
      // 1. If resolutionResult is null, then throw a TypeError indicating that the resolution of
      // specifierKey was blocked by a null entry.
      // Note This will terminate the entire resolve a module specifier algorithm, without any
      // further fallbacks.
      if (resolutionResult === null) {
        throw new TypeError(
          `Resolution of specifierKey ${specifierKey} was blocked by a null entry`
        )
      }

      // 2. Assert: resolutionResult is a URL.
      if (!(resolutionResult instanceof URL)) {
        throw new Error('resolutionResult is not a URL')
      }

      // 3. Let afterPrefix be the portion of normalizedSpecifier after the initial specifierKey
      // prefix.
      const afterPrefix = normalizedSpecifier.slice(specifierKey.length)

      // 4. Assert: resolutionResult, serialized, ends with U+002F (/), as enforced during parsing.
      if (!resolutionResult.href.endsWith('/')) {
        throw new Error('resolutionResult does not end with /')
      }

      // 5. Let url be the result of URL parsing afterPrefix with resolutionResult.
      let url
      try {
        url = new URL(afterPrefix, resolutionResult.href)
      } catch (e) {
        // 6. If url is failure, then throw a TypeError indicating that resolution of
        // normalizedSpecifier was blocked since the afterPrefix portion could not be URL-parsed
        // relative to the resolutionResult mapped to by the specifierKey prefix.
        // Note: This will terminate the entire resolve a module specifier algorithm, without any
        // further fallbacks.
        throw new TypeError('Resolution of normalizedSpecifier was blocked since ' +
          'the afterPrefix portion could not be URL-parsed relative to the ' +
          'resolutionResult mapped to by the specifierKey prefix')
      }

      // 7. Assert: url is a URL.
      if (!(url instanceof URL)) {
        throw new Error('url is not a URL')
      }

      // 8. If the serialization of resolutionResult is not a code unit prefix of the serialization
      // of url, then throw a TypeError indicating that the resolution of normalizedSpecifier was
      // blocked due to it backtracking above its prefix specifierKey.
      // Note. This will terminate the entire resolve a module specifier algorithm, without any
      // further fallbacks.
      if (!url.href.startsWith(resolutionResult.href)) {
        throw new TypeError('Resolution of normalizedSpecifier was blocked ' +
          'due to it backtracking above its prefix specifierKey')
      }

      // 9. Return url.
      return url
    }
  }
  // 2. Return null.
  // Note: The resolve a module specifier algorithm will fall back to a less-specific scope, or to
  // "imports", if possible.
  return null
}

// To resolve a module specifier given a script-or-null referringScript and a string specifier:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#resolve-a-module-specifier
const resolveModuleSpecifier = (referringScript: ModuleScript | null, specifier: string): URL => {
  // 1. Let settingsObject and baseURL be null.
  let settingsObject: EnvironmentSettings | null = null
  let baseURL: URL | null = null

  // 2. If referringScript is not null, then:
  if (referringScript !== null) {
    // 1. Set settingsObject to referringScript's settings object.
    settingsObject = referringScript.settings

    // 2. Set baseURL to referringScript's base URL.
    baseURL = referringScript.baseURL
  } else {  // 3. Otherwise:
    // 1. Assert: there is a current settings object.
    if (!(globalThis as any).document[environmentSettingsSym]) {
      throw new Error('There is no current settings object')
    }

    // 2. Set settingsObject to the current settings object.
    settingsObject = (globalThis as any).document[environmentSettingsSym] as EnvironmentSettings

    // 3. Set baseURL to settingsObject's API base URL.
    baseURL = settingsObject.apiBaseUrl
  }
  // 4. Let importMap be an empty import map.
  let importMap: ImportMap = {
    imports: {},
    scopes: {},
    integrity: {},
  }

  // 5. If settingsObject's global object implements Window, then set importMap to settingsObject's
  // global object's import map.
  if (settingsObject.globalObject.constructor.name === 'Window') {
    importMap = (settingsObject.globalObject as Window)[importMapSym]
  }

  // 6. Let baseURLString be baseURL, serialized.
  const baseURLString = baseURL!.href

  // 7. Let asURL be the result of resolving a URL-like module specifier given specifier and
  // baseURL.
  const asURL = resolveUrlLikeModuleSpecifier(specifier, baseURLString)

  // 8. Let normalizedSpecifier be the serialization of asURL, if asURL is non-null; otherwise,
  // specifier.
  const normalizedSpecifier = asURL !== null ? asURL.href : specifier

  // 9. For each scopePrefix → scopeImports of importMap's scopes:
  for (const [scopePrefix, scopeImports] of Object.entries(importMap.scopes)) {
    // 1. If scopePrefix is baseURLString, or if scopePrefix ends with U+002F (/) and scopePrefix is
    // a code unit prefix of baseURLString, then:
    if (scopePrefix === baseURLString ||
        (scopePrefix.endsWith('/') && baseURLString.startsWith(scopePrefix))) {
      // 1. Let scopeImportsMatch be the result of resolving an imports match given
      // normalizedSpecifier, asURL, and scopeImports.
      const scopeImportsMatch = resolveImportsMatch(normalizedSpecifier, asURL, scopeImports)

      // 2. If scopeImportsMatch is not null, then return scopeImportsMatch.
      if (scopeImportsMatch !== null) {
        return scopeImportsMatch
      }
    }
  }

  // 10. Let topLevelImportsMatch be the result of resolving an imports match given
  // normalizedSpecifier, asURL, and importMap's imports.
  const topLevelImportsMatch = resolveImportsMatch(normalizedSpecifier, asURL, importMap.imports)

  // 11. If topLevelImportsMatch is not null, then return topLevelImportsMatch.
  if (topLevelImportsMatch !== null) {
    return topLevelImportsMatch
  }

  // 12. At this point, specifier wasn't remapped to anything by importMap, but it might have been
  // able to be turned into a URL.  If asURL is not null, then return asURL.
  if (asURL !== null) {
    return asURL
  }

  // 13. Throw a TypeError indicating that specifier was a bare specifier, but was not remapped to
  // anything by importMap.
  throw new TypeError('Bare specifier not remapped')
}

export {
  ImportAttributeRecord,
  ModuleRequestRecord,
  moduleTypeFromModuleRequest,
  moduleTypeAllowed,
  fetchDestinationFromModuleType,
  resolveModuleSpecifier,
}
