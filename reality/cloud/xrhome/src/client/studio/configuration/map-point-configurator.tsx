import React from 'react'
import {useTranslation} from 'react-i18next'
import type {Map, MapPoint} from '@ecs/shared/scene-graph'
import {getMapPointOverrides} from '@ecs/shared/map-controller'
import {DEFAULT_RADIUS} from '@ecs/shared/map-constants'

import {useSceneContext} from '../scene-context'
import {ComponentConfiguratorTray} from './component-configurator-tray'
import {LatLongSelector} from './lat-long-selector'
import {RowNumberField} from './row-fields'
// eslint-disable-next-line import/extensions
import {mapPointToPose} from '../../scaniverse-web/gen/maps/niantic-map-react-bin'
import {MAP_POINT_COMPONENT} from './direct-property-components'
import {useDerivedScene} from '../derived-scene-context'

const useParentMap = (id: string): Map | undefined => {
  const derivedScene = useDerivedScene()
  let {parentId} = derivedScene.getObject(id)
  while (parentId && derivedScene.getObject(parentId)?.map === undefined) {
    parentId = derivedScene.getObject(parentId)?.parentId
  }
  return derivedScene.getObject(parentId)?.map
}

interface IMapPointConfigurator {
  id: string
  point: MapPoint
}

const MapPointConfigurator: React.FC<IMapPointConfigurator> = ({id, point}) => {
  const {t} = useTranslation(['cloud-studio-pages'])
  const map = useParentMap(id)
  const ctx = useSceneContext()

  const handleMapPointChange = (partial: Partial<MapPoint>) => {
    const newPoint = {...point, ...partial}
    if (map) {
      const props = getMapPointOverrides(map, newPoint, mapPointToPose)
      ctx.updateObject(id, oldObject => ({
        ...oldObject,
        ...props,
        mapPoint: newPoint,
      }))
    } else {
      ctx.updateObject(id, oldObject => ({
        ...oldObject,
        mapPoint: newPoint,
      }))
    }
  }

  return (
    <ComponentConfiguratorTray
      title={t('map_point_configurator.title')}
      description={t('map_point_configurator.description')}
      sectionId='map-point'
      componentData={[MAP_POINT_COMPONENT]}
    >
      <LatLongSelector
        lat={point.latitude}
        lng={point.longitude}
        id={point.targetEntity?.id}
        onChange={(lat, lng, eid) => handleMapPointChange({
          latitude: lat, longitude: lng, targetEntity: {type: 'entity', id: eid},
        })}
        radius={map?.radius ?? DEFAULT_RADIUS}
      />
      <RowNumberField
        id='meters'
        label={t('map_point_configurator.meters.label')}
        value={point.meters}
        onChange={meters => handleMapPointChange({meters})}
        min={0}
        step={Math.max(0.001 * point.meters, 0.001)}
      />
    </ComponentConfiguratorTray>
  )
}

export default MapPointConfigurator
