import {loadScript} from '../../shared/load-script'
import {
  SERVER_URL, STANDALONE_URL, WORKER_URL, DEFAULT_SCALE, MAP_DEFAULTS,
  DEFAULT_WALK_KMH, DEFAULT_RUN_KMH, DEFAULT_DRIVE_KMH,
} from '../../shared/map-constants'
import {getMapPointOverrides, themeToMapStyles} from '../../shared/map-controller'
import type {Eid} from '../../shared/schema'
import {
  Hidden, Map as MapAttribute, MapPoint, MapTheme, Position, Quaternion, Scale, GltfModel,
} from '../components'
import {addChild, notifyChanged} from '../matrix-refresh'
import THREE from '../three'
import type {World} from '../world'
import {sides} from '../three-side'
import {MATERIAL_BLENDING} from './material-systems-helpers'
import {makeSystemHelper} from './system-helper'
import {defineQuery, enterQuery, lifecycleQueries} from '../query'
import {findChildComponents, findParentComponent} from '../../shared/find-component'
import {GpsPointer} from '../gps-pointer'
import {quat, vec3} from '../math/math'
import {degreesToRadians} from '../../shared/angle-conversion'
import {events} from '../event-ids'
import type {LocationSpawnedEvent} from '../map-types'

const SMOOTHING_RADIUS_MULTIPLIER = 1.0

interface WayspotInfo {
  id: string
  imageUrl: string
  title: string
  lat: number
  lng: number
  mapPoint?: Eid  // defined if spawned, undefined if tracked
}

const truncate = (num: number, digits: number): number => {
  const factor = 10 ** digits
  return Math.round(num * factor) / factor
}

const distance = (from: {latitude: number, longitude: number},
  to: {latitude: number, longitude: number}) => {
  //  Computational optimization for no change.
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }
  const lat1R = degreesToRadians(from.latitude)
  const lat2R = degreesToRadians(to.latitude)
  const halfLatD = 0.5 * (lat2R - lat1R)
  const halfLngD = 0.5 * (degreesToRadians(to.longitude) - degreesToRadians(from.longitude))
  const v = Math.sin(halfLatD) ** 2 + (Math.sin(halfLngD) ** 2) *
   Math.cos(lat1R) * Math.cos(lat2R)
  const arc = 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v))
  return arc * 6371008.8  // Earth arithmetic mean radius, per en.wikipedia.org/wiki/Earth_radius
}

const mapDetected = enterQuery(defineQuery([MapAttribute]))
const {init: mapInit, enter: mapEnter, changed: mapChanged, exit: mapExit} =
  makeSystemHelper(MapAttribute)
const {init: themeInit, enter: themeEnter, changed: themeChanged, exit: themeExit} =
  lifecycleQueries(defineQuery([MapAttribute, MapTheme]))
const {init: pointInit, enter: pointEnter, changed: pointChanged} =
  makeSystemHelper(MapPoint)

let Maps: any
let triedLoadingMaps = false

const maybeLoadMaps = () => {
  if (!Maps && !triedLoadingMaps) {
    triedLoadingMaps = true
    loadScript(STANDALONE_URL).then(() => {
      Maps = (window as any).Maps
    })
  }
}

