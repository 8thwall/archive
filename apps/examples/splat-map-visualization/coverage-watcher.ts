//
// Example usage:
// const args = {
//   onVisible: (node) => { console.log('got node', node) },
//   onHidden: (node) => { console.log('lost node', node) },
// }
//
// const watcher = makeCoverageWatcher(args)
// watcher.pollGps(true) // turn on gps
// watcher.pollGps(false) // stop off gps
//
// watcher.setLatLng(37, -121) // set this lat/lng as the location to get nodes near.
// watcher.dispose() // throw away watcher object.
//

import {parseAnchor, defaultNode} from './vps'

type OnCoverageNodeUpdatedCb = (node: CoverageNodeInfo) => void
interface CoverageNodeInfo {
  // The Node Coverage Id.
  id: string
  // URL to a representative image for this Node.
  image: string
  // The Node title.
  title: string
  // This location of this Node.
  lat: number
  lng: number
  anchor?: any
  node?: string
  localizability?: string
  area?: LatLng[]
}

interface LatLng {
  lat: number
  lng: number
}

interface IPoint {
  // eslint-disable-next-line camelcase
  lat_degrees: number
  // eslint-disable-next-line camelcase
  lng_degrees: number
}

interface IVpsLocalizationTarget {
  id: string
  // eslint-disable-next-line camelcase
  image_url: string
  // eslint-disable-next-line no-restricted-globals
  name: string
  // eslint-disable-next-line camelcase
  default_anchor: string
  shape: {point: IPoint}
}

interface IVpsLocalizationTargets {
  // eslint-disable-next-line camelcase
  vps_localization_target: IVpsLocalizationTarget[]
}

interface IVpsCoverageArea {
  localizability: string
  // eslint-disable-next-line camelcase
  vps_localization_target_id: string[]
}

interface IVpsCoverageMap {
  // eslint-disable-next-line camelcase
  vps_coverage_area: IVpsCoverageArea[]
}

interface ICoverageWatcher {
  dispose(): void
  pollGps(boolean): void
  setLatLng(lat: number, lng: number): void
}

interface ICoverageWatcherArgs {
  // (optional) Callback that is called when a new coverage node becomes visible within a 1000 meter
  // radius.
  onVisible?: OnCoverageNodeUpdatedCb,
  // (optional) Callback that is called when a coverage node you previously saw is no longer within a
  // 1000 meter radius from you.
  onHidden?: OnCoverageNodeUpdatedCb,
  // (optional) If true, turns on gps and calls `onVisible` and `onHidden` callbacks with any
  // coverage nodes we find/loose through gps movement.
  pollGps?: boolean,
  // (optional) @lat/@lng If set, calls `onVisible` and `onHidden` callbacks with any coverage nodes we
  // find/loose near the set location
  lat?: number,
  lng?: number,
}

interface IGeoLocation {
  lat: number
  lng: number
}

const COVERAGE_PROD_URL =
  'https://vps-coverage-api.nianticlabs.com/api/json/v1'

const xrLoaded = (window as any).XR8 ? Promise.resolve() : new Promise((resolve) => {
  window.addEventListener('xrloaded', () => resolve(), {once: true})
})

const getAuth = () => xrLoaded.then(() => (window as any).XR8.Platform.authorizationToken())

const processResponse = async (res) => {
  const resJson = await res.json()
  if (res.ok) {
    return resJson
  }

  throw new Error(`[XR] ${resJson.message} ${res.status} ${resJson.code}`)
}

async function vpsFetch<T>(url: string, body: string, additionalFetchParams = {}): Promise<T> {
  const headers = {
    'Authorization': await getAuth(),
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  const res = await fetch(url, {headers, method: 'POST', body, ...additionalFetchParams})
  return processResponse(res)
}

const arCommonMetadata = () => {
  let {model} = (window as any).XR8.XrDevice.deviceEstimate()
  const {manufacturer, os, osVersion} = (window as any).XR8.XrDevice.deviceEstimate()
  const modelUpper = model.toUpperCase()
  const manufacturerUpper = manufacturer.toUpperCase()
  if (manufacturerUpper === 'APPLE') {
    if (modelUpper.startsWith('IPHONE')) {
      model = 'iPhone'
    } else if (modelUpper.startsWith('IPAD')) {
      model = 'iPad'
    } else if (modelUpper.startsWith('IPOD')) {
      model = 'iPod'
    }
  } else if (manufacturerUpper === 'SAMSUNG') {
    model = model.substring(0, 7)
  } else if (manufacturerUpper === 'HUAWEI') {
    model = model.split('-')[0]
  }

  return {
    // e.g. 000053F02F5D3C784D5E19F6D8386374
    requestId: (crypto as any).randomUUID().replaceAll('-', '').toLowerCase(),
    // e.g. Android 11, iOS 14.7.1.
    platform: `${os} ${osVersion}`,
    // e.g. Apple, Google.
    manufacturer,
    // e.g. Nexus 5, iPhone13,2.
    deviceModel: model,
  }
}

// This can be made to take generic T
// chunkBy([0,1,2,3,4], 3) => [[0,1,2], [3,4]]
const chunkBy = (ids: string[], chunkSize: number): string[][] => {
  const chunkedData: string[][] = []
  for (let i = 0; i < ids.length; i += chunkSize) {
    chunkedData.push(ids.slice(i, i + chunkSize))
  }
  return chunkedData
}

const COVERAGE_MAX_RADIUS_METERS = 2000

const distance = (from: IGeoLocation, to: IGeoLocation): number => {
  // Computational optimization for no change.
  if (from.lat === to.lat && from.lng === to.lng) {
    return 0
  }
  const lat1R = (from.lat * Math.PI) / 180
  const lat2R = (to.lat * Math.PI) / 180
  const halfLatD = 0.5 * (lat2R - lat1R)
  const halfLngD = 0.5 * ((to.lng * Math.PI) / 180 - (from.lng * Math.PI) / 180)
  const v = Math.sin(halfLatD) ** 2 + (Math.sin(halfLngD) ** 2) * Math.cos(lat1R) * Math.cos(lat2R)
  const arc = 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v))
  return arc * 6371008.8  // Earth arithmetic mean radius, per en.wikipedia.org/wiki/Earth_radius
}

