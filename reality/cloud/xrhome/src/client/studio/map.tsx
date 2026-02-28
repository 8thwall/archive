import React, {useMemo} from 'react'
import * as THREE from 'three'
import {FONT_URLS, SERVER_URL, WORKER_URL, DEFAULT_SCALE} from '@ecs/shared/map-constants'
import {themeToMapStyles} from '@ecs/shared/map-controller'
import type {DeepReadonly} from 'ts-essentials'
import type {Map as MapComponent, MapTheme} from '@ecs/shared/scene-graph'

// eslint-disable-next-line import/extensions
import {NianticMap} from '../scaniverse-web/gen/maps/niantic-map-react-bin'
import {MATERIAL_BLENDING, MATERIAL_SIDE} from './configuration/material-constants'
import {useEnclosedApp} from '../apps/enclosed-app-context'
import useActions from '../common/use-actions'
import vpsActions from '../vps/vps-actions'

interface IMap {
  map: DeepReadonly<MapComponent>
  mapTheme?: DeepReadonly<MapTheme>
}

const Map: React.FC<IMap> = ({map, mapTheme}) => {
  const app = useEnclosedApp()
  const {retrieveVpsXrSessionToken} = useActions(vpsActions)
  const {latitude: lat, longitude: lng, radius} = map

  const styles = useMemo(
    () => themeToMapStyles(mapTheme ?? {}, (props) => {
      const {forceTransparent, ...materialProps} = props
      return new THREE.MeshStandardMaterial({
        ...materialProps,
        normalScale: new THREE.Vector2(props.normalScale, props.normalScale),
        blending: MATERIAL_BLENDING[props.blending],
        side: MATERIAL_SIDE[props.side],
        transparent: props.opacity < 1 || forceTransparent,
      })
    }),
    [mapTheme]
  )

  const serverOptions = useMemo(() => ({
    getAuth: () => retrieveVpsXrSessionToken(app),
    url: SERVER_URL,
  }), [app])

  return (
    app && (
      <mesh scale={[DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE]}>
        <NianticMap
          key={app.uuid}
          serverOptions={serverOptions}
          fontUrls={FONT_URLS}
          workerUrl={WORKER_URL}
          mapStyles={styles}
          initialView={{lat, lng, radius, rotationRadian: 0}}
        />
      </mesh>
    )
  )
}

export default Map
