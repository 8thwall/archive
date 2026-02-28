import React from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'

import useResourceCenterStyles from '../styles/resource-center-styles'
import {combine} from '../common/styles'
import {UiThemeProvider} from '../ui/theme'
import {RequestSupportOrBugModal} from '../editor/product-tour/request-support-form-modal'
import useCurrentAccount from '../common/use-current-account'
import {useUserEditorSettings} from '../user/use-user-editor-settings'
import {decode} from '../../shared/base64'
import {getStore} from '../reducer'
import {HelpCenterSearch} from '../editor/product-tour/help-center-search'

interface ResourceCenterPopup {
  children: (onClick: () => void) => React.ReactNode
  mode?: 'studio' | 'app' | 'account'
}

const buttonMode = {
  studio: 'studioIcon',
  app: 'sidebarIcon',
  account: 'accountSidebarIcon',
}

const ResourceCenter: React.FC<ResourceCenterPopup> = ({children, mode = 'studio'}) => {
  const classes = useResourceCenterStyles()
  const settings = useUserEditorSettings()
  const account = useCurrentAccount()
  const [reportBug, setReportBug] = React.useState(false)
  const [requestSupport, setRequestSupport] = React.useState(false)
  const settingsRef = React.useRef(settings)

  const initialState = window.__INITIAL_DATA__ && decode(window.__INITIAL_DATA__)
  const store = getStore(initialState)

  const appendSearchBar = () => {
    const pendoMainMenu = document.getElementsByClassName('_pendo-resource-center-home-list')[0]

    if (pendoMainMenu) {
      const searchContainer = document.createElement('div')
      searchContainer.id = 'resource-center-search'
      pendoMainMenu.prepend(searchContainer)
      const root = createRoot(searchContainer)
      root.render(
        <Provider store={store}>
          <UiThemeProvider
            mode={(mode !== 'studio' || settingsRef.current.darkMode) ? 'dark' : 'light'}
          >
            <HelpCenterSearch isResourceCenter />
          </UiThemeProvider>
        </Provider>
      )
    }
  }

  React.useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  React.useEffect(() => {
    window.addEventListener('request-ticket', (event) => {
      const customEvent = event as CustomEvent<{ isBug: boolean }>
      const {isBug} = customEvent.detail
      if (isBug) {
        setReportBug(true)
      } else {
        setRequestSupport(true)
      }
    })
    window.addEventListener('load-searchbar', (event) => {
      const customEvent = event as CustomEvent<{ loadSearchBar: boolean }>
      const {loadSearchBar} = customEvent.detail
      if (loadSearchBar) {
        const pendoSearchBar = document.getElementById('resource-center-search')
        if (!pendoSearchBar) {
          appendSearchBar()
        }
      }
    })

    return () => {
      window.removeEventListener('request-ticket', () => {})
      window.removeEventListener('load-searchbar', () => {})
    }
  }, [])

  const setResourceCenterStyle = () => {
    const pendoResourceCenter = document.getElementById('pendo-resource-center-container')
    if (pendoResourceCenter) {
      pendoResourceCenter.classList.add(classes.pendoResourceCenter,
        mode !== 'studio' ? classes.sideBarPosition : classes.regularPosition)
    }
  }

  const loadResourceCenterMenu = () => {
    setResourceCenterStyle()
    appendSearchBar()
  }

  return (
    <>
      <div className={combine('style-reset pendo', classes.pendoContainer, buttonMode[mode])}>
        {children(loadResourceCenterMenu)}
      </div>
      <UiThemeProvider mode={(mode !== 'studio' || settings.darkMode) ? 'dark' : 'light'}>
        <RequestSupportOrBugModal
          account={account}
          modalOpen={reportBug || requestSupport}
          closeModal={() => {
            setReportBug(false)
            setRequestSupport(false)
          }}
          isBug={reportBug}
        />
      </UiThemeProvider>
    </>
  )
}

export {ResourceCenter}
