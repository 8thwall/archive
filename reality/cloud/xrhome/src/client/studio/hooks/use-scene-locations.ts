import type {LocationVisualization} from '@ecs/shared/scene-graph'
import {useRef, useEffect} from 'react'

import {useSelector} from '../../hooks'
import type {WayfarerPoi} from '../../../shared/integration/titan-api/titan-api'
import useActions from '../../common/use-actions'
import vpsActions from '../../vps/vps-actions'
import {useEnclosedApp} from '../../apps/enclosed-app-context'
import {useDebounce} from '../../common/use-debounce'
import {useDerivedScene} from '../derived-scene-context'

type EntityLocation = {
  name: string
  poi: WayfarerPoi
  shortName: string
  anchorNodeId: string
  visualization?: LocationVisualization
}

const useSceneLocations = (): EntityLocation[] => {
  const derivedScene = useDerivedScene()
  const objects = derivedScene.getAllSceneObjects()
  const app = useEnclosedApp()
  const pois = useSelector(s => s.vps.pois)
  const {queryPoisByIdsDedup} = useActions(vpsActions)
  const debouncedQueryPoisByIdsDedup = useDebounce(useRef(queryPoisByIdsDedup), 500)

  const sceneLocations = objects
    .filter(obj => obj?.location)

  const scenePoiIds = sceneLocations
    .map(obj => obj.location.poiId)

  useEffect(() => {
    if (!app) return
    debouncedQueryPoisByIdsDedup(app.uuid, scenePoiIds)
  }, [app, scenePoiIds.join(',')])

  return sceneLocations
    .map((obj) => {
      const poi = pois[obj.location.poiId]
      return {
        name: obj.name ?? poi?.title,
        poi,
        shortName: obj.location.name,
        anchorNodeId: obj.location.anchorNodeId,
        visualization: obj.location.visualization,
      }
    })
    .filter(location => location.poi)
}

export {
  useSceneLocations,
}

export type {
  EntityLocation,
}
