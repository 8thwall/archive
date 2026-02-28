import React, {useRef, useEffect} from 'react'
import * as THREE from 'three'

import type {LocationVisualization} from '@ecs/shared/scene-graph'

import {useSelector} from '../hooks'
import vpsActions from '../vps/vps-actions'
import useActions from '../common/use-actions'
import useCurrentApp from '../common/use-current-app'
import {MAX_NODES, MESH_TYPE_PRIORITY, NODE_SEARCH_RADIUS} from '../vps/vps-constants'
import {
  useAlignedSpace, useSplatByPoi, useSrcToDstNodeTransform, useVpsMeshes,
} from '../apps/vps/vps-helpers'
import {Splat} from './splat'
import {useDebounce} from '../common/use-debounce'
import {isTestScanId} from '../vps/get-poi-type'

interface ILocationMesh {
  poiId: string
  anchorNodeId: string
}

const LocationMesh: React.FC<ILocationMesh> = ({poiId, anchorNodeId}) => {
  const nodes = useSelector(s => s.vps.nodes)
  const {defaultNode} = useSelector(s => s.vps.poiToDefaultAnchor[poiId]) ?? {}
  const spaceId = nodes[defaultNode]?.spaceIdentifier
  const spaceNodeIds = useSelector(s => s.vps.spaceToNodes[spaceId])

  // NOTE (JCHU): test scans are not part of any spaces, so we just use their nodeId directly
  const nodeIds = isTestScanId(poiId) ? [defaultNode] : spaceNodeIds
  const vpsMeshes = useVpsMeshes(nodeIds, MESH_TYPE_PRIORITY)

  const offset = useSrcToDstNodeTransform(defaultNode, anchorNodeId)

  const {loadedMesh} = useAlignedSpace(vpsMeshes, defaultNode, false, THREE.SRGBColorSpace, offset)

  return loadedMesh && (
    <primitive
      object={loadedMesh}
    />
  )
}

type ILocationSplat = {
  poiId: string
  anchorNodeId: string
}

const LocationSplat: React.FC<ILocationSplat> = ({poiId, anchorNodeId}) => {
  const [splatOffset] = React.useState<THREE.Matrix4>(new THREE.Matrix4().identity())
  const poiSplat = useSplatByPoi(poiId, anchorNodeId, splatOffset)

  // apply the offset from the splat node to the stored anchor node
  // so that the splat is aligned to the location origin
  const [position, rotation, scale] =
    React.useMemo<[THREE.Vector3, THREE.Euler, THREE.Vector3]>(() => {
      const p = new THREE.Vector3()
      const q = new THREE.Quaternion()
      const s = new THREE.Vector3()
      splatOffset.decompose(p, q, s)
      const euler = new THREE.Euler().setFromQuaternion(q)
      return [p, euler, s]
    }, [splatOffset.elements.join(',')])

  return poiSplat && (
    <object3D
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <Splat
        src={{type: 'url', url: poiSplat.splatUrl}}
        filename={`${poiId}.spz`}
      />
    </object3D>
  )
}

interface ILocation {
  visualization: LocationVisualization
  poiId: string
  anchorNodeId: string
}

const Location: React.FC<ILocation> = ({visualization, poiId, anchorNodeId}) => {
  const app = useCurrentApp()
  const nodes = useSelector(s => s.vps.nodes)
  const {defaultNode} = useSelector(s => s.vps.poiToDefaultAnchor[poiId]) ?? {}
  const {
    queryGraphWithNode,
    queryPoisByIdsDedup,
    getTestScanMeshByStudioLocation,
  } = useActions(vpsActions)

  const debouncedQueryPoisByIdsDedup = useDebounce(useRef(queryPoisByIdsDedup), 500)

  useEffect(() => {
    if (poiId && !defaultNode && !isTestScanId(poiId)) {
      debouncedQueryPoisByIdsDedup(app.uuid, [poiId])
    }
    if (isTestScanId(poiId)) {
      getTestScanMeshByStudioLocation(app.uuid, {poiId, anchorNodeId})
    }
  }, [app.uuid, poiId])

  useEffect(() => {
    if (poiId && defaultNode && !nodes[defaultNode]) {
      queryGraphWithNode(app.uuid, defaultNode, true, NODE_SEARCH_RADIUS, MAX_NODES)
    }
  }, [app.uuid, poiId, defaultNode])

  switch (visualization) {
    case 'mesh':
      return (
        <LocationMesh poiId={poiId} anchorNodeId={anchorNodeId} />
      )
    case 'splat':
      return (
        <LocationSplat poiId={poiId} anchorNodeId={anchorNodeId} />
      )
    default:
      return null
  }
}

export {
  Location,
  LocationSplat,
}
