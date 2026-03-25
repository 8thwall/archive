import * as ecs from '@8thwall/ecs'

import MenuUI from './menu-ui'

import '../css/menu.scss'

ecs.registerComponent({
  name: 'Menu',
  schema: {},
  schemaDefaults: {},
  data: {},
  add: () => {
    const mainPage = document.createElement('div')
    mainPage.className = 'main-page'
    mainPage.id = 'main-page'
    document.body.append(mainPage)
    MenuUI.init(mainPage)
  },
  remove: () => {
    if (document.getElementById('main-page')) {
      document.body.removeChild(document.getElementById('main-page'))
    }
  },
})
