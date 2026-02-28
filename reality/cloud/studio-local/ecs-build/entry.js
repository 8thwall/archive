/* eslint-disable import/no-unresolved */
// TODO(cindyhu): _asset-manifest.js is a virtual module geenrated at build time, so we need to set
// up eslintrc to allow asset manifest import here
// eslint-disable-next-line import/extensions
import '@8w-studio-project-src/_asset-manifest'
// eslint-disable-next-line import/extensions
import '@8w-studio-project-src/_imports'

import scene from '@8w-studio-project-src/.expanse.json'

delete scene.history
delete scene.historyVersion

window.ecs.application.init(scene)

if (module.hot) {
  const isInline = window.location.href.includes('liveSyncMode=inline')

  const handler = isInline
    ? () => { }
    : async () => {
      const updatedScene = (await import('@8w-studio-project-src/.expanse.json')).default

      delete updatedScene.history
      delete updatedScene.historyVersion

      window.ecs.application.getScene().updateBaseObjects(updatedScene.objects)
      window.ecs.application.getScene().updateDebug(updatedScene)
    }

  module.hot.accept('@8w-studio-project-src/.expanse.json', handler)
}
