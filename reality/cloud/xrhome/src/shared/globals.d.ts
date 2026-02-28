/* eslint-disable no-var, vars-on-top */
declare var Build8: import('./build8').Build8Replacements
declare var BuildIf: import('./buildif').BuildIfReplacements

interface Pendo {
  isReady: () => boolean
  identify: (params: any) => void
  initialize: (params: any) => void
  stopGuides: () => void
  startGuides: () => void
  setGuidesDisabled: (disabled: boolean) => void
  attachEvent: (element: EventTarget, event: string, callback: (e: any) => void) => void
  dom: (selector: string | EventTarget) => HTMLElement[] | HTMLElement | null
  BuildingBlocks: any
}

interface Window {
  // Facebook
  fbq?: (...args: any[]) => void

  pendo?: Pendo

  // Google Analytics
  dataLayer?: any[]

  ace?: typeof import('ace-builds')

  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: unknown

  // SSR Data
  initialLanguage?: string
  __INITIAL_DATA__?: string  // Base 64
  initialI18nStore?: string  // Base 64
}