const Gps = (callback) => {
  let watchPositionId_ = 0
  const callback_ = callback

  const updateDeviceGeolocation = ({coords}) => {
    callback_(coords.latitude, coords.longitude)
  }

  const start = () => {
    if (watchPositionId_ === 0) {
      watchPositionId_ = navigator.geolocation.watchPosition(
        updateDeviceGeolocation, () => {}, {enableHighAccuracy: true}
      )
    }
  }

  const stopAndClear = () => {
    navigator.geolocation.clearWatch(watchPositionId_)
    watchPositionId_ = 0
  }

  return {
    start,
    stopAndClear,
  }
}

const validLatLng = (lat: number, lng: number): boolean => (
  lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
)

// Fetches detailed metadata for a set of coverage node ids.
// @param batchSize chunk the list of targets by batchSize when request
//
const fetchNodeDetails = (queryIds: string[], batchSize = 100): Promise<CoverageNodeInfo[]> => {
  const chunkedQueryIds = chunkBy(queryIds, batchSize)
  const results = Promise.all(
    chunkedQueryIds.map(idsToQuery => (
      vpsFetch<IVpsLocalizationTargets>(`${COVERAGE_PROD_URL}/GET_VPS_LOCALIZATION_TARGETS`,
        JSON.stringify(
          {
            'queryId': idsToQuery,
            'arCommonMetadata': arCommonMetadata(),
          }
        ))
        .then((vpsLocalizationTargets) => {
          if (!vpsLocalizationTargets) {
            // eslint-disable-next-line no-console
            console.error('[XR] Error fetching Node localization targets')
            return []
          }
          return vpsLocalizationTargets.vps_localization_target.map((target) => {
            const anchor = parseAnchor(target.default_anchor)
            return {
              id: target.id,
              image: target.image_url?.replace('http://', 'https://'),
              title: target.name,
              lat: target.shape?.point?.lat_degrees,
              lng: target.shape?.point?.lng_degrees,
              anchor,
              node: defaultNode(anchor),
            }
          })
        })
    ))
  )
  // combine the results together
  return results.then(allResults => ([] as CoverageNodeInfo[]).concat(...allResults))
}

// Returns a promise with vps coverage nodes on resolve. If we hit an error then we reject with the error
// message.
const fetchNodes = async (lat: number, lng: number): Promise<CoverageNodeInfo[]> => {
  await xrLoaded
  const coverageData = await vpsFetch<IVpsCoverageMap>(`${COVERAGE_PROD_URL}/GET_VPS_COVERAGE`, JSON.stringify(
    {
      'queryLocation': {
        'latDegrees': lat,
        'lngDegrees': lng,
      },
      'queryRadiusInMeters': COVERAGE_MAX_RADIUS_METERS,
      'userDistanceToQueryLocationInMeters': 0,
      'arCommonMetadata': arCommonMetadata(),
    }
  ))
  if (!coverageData.vps_coverage_area || !coverageData.vps_coverage_area.length) {
    return []  // No nearby coverage nodes.
  }

  const coverageResults = coverageData.vps_coverage_area.reduce(
    (m, v: any) => {
      m[v.vps_localization_target_id] = {
        // id: v.vps_localization_target_id,
        localizability: v.localizability,
        area: v?.shape?.polygon?.loop?.[0]?.vertex?.map(p => ({lat: p.lat_degrees, lng: p.lng_degrees})),
      }
      return m
    }, {}
  )

  const queryIds = Object.keys(coverageResults)

  const details = await fetchNodeDetails(queryIds)
  details.sort((a, b) => a.id.localeCompare(b.id))
  details.forEach(d => Object.assign(d, coverageResults[d.id]))
  return details
}

