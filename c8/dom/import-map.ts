// @sublibrary(:dom-core-lib)
import {
  ParsedImportMap,
  ParsedSpecifierMap,
  ParsedScopesMap,
  parseFromString,
  resolve,
} from '@import-maps/resolve'

// See:
// https://html.spec.whatwg.org/multipage/webappapis.html#import-map-processing-model

// A module specifier map is an ordered map whose keys are strings and whose values are either URLs
// or nulls.
type ModuleSpecifierMap = ParsedSpecifierMap

type ModulesScopesMap = ParsedScopesMap

// A module integrity map is an ordered map whose keys are URLs and whose values are strings that
// will be used as integrity metadata.
type ModuleIntegrityMap = Record<string, string>

// See: https://html.spec.whatwg.org/multipage/webappapis.html#import-map

interface ImportMap extends ParsedImportMap {
  // Props 'imports' and 'scopes' are inherited from ParsedImportMap, but made non-nullable.
  imports: ModuleSpecifierMap

  scopes: ModulesScopesMap

  // Module integrity map.
  integrity: ModuleIntegrityMap
}

const parseImportMap = (input: string, baseURL: URL): ImportMap => {
  const parsedImportMap = parseFromString(input, baseURL)
  if (!parsedImportMap.imports || !parsedImportMap.scopes) {
    throw new Error('Invalid import map')
  }
  return {
    imports: parsedImportMap.imports as ModuleSpecifierMap,
    scopes: parsedImportMap.scopes as ModulesScopesMap,
    integrity: {},
  }
}

const resolveImport = (
  specifier: string,
  parsedImportMap: ParsedImportMap,
  scriptURL: URL
) => resolve(specifier, parsedImportMap, scriptURL)

// An empty import map is an import map with its imports and scopes both being empty maps.
const isEmptyImportMap = (
  importMap: ImportMap
): boolean => Object.keys(importMap.imports).length === 0 &&
         Object.keys(importMap.scopes).length === 0

// An import map parse result is a struct that is similar to a script, and also can be stored in a
// script element's result, but is not counted as a script for other purposes. It has the following
// items:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#import-map-parse-result
class ImportMapParseResult {
  // An import map or null.
  importMap: null | ImportMap

  // A JavaScript value representing an error that will prevent using this import map, when
  // non-null.
  errorToRethrow: any
}

// To create an import map parse result given a string input and a URL baseURL:
// See: https://html.spec.whatwg.org/multipage/webappapis.html#create-an-import-map-parse-result
const createImportMapParseResult = (input: string, baseURL: URL): ImportMapParseResult => {
  // 1. Let result be an import map parse result whose import map is null and
  // whose error to rethrow is null.
  const result: ImportMapParseResult = {
    importMap: null,
    errorToRethrow: null,
  }

  // 2. Parse an import map string given input and baseURL, catching any exceptions. If this threw
  // an exception, then set result's error to rethrow to that exception. Otherwise, set result's
  // import map to the return value.
  // [IMPLEMENTATION NOTE]: Using @import-maps/resolve, which doesn't parse 'integrity'.
  try {
    result.importMap = parseImportMap(input, baseURL)
  } catch (e) {
    result.errorToRethrow = e
  }

  // 3. Return result.
  return result
}

export {
  ImportMap,
  ImportMapParseResult,
  ModuleSpecifierMap,
  ModulesScopesMap,
  ModuleIntegrityMap,
  parseImportMap,
  resolveImport,
  isEmptyImportMap,
  createImportMapParseResult,
}
