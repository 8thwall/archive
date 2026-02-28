// @sublibrary(:dom-core-lib)
import type vm from 'vm'

import type {ModuleScript} from './script'
import type {Origin} from './hosts'

import type {Window} from './window'
import type {WorkerGlobalScope} from './worker-global-scope'

type ModuleMapKey = string & { readonly __brand: unique symbol };

function moduleMapKey(url: URL, moduleType: string): ModuleMapKey {
  return `${url.href}|${moduleType}` as ModuleMapKey
}

type ModuleMap = Map<ModuleMapKey, ModuleScript | null | 'fetching'>

// See: https://html.spec.whatwg.org/multipage/webappapis.html#environment
interface Environment {
  // An opaque string that uniquely identifies this environment.
  id: string

  // A URL that represents the location of the resource with which this
  // environment is associated.  In the case of a Window environment settings
  // object, this URL might be distinct from its global object's associated
  // Document's URL, due to mechanisms such as history.pushState() which modify
  // the latter.
  creationUrl: URL

  // Null or a URL that represents the creation URL of the "top-level"
  // environment. It is null for workers and worklets.
  topLevelCreationUrl: null | URL

  // A for now implementation-defined value, null, or an origin. For a
  // "top-level" potential execution environment it is null (i.e., when there is
  // no response yet); otherwise it is the "top-level" environment's origin. For
  // a dedicated worker or worklet it is the top-level origin of its creator.
  // For a shared or service worker it is an implementation-defined value.
  topLevelOrigin: null | Origin

  // Null or a target browsing context for a navigation request.
  targetBrowseContext: null /* | BrowsingContext */

  // Null or a service worker that controls the environment.
  activeServiceWorker: null /* | ServiceWorker */

  // A flag that indicates whether the environment setup is done. It is initially unset.
  executionReady: boolean
}

// See https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-objects
interface EnvironmentSettings extends Environment {
  // A JavaScript execution context shared by all scripts that use this settings
  // object, i.e., all scripts in a given realm. When we run a classic script or
  // run a module script, this execution context becomes the top of the
  // JavaScript execution context stack, on top of which another execution
  // context specific to the script in question is pushed. (This setup ensures
  // Source Text Module Record's Evaluate knows which realm to use.)
  realmExecutionContext: vm.Context

  globalObject: Window | WorkerGlobalScope

  // A module map that is used when importing JavaScript modules.
  moduleMap: ModuleMap

  // A URL used by APIs called by scripts that use this environment settings
  // object to parse URLs.
  apiBaseUrl: URL

  // An origin used in security checks.
  origin: Origin

  // A policy container containing policies used for security checks.
  // [NOT IMPLEMENTED] policyContainer: PolicyContainer

  // A boolean representing whether scripts that use this environment settings
  // object are allowed to use APIs that require cross-origin isolation.
  corsIsolatedCapability: boolean

  // A number used as the baseline for performance-related timestamps. [HRT]
  timeOrigin: number
}

export {Environment, EnvironmentSettings, moduleMapKey}