// See `ICoverageWatcherArgs` above for optional parameters that we can pass into args.
const makeCoverageWatcher = (args: ICoverageWatcherArgs): ICoverageWatcher => {
  let lastNodes_: CoverageNodeInfo[] = []
  let requestQueue_ = Promise.resolve()
  let {
    onVisible: onVisible_ = () => {},
    onHidden: onHidden_ = () => {},
    pollGps: pollGps_ = false,
    lat: lat_ = -180,
    lng: lng_ = -360,
  } = args

  const updateNodeVisibility = (currentNodes: CoverageNodeInfo[]): void => {
    const lastNodeCids = new Set(lastNodes_.map(node => node.id))
    const currentNodeCids = new Set(currentNodes.map(node => node.id))

    const newNodes: CoverageNodeInfo[] =
      currentNodes.filter(node => !lastNodeCids.has(node.id))
    const lostNodes: CoverageNodeInfo[] =
      lastNodes_.filter(oldNode => !currentNodeCids.has(oldNode.id))

    if (onHidden_) {
      lostNodes.forEach(node => onHidden_(node))
    }
    if (onVisible_) {
      newNodes.forEach(node => onVisible_(node))
    }

    lastNodes_ = currentNodes
  }

  // Updates lastNodes_ and calls onVisible_ and onHidden_ user supplied callbacks.
  const update = (lat: number, lng: number, skipDistanceCheck: boolean = false) => {
    if (!validLatLng(lat, lng)) {
      return
    }
    if (!skipDistanceCheck &&
      validLatLng(lat_, lng_) &&
      distance({lat, lng}, {lat: lat_, lng: lng_}) < (0.5 * COVERAGE_MAX_RADIUS_METERS)) {
      return
    }
    lat_ = lat
    lng_ = lng
    // Wait for pending queries to resolve before sending new fetches, and then add new fetches to
    // the queue. This ensures that updates are applied in order, so the most recent lat/lng is
    // always updated last.
    requestQueue_ = requestQueue_.then(() => {
      // If this poll is not the most recent poll, skip fetching.
      if (lat_ !== lat || lng_ !== lng) {
        return null
      }
      return fetchNodes(lat, lng).then(updateNodeVisibility)
    })
  }

  let gps_ = Gps(update)

  // Turn on or off gps updates
  const pollGps = (poll: boolean): void => {
    pollGps_ = poll
    if (pollGps_) {
      gps_.start()
    } else {
      gps_.stopAndClear()
    }
  }

  // Set the current location to `lat` / `lng`.
  const setLatLng = (lat: number, lng: number): void => update(lat, lng)

  // Clears state and stops gps. Updates and will no longer call any callbacks (`onVisible_()`
  // and `onHidden_()`)
  const dispose = (): void => {
    lastNodes_ = []
    onVisible_ = () => {}
    onHidden_ = () => {}
    pollGps_ = false
    lat_ = -180
    lng_ = -360
    requestQueue_ = Promise.resolve()
    gps_.stopAndClear()
    gps_ = null
  }

  // Run once in the call to makeCoverageWatcher(). Skip latlng check.
  update(lat_, lng_, true)
  pollGps(pollGps_)

  return {
    dispose,
    pollGps,
    setLatLng,
  }
}

// const workerUrl = require('./assets/draco-worker.lib')
const url = `${new URL(window.location.href).origin}${require('./assets/draco-worker.lib')}`
const workerUrl = URL.createObjectURL(new Blob([`\
importScripts(${JSON.stringify(url)})
`], {type: 'application/javascript'}))

const dracoWorker : Partial<Worker> = workerUrl ? new Worker(workerUrl) : {postMessage: () => {}}
dracoWorker.onerror = (event) => {
  console.error(`Error loading ${workerUrl},`, event.message)
}

const dracoResolvers = {}
dracoWorker.onmessage = (event: MessageEvent) => {
  dracoResolvers[event.data.requestIdentifier].resolve(event.data)
  delete dracoResolvers[event.data.requestIdentifier]
}

const fetchNodeGlobalPose = async (nodeId) => {
  const fetchResult = await vpsFetch<any>(
    'https://storage-service.nianticlabs.com/web/storage_service.protogen.Storage/GetNodeDataLayerItem',
    JSON.stringify({
      nodeId,
      dataLayerName: 'global_pose',
      version: {
        'value': 0,
        'latest': true,
        'ignored': false,
      },
      data_layer_item_key: 5,
    })
  )
  return JSON.parse(atob(fetchResult.response))
}

const fetchMesh = async (nodeId) => {
  const metadata = arCommonMetadata()
  const globalPosePromise = fetchNodeGlobalPose(nodeId)
  const fetchResult = await vpsFetch<any>(
    'https://vps-frontend.nianticlabs.com/web/vps_frontend.protogen.Localizer/GetMesh',
    JSON.stringify({
      arCommonMetadata: JSON.stringify(metadata),
      meshType: 'TEXTURED',
      nodeId,
      requestIdentifier: metadata.requestId,
    })
  )
  const geometryPromise = new Promise((resolve) => {
    dracoResolvers[metadata.requestId] = {resolve}
  })
  dracoWorker.postMessage(fetchResult)

  const globalPose = await globalPosePromise
  return {...fetchResult, geometryPromise, globalPose}
}

export {
  ICoverageWatcher,
  ICoverageWatcherArgs,
  makeCoverageWatcher,
  fetchMesh,
}