const makeMapSystem = (world: World) => {
  const controllers: Map<Eid, any> = new Map()
  const watchers: Map<Eid, any> = new Map()
  const motionFilters: Map<Eid, any> = new Map()
  const listenerCleanup: Map<Eid, () => void> = new Map()
  // parent map eid -> wayspot id -> info
  const wayspots: Map<Eid, Map<string, WayspotInfo>> = new Map()

  const handlePointChanged = (eid: Eid) => {
    const point = MapPoint.get(world, eid)
    const parentMap = findParentComponent(world, eid, MapAttribute)
    if (!parentMap) return
    const map = MapAttribute.get(world, parentMap)
    const {
      position, rotation, scale, hidden,
    } = getMapPointOverrides(map, point, Maps.mapPointToPose)
    Position.set(world, eid, {x: position[0], y: position[1], z: position[2]})
    Quaternion.set(world, eid, {x: rotation[0], y: rotation[1], z: rotation[2], w: rotation[3]})
    Scale.set(world, eid, {x: scale[0], y: scale[1], z: scale[2]})
    if (hidden) {
      Hidden.set(world, eid)
    } else {
      Hidden.remove(world, eid)
    }
  }

  const spawnWayspotMapPoint = (info: WayspotInfo, mapEid: Eid) => {
    const map = MapAttribute.has(world, mapEid) ? MapAttribute.get(world, mapEid) : MAP_DEFAULTS
    const pointEid = world.createEntity()
    world.setParent(pointEid, mapEid)
    MapPoint.set(world, pointEid, {
      latitude: info.lat,
      longitude: info.lng,
      meters: map.radius / DEFAULT_SCALE,
    })
    const spawnedInfo: LocationSpawnedEvent = {...info, mapPoint: pointEid}
    world.events.dispatch(mapEid, events.LOCATION_SPAWNED, spawnedInfo)
    wayspots.get(mapEid)?.set(info.id, spawnedInfo)
  }

  const destroyWayspotMapPoint = (info: WayspotInfo, mapEid: Eid) => {
    const pointEid = wayspots.get(mapEid)?.get(info.id)?.mapPoint
    if (pointEid) {
      world.deleteEntity(pointEid)
      const trackedInfo = {...info, mapPoint: undefined}
      wayspots.get(mapEid)?.set(info.id, trackedInfo)
    }
  }

  const trackWayspot = (info: WayspotInfo, mapEid: Eid) => {
    wayspots.get(mapEid)?.set(info.id, info)
    const map = MapAttribute.has(world, mapEid) ? MapAttribute.get(world, mapEid) : MAP_DEFAULTS
    if (distance({latitude: info.lat, longitude: info.lng}, map) <= map.radius) {
      spawnWayspotMapPoint(info, mapEid)
    }
  }

  const untrackWayspot = (info: WayspotInfo, mapEid: Eid) => {
    const trackedWayspot = wayspots.get(mapEid)?.get(info.id)
    if (!trackedWayspot) return
    if (trackedWayspot.mapPoint) {
      destroyWayspotMapPoint(trackedWayspot, mapEid)
    }
    wayspots.get(mapEid)?.delete(info.id)
  }

  const handleMapChanged = (eid: Eid) => {
    const map = MapAttribute.get(world, eid)
    const controller = controllers.get(eid)
    if (!controller) return

    controller.view(map.latitude, map.longitude)
    controller.viewRadius(map.radius)

    if (map.spawnLocations && !watchers.get(eid)) {
      const watcher = (window as any).XR8.Vps.makeWayspotWatcher({
        onVisible: (info: WayspotInfo) => trackWayspot(info, eid),
        onHidden: (info: WayspotInfo) => untrackWayspot(info, eid),
        pollGps: false,
        lat: map.latitude,
        lng: map.longitude,
      })
      watchers.set(eid, watcher)
      wayspots.set(eid, new Map())
    } else if (!map.spawnLocations && watchers.get(eid)) {
      watchers.get(eid).dispose()
      watchers.delete(eid)
      wayspots.delete(eid)
    }

    if (map.useGps && !listenerCleanup.get(eid)) {
      const motionFilter = motionFilters.get(eid)
      const gpsReceived = (coords: {latitude: number, longitude: number}) => {
        const dist = distance(coords, map)
        if (dist > map.radius * SMOOTHING_RADIUS_MULTIPLIER) {
          motionFilter.clear()
        }
        motionFilter.observe({lat: coords.latitude, lng: coords.longitude, millis: Date.now()})
      }
      const watchId = navigator.geolocation.watchPosition(
        p => gpsReceived(p.coords),
        () => {},
        {enableHighAccuracy: true}
      )
      listenerCleanup.set(eid, () => {
        navigator.geolocation.clearWatch(watchId)
        motionFilter.clear()
      })
    } else if (!map.useGps && listenerCleanup.get(eid)) {
      listenerCleanup.get(eid)?.()
      listenerCleanup.delete(eid)
    }

    findChildComponents(world, eid, MapPoint).forEach(handlePointChanged)
    wayspots.get(eid)?.forEach((info) => {
      const d = distance({latitude: info.lat, longitude: info.lng}, map)
      if (!info.mapPoint && d <= map.radius) {
        spawnWayspotMapPoint(info, eid)
      } else if (info.mapPoint && d > map.radius) {
        destroyWayspotMapPoint(info, eid)
      }
    })
  }

  const handleThemeChanged = (eid: Eid) => {
    const theme = MapTheme.has(world, eid) ? MapTheme.get(world, eid) : {}
    const controller = controllers.get(eid)
    if (!controller) return

    const styles = themeToMapStyles(theme, (props) => {
      const {forceTransparent, ...materialProps} = props
      return new THREE.MeshStandardMaterial({
        ...materialProps,
        normalScale: new THREE.Vector2(props.normalScale, props.normalScale),
        blending: MATERIAL_BLENDING[props.blending],
        side: sides[props.side],
        transparent: props.opacity < 1 || forceTransparent,
      })
    })
    controller.setMaterials(styles.geometryMaterial)
    controller.setStyle(styles.mapGeometryStyle)
  }

  const createMap = (eid: Eid) => {
    const object = world.three.entityToObject.get(eid)
    const config = {
      workerUrl: WORKER_URL,
      serverOptions: {
        url: SERVER_URL,
        payload: JSON.stringify({eighth_wall_module_version: 1}),
        getAuth: () => (window as any).XR8.Platform.authorizationToken(),
      },
      cacheOptions: {
        prewarmTileCache: false,
      },
    }
    Maps.setInternalConfig(config)

    const controller = Maps.ThreejsMap.create()
    controllers.set(eid, controller)
    motionFilters.set(eid, Maps.motionFilter())
    handleMapChanged(eid)

    const mapObject = controller.map()
    mapObject.userData.isMap = true
    mapObject.scale.set(DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE)
    mapObject.updateMatrix()

    if (object) {
      addChild(object, mapObject)
    }
  }

  const tickMaps = () => {
    controllers.forEach((controller) => {
      controller.tick()
      notifyChanged(controller.map())
    })
    motionFilters.forEach((filter, eid) => {
      const filtered = filter.current(Date.now())
      if (!filtered) return

      const {latitude: curLat, longitude: curLng} = MapAttribute.get(world, eid)
      const {lat: newLat, lng: newLng, kmh, direction} = filtered
      if (truncate(curLat, 7) === truncate(newLat, 7) &&
          truncate(curLng, 7) === truncate(newLng, 7)) {
        return
      }
      MapAttribute.set(world, eid, {
        latitude: newLat,
        longitude: newLng,
      })

      findChildComponents(world, eid, GpsPointer).forEach((pointerEid) => {
        const pointer = GpsPointer.get(world, pointerEid)

        if (pointer.faceGpsDirection) {
          const q = quat.pitchYawRollRadians(vec3.xyz(0, direction - Math.PI, 0))
          Quaternion.set(world, pointerEid, {x: q.x, y: q.y, z: q.z, w: q.w})
        }

        if (!GltfModel.has(world, pointerEid)) return
        const gltf = GltfModel.get(world, pointerEid)
        const {idleClip} = pointer
        const walkClip = pointer.walkClip || idleClip
        const runClip = pointer.runClip || walkClip
        const driveClip = pointer.driveClip || runClip

        let selectedClip = idleClip
        if (kmh >= DEFAULT_WALK_KMH) {
          selectedClip = walkClip
        }
        if (kmh >= DEFAULT_RUN_KMH) {
          selectedClip = runClip
        }
        if (kmh >= DEFAULT_DRIVE_KMH) {
          selectedClip = driveClip
        }

        if (selectedClip && selectedClip !== gltf.animationClip) {
          GltfModel.set(world, pointerEid, {animationClip: selectedClip})
        }
      })
    })
    watchers.forEach((watcher, eid) => {
      const {latitude, longitude} = MapAttribute.get(world, eid)
      watcher.setLatLng(latitude, longitude)
    })
  }

  const removeMap = (eid: Eid) => {
    const controller = controllers.get(eid)
    if (controller) {
      controller.destroy()
      controllers.delete(eid)
    }

    const watcher = watchers.get(eid)
    if (watcher) {
      watcher.dispose()
      watchers.delete(eid)
    }

    const wayspotEids = wayspots.get(eid)
    if (wayspotEids) {
      wayspots.delete(eid)
    }

    const motionFilter = motionFilters.get(eid)
    if (motionFilter) {
      motionFilter.clear()
      motionFilters.delete(eid)
    }

    const object = world.three.entityToObject.get(eid)
    if (!object) {
      return
    }
    object.children.forEach((child) => {
      if (child.userData.isMap) {
        object.remove(child)
      }
    })

    listenerCleanup.get(eid)?.()
  }

  const createPoint = (eid: Eid) => {
    const parentMapEid = findParentComponent(world, eid, MapAttribute)
    if (!parentMapEid) {
      // eslint-disable-next-line no-console
      console.warn('MapPoint must be a child of a Map')
      return
    }
    handlePointChanged(eid)
  }

  mapInit(world)
  themeInit(world)
  pointInit(world)

  return () => {
    const detectedNewMap = mapDetected(world).length > 0
    if (detectedNewMap) {
      maybeLoadMaps()
    }
    if (!Maps || !(window as any).XR8) return
    themeExit(world).forEach(handleThemeChanged)
    mapExit(world).forEach(removeMap)
    mapEnter(world).forEach(createMap)
    themeEnter(world).forEach(handleThemeChanged)
    pointEnter(world).forEach(createPoint)
    mapChanged(world).forEach(handleMapChanged)
    themeChanged(world).forEach(handleThemeChanged)
    pointChanged(world).forEach(handlePointChanged)
    tickMaps()
  }
}

export {
  makeMapSystem,
}
