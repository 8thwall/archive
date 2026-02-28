import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import type {GraphObject, Map, MapPoint, MapTheme} from '@ecs/shared/scene-graph'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {MIN_RADIUS, MAX_RADIUS, DEFAULT_MIN_SCALE, DEFAULT_SCALE} from '@ecs/shared/map-constants'

import {getMapPointOverrides} from '@ecs/shared/map-controller'

import {ComponentConfiguratorTray} from './component-configurator-tray'
import {MapThemeConfigurator} from './map-theme-configurator'
import {RowBooleanField, RowNumberField} from './row-fields'
import {FloatingPanelButton} from '../../ui/components/floating-panel-button'
import {LatLongSelector} from './lat-long-selector'
import {useSceneContext} from '../scene-context'
import {makeMapPoint} from '../make-object'
// eslint-disable-next-line import/extensions
import {mapPointToPose} from '../../scaniverse-web/gen/maps/niantic-map-react-bin'
import {useDerivedScene} from '../derived-scene-context'
import {MAP_COMPONENT} from './direct-property-components'

const useStyles = createUseStyles({
  mapPointButton: {
    marginBottom: '1.0em',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
})

interface IMapConfigurator {
  id: string
  map: DeepReadonly<Map>
  mapTheme?: DeepReadonly<MapTheme>
  onAddMapPoint: (newObject: GraphObject) => void
  onChangeMap: (mapUpdater: (newMap: Map) => Map) => void
  onChangeTheme: (themeUpdater: (newMap: MapTheme) => MapTheme) => void
}

const MapConfigurator: React.FC<IMapConfigurator> = (
  {id, map, mapTheme = {}, onAddMapPoint, onChangeMap, onChangeTheme}
) => {
  const {t} = useTranslation(['cloud-studio-pages'])
  const classes = useStyles()
  const sceneCtx = useSceneContext()
  const derivedScene = useDerivedScene()

  const updateView = (props: Partial<Map>) => {
    onChangeMap(o => ({...o, ...props}))
    const updatedMap = {...map, ...props}

    // update child map points
    derivedScene.getDescendantObjectIds(id)
      .map(objId => derivedScene.getObject(objId))
      .filter(obj => !!obj?.mapPoint)
      .forEach((obj) => {
        const overrides = getMapPointOverrides(updatedMap, obj.mapPoint, mapPointToPose)
        sceneCtx.updateObject(obj.id, oldObject => ({
          ...oldObject,
          ...overrides,
        }))
      })
  }

  const addMapPoint = () => {
    const newMapPoint: MapPoint = {
      latitude: map.latitude,
      longitude: map.longitude,
      meters: map.radius / DEFAULT_SCALE,
      minScale: DEFAULT_MIN_SCALE,
    }
    const newObject = makeMapPoint(
      id,
      t('map_point_configurator.title'),
      newMapPoint,
      getMapPointOverrides(map, newMapPoint, mapPointToPose)
    )
    onAddMapPoint(newObject)
  }

  return (
    <ComponentConfiguratorTray
      title={t('map_configurator.title')}
      description={t('map_configurator.description')}
      sectionId='map'
      componentData={[MAP_COMPONENT]}
    >
      <RowBooleanField
        label={t('map_configurator.use_gps.label')}
        id='use-gps'
        checked={!!map.useGps}
        onChange={e => onChangeMap(o => ({...o, useGps: e.target.checked}))}
      />
      <LatLongSelector
        lat={map.latitude}
        lng={map.longitude}
        id={map.targetEntity?.id}
        onChange={(lat, lng, eid) => updateView({
          latitude: lat, longitude: lng, targetEntity: {type: 'entity', id: eid},
        })}
        showMapPoints
        radius={map.radius}
      />
      <RowNumberField
        label={t('map_configurator.radius.label')}
        id='radius'
        value={map.radius}
        onChange={radius => updateView({radius})}
        min={MIN_RADIUS}
        max={MAX_RADIUS}
        step={0.001 * map.radius}
      />
      <RowBooleanField
        label={t('map_configurator.spawn_locations.label')}
        id='spawn-locations'
        checked={map.spawnLocations}
        onChange={e => onChangeMap(o => ({...o, spawnLocations: e.target.checked}))}
      />
      <div className={classes.mapPointButton}>
        <FloatingPanelButton onClick={addMapPoint}>
          {t('map_configurator.button.new_map_point')}
        </FloatingPanelButton>
      </div>
      <MapThemeConfigurator
        mapTheme={mapTheme}
        onChangeTheme={onChangeTheme}
      />
    </ComponentConfiguratorTray>
  )
}

export default MapConfigurator
