import {Menu, MenuItem, shell} from 'electron'
import log from 'electron-log'

import {
  CONSOLE_SERVER_URL_OPTIONS, getConsoleServerUrl, setConsoleServerUrl,
} from './console-server-url'

const hideToggleDevTools = () => {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  menu.items.forEach((menuItem) => {
    menuItem.submenu?.items.forEach((subItem) => {
      if (subItem.role?.toLowerCase() === 'toggledevtools') {
        subItem.visible = false
      }
    })
  })

  Menu.setApplicationMenu(menu)
}

const addItemsToFileMenu = () => {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  // NOTE(dat): although the type for role is fileMenu. When I inspect these items, the roles are
  // stored without captialization, e.g. filemenu, editmenu, viewmenu, etc.
  // https://github.com/electron/electron/issues/46128
  const viewMenu = menu.items.find(item => item.role?.toLowerCase() === 'filemenu')
  if (!viewMenu || !viewMenu.submenu) {
    log.warn('Failed to find File menu to add Show Log item')
    return
  }

  viewMenu.submenu.append(new MenuItem({
    label: 'Show Application Log',
    click: () => {
      shell.showItemInFolder(log.transports.file.getFile()?.path)
    },
  }))
  Menu.setApplicationMenu(menu)
}

const addDevMenu = () => {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  const currentUrl = getConsoleServerUrl()

  const consoleServerUrlMenuItems = CONSOLE_SERVER_URL_OPTIONS.map((option, i) => {
    const label = option.replace('https://', '')
    const suffix = i === 0 ? ' [default]' : ''
    return {
      label: label + suffix,
      type: 'radio' as const,
      checked: option === currentUrl,
      click: () => {
        setConsoleServerUrl(option)
      },
    }
  })

  const devMenu = new MenuItem({
    label: '[DEV]',
    submenu: [{
      label: 'Console Server URL',
      submenu: consoleServerUrlMenuItems,
    }],
  })

  menu.append(devMenu)
  Menu.setApplicationMenu(menu)
}

const setupMenu = () => {
  if (process.env.RELEASE) {
    hideToggleDevTools()
  }
  addItemsToFileMenu()

  if (process.env.DEPLOY_STAGE !== 'prod') {
    addDevMenu()
  }
}

export {
  setupMenu,
}
