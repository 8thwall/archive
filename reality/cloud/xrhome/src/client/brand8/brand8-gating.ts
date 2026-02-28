import type {UiThemeMode} from '../ui/theme'
import {useBrand8QaContext} from './brand8-qa-context'

const usePrivateNavigationEnabled = () => {
  const brand8 = useBrand8QaContext()
  return brand8.privateNavigationOverride ?? BuildIf.PRIVATE_NAVIGATION_20251009
}

const usePublicNavigationEnabled = () => {
  const brand8 = useBrand8QaContext()
  return brand8.publicNavigationOverride ?? BuildIf.PUBLIC_NAVIGATION_20251009
}

const getDefaultTheme = () => (BuildIf.DEFAULT_DARK_MODE_20251009 ? 'dark' : 'light')

const getExteriorTheme = (): UiThemeMode => (
  BuildIf.EXTERIOR_DARK_MODE_20251009
    ? 'brand8dark'
    : 'light'
)

// TODO(alvin): Move other gating logic here for things like: CMS, Project Library, Sign Up, etc.

export {
  usePrivateNavigationEnabled,
  usePublicNavigationEnabled,
  getExteriorTheme,
  getDefaultTheme,
}
