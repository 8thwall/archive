// @sublibrary(:dom-core-lib)
/* eslint-disable max-classes-per-file */

import type {EnvironmentSettings} from './environment'
import type {ReferrerPolicy} from './referrer-policy'
import type {
  ScriptRecord,
  SourceTextModuleRecord,
  SyntheticModuleRecord,
} from './vm-record'

interface ScriptFetchOptions {
  cryptographicNonce: string
  integrityMetadata: string
  parserMetadata: '' | 'parser-inserted' | 'not-parser-inserted'
  credentialsMode: 'omit' | 'same-origin' | 'include'
  referrerPolicy: ReferrerPolicy
  renderBlocking: boolean
  fetchPriority: 'auto' | 'high' | 'low'
}

// The default script fetch options are a script fetch options whose
// cryptographic nonce is the empty string, integrity metadata is the empty string,
// parser metadata is "not-parser-inserted", credentials mode is "same-origin",
// referrer policy is the empty string, and fetch priority is "auto".
// See https://html.spec.whatwg.org/multipage/webappapis.html#default-script-fetch-options
const defaultScriptFetchOptions: ScriptFetchOptions = {
  cryptographicNonce: '',
  integrityMetadata: '',
  parserMetadata: 'not-parser-inserted',
  credentialsMode: 'same-origin',
  referrerPolicy: '',
  renderBlocking: false,
  fetchPriority: 'auto',
}

// See https://html.spec.whatwg.org/multipage/webappapis.html#concept-script
class Script {
  // An environment settings object, containing various settings that are shared
  // with other scripts in the same context.
  settings: EnvironmentSettings

  // One of the following:
  //   script record, for classic scripts;
  //   Source Text Module Record, for JavaScript module scripts;
  //   Synthetic Module Record, for CSS module scripts and JSON module scripts
  //   null, representing a parsing failure.
  record: ScriptRecord | SourceTextModuleRecord | SyntheticModuleRecord | null

  // A JavaScript value, which has meaning only if the record is null,
  // indicating that the corresponding script source text could not be parsed.
  // This value is used for internal tracking of immediate parse errors when
  // creating scripts, and is not to be used directly. Instead, consult the
  // error to rethrow when determining "what went wrong" for this script.
  parseError: any

  // A JavaScript value representing an error that will prevent evaluation from
  // succeeding. It will be re-thrown by any attempts to run the script. This
  // could be the script's parse error, but in the case of a module script it
  // could instead be the parse error from one of its dependencies, or an error
  // from resolve a module specifier. Since this exception value is provided by
  // the JavaScript specification, we know that it is never null, so we use null
  // to signal that no error has occurred.
  errorToRethrow: any

  // Null or a script fetch options, containing various options related to
  // fetching this script or module scripts that it imports.
  fetchOptions: ScriptFetchOptions | null

  // Null or a base URL used for resolving module specifiers. When non-null,
  // this will either be the URL from which the script was obtained, for
  // external scripts, or the document base URL of the containing document, for
  // inline scripts.
  baseURL: null | URL
}

class ClassicScript extends Script {
  // A boolean which, if true, means that error information will not be provided
  // for errors in this script. This is used to mute errors for cross-origin
  // scripts, since that can leak private information.
  mutedErrors: boolean

  declare record: ScriptRecord | null
}

class ModuleScript extends Script {
  // A module script is another type of script. It has no additional items.
  declare record: SourceTextModuleRecord | SyntheticModuleRecord | null
}

export {ScriptFetchOptions, Script, ClassicScript, ModuleScript, defaultScriptFetchOptions}
