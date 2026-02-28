// Style types
type AlignContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'stretch'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

type AlignItems =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'stretch'
  | 'baseline'

type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

type TextAlignContent =
  | 'left'
  | 'center'
  | 'right'
  | 'justify'

type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
type Direction = 'ltr' | 'rtl'
type Display = 'none' | 'flex'
type Overflow = 'visible' | 'hidden' | 'scroll'
type PositionMode = 'absolute' | 'relative' | 'static'

// Core types
type GeometryType = 'box' | 'sphere' | 'plane' | 'capsule' | 'cone' | 'cylinder' | 'tetrahedron' |
  'polyhedron' | 'circle' | 'ring' | 'torus' | 'face'

type Side = 'front' | 'back' | 'double'
type MaterialBlending = 'no' | 'normal' | 'additive' | 'subtractive' | 'multiply'
type TextureWrap = 'clamp' | 'repeat' | 'mirroredRepeat'
type Faces = 4 | 8 | 12 | 20
type ColliderType = 'box' | 'sphere' | 'plane' | 'capsule' | 'cone' | 'cylinder' | 'auto'
type DistanceModel = 'exponential' | 'inverse' | 'linear'
type LightType = 'directional' | 'ambient' | 'point' | 'spot'
type CameraType = 'perspective' | 'orthographic'
type XRCameraType = 'world' | 'face' | 'hand' | 'layers' | 'worldLayers' | '3dOnly'
type DeviceSupportType = 'AR' | 'VR' | '3D' | 'disabled'
type CameraDirectionType = 'front' | 'back'
type UiRootType = 'overlay' | '3d'
type BackgroundSize = 'contain' | 'cover' | 'stretch' | 'nineslice'
type LocationVisualization = 'mesh' | 'splat' | 'none'

// Reference and resource types
type EntityReference = { type: 'entity', id: string }
type Url = { type: 'url', url: string }
type Asset = { type: 'asset', asset: string }
type Resource = Url | Asset
type FontResource = { type: 'font', font: string } | Resource

// GraphComponent type
interface GraphComponent {
  id: string
  name: string
  parameters: Record<string, string | number | boolean | EntityReference>
}

// Path type - string literal union of all keys in FlattenedBaseGraphObject
type Path =
  | 'id'
  | 'name'
  | 'parentId'
  | 'prefab'
  | 'position'
  | 'rotation'
  | 'scale'
  | 'hidden'
  | 'ephemeral'
  | 'disabled'
  | 'persistent'
  | 'order'
  | 'components'
  | 'geometry.type'
  | 'geometry.width'
  | 'geometry.height'
  | 'geometry.depth'
  | 'geometry.radius'
  | 'geometry.innerRadius'
  | 'geometry.outerRadius'
  | 'geometry.tubeRadius'
  | 'geometry.faces'
  | 'geometry.id'
  | 'material.type'
  | 'material.color'
  | 'material.textureSrc'
  | 'material.roughness'
  | 'material.metalness'
  | 'material.opacity'
  | 'material.normalScale'
  | 'material.emissiveIntensity'
  | 'material.roughnessMap'
  | 'material.metalnessMap'
  | 'material.opacityMap'
  | 'material.normalMap'
  | 'material.emissiveMap'
  | 'material.emissiveColor'
  | 'material.side'
  | 'material.blending'
  | 'material.repeatX'
  | 'material.repeatY'
  | 'material.offsetX'
  | 'material.offsetY'
  | 'material.wrap'
  | 'material.depthTest'
  | 'material.depthWrite'
  | 'material.wireframe'
  | 'material.forceTransparent'
  | 'gltfModel.src'
  | 'gltfModel.animationClip'
  | 'gltfModel.loop'
  | 'gltfModel.paused'
  | 'gltfModel.timeScale'
  | 'gltfModel.reverse'
  | 'gltfModel.repetitions'
  | 'gltfModel.crossFadeDuration'
  | 'splat.src'
  | 'splat.skybox'
  | 'collider.geometry.type'
  | 'collider.geometry.width'
  | 'collider.geometry.height'
  | 'collider.geometry.depth'
  | 'collider.geometry.radius'
  | 'collider.mass'
  | 'collider.linearDamping'
  | 'collider.angularDamping'
  | 'collider.friction'
  | 'collider.rollingFriction'
  | 'collider.spinningFriction'
  | 'collider.restitution'
  | 'collider.eventOnly'
  | 'collider.lockXAxis'
  | 'collider.lockYAxis'
  | 'collider.lockZAxis'
  | 'collider.gravityFactor'
  | 'audio.src'
  | 'audio.volume'
  | 'audio.loop'
  | 'audio.paused'
  | 'audio.pitch'
  | 'audio.positional'
  | 'audio.refDistance'
  | 'audio.rolloffFactor'
  | 'audio.distanceModel'
  | 'audio.maxDistance'
  | 'ui.top'
  | 'ui.left'
  | 'ui.right'
  | 'ui.bottom'
  | 'ui.width'
  | 'ui.height'
  | 'ui.type'
  | 'ui.font'
  | 'ui.background'
  | 'ui.backgroundOpacity'
  | 'ui.backgroundSize'
  | 'ui.nineSliceBorderTop'
  | 'ui.nineSliceBorderBottom'
  | 'ui.nineSliceBorderLeft'
  | 'ui.nineSliceBorderRight'
  | 'ui.nineSliceScaleFactor'
  | 'ui.opacity'
  | 'ui.color'
  | 'ui.text'
  | 'ui.textAlign'
  | 'ui.image'
  | 'ui.fixedSize'
  | 'ui.borderColor'
  | 'ui.borderRadius'
  | 'ui.borderRadiusTopLeft'
  | 'ui.borderRadiusTopRight'
  | 'ui.borderRadiusBottomRight'
  | 'ui.borderRadiusBottomLeft'
  | 'ui.fontSize'
  | 'ui.alignContent'
  | 'ui.alignItems'
  | 'ui.alignSelf'
  | 'ui.borderWidth'
  | 'ui.direction'
  | 'ui.display'
  | 'ui.flex'
  | 'ui.flexBasis'
  | 'ui.flexDirection'
  | 'ui.rowGap'
  | 'ui.gap'
  | 'ui.columnGap'
  | 'ui.flexGrow'
  | 'ui.flexShrink'
  | 'ui.flexWrap'
  | 'ui.justifyContent'
  | 'ui.margin'
  | 'ui.marginBottom'
  | 'ui.marginLeft'
  | 'ui.marginRight'
  | 'ui.marginTop'
  | 'ui.maxHeight'
  | 'ui.maxWidth'
  | 'ui.minHeight'
  | 'ui.minWidth'
  | 'ui.overflow'
  | 'ui.padding'
  | 'ui.paddingBottom'
  | 'ui.paddingLeft'
  | 'ui.paddingRight'
  | 'ui.paddingTop'
  | 'ui.position'
  | 'ui.video'
  | 'shadow.castShadow'
  | 'shadow.receiveShadow'
  | 'light.type'
  | 'light.color'
  | 'light.intensity'
  | 'light.castShadow'
  | 'light.target'
  | 'light.shadowNormalBias'
  | 'light.shadowBias'
  | 'light.shadowAutoUpdate'
  | 'light.shadowBlurSamples'
  | 'light.shadowRadius'
  | 'light.shadowMapSize'
  | 'light.shadowCamera'
  | 'light.distance'
  | 'light.decay'
  | 'light.followCamera'
  | 'light.angle'
  | 'light.penumbra'
  | 'light.colorMap'
  | 'camera.type'
  | 'camera.left'
  | 'camera.right'
  | 'camera.top'
  | 'camera.bottom'
  | 'camera.fov'
  | 'camera.zoom'
  | 'camera.nearClip'
  | 'camera.farClip'
  | 'camera.xr.xrCameraType'
  | 'camera.xr.phone'
  | 'camera.xr.desktop'
  | 'camera.xr.headset'
  | 'camera.xr.leftHandedAxes'
  | 'camera.xr.uvType'
  | 'camera.xr.direction'
  | 'camera.xr.world.scale'
  | 'camera.xr.world.disableWorldTracking'
  | 'camera.xr.world.enableLighting'
  | 'camera.xr.world.enableWorldPoints'
  | 'camera.xr.world.enableVps'
  | 'camera.xr.face.mirroredDisplay'
  | 'camera.xr.face.meshGeometryFace'
  | 'camera.xr.face.meshGeometryEyes'
  | 'camera.xr.face.meshGeometryIris'
  | 'camera.xr.face.meshGeometryMouth'
  | 'camera.xr.face.enableEars'
  | 'camera.xr.face.maxDetections'
  | 'face.id'
  | 'face.addAttachmentState'
  | 'imageTarget.name'
  | 'location.name'
  | 'location.poiId'
  | 'location.lat'
  | 'location.lng'
  | 'location.title'
  | 'location.anchorNodeId'
  | 'location.anchorSpaceId'
  | 'location.imageUrl'
  | 'location.anchorPayload'
  | 'location.visualization'
  | 'map.latitude'
  | 'map.longitude'
  | 'map.targetEntity'
  | 'map.radius'
  | 'map.spawnLocations'
  | 'map.useGps'
  | 'mapTheme.landColor'
  | 'mapTheme.buildingColor'
  | 'mapTheme.parkColor'
  | 'mapTheme.parkingColor'
  | 'mapTheme.roadColor'
  | 'mapTheme.sandColor'
  | 'mapTheme.transitColor'
  | 'mapTheme.waterColor'
  | 'mapTheme.landOpacity'
  | 'mapTheme.buildingOpacity'
  | 'mapTheme.parkOpacity'
  | 'mapTheme.parkingOpacity'
  | 'mapTheme.roadOpacity'
  | 'mapTheme.sandOpacity'
  | 'mapTheme.transitOpacity'
  | 'mapTheme.waterOpacity'
  | 'mapTheme.lod'
  | 'mapTheme.buildingBase'
  | 'mapTheme.parkBase'
  | 'mapTheme.parkingBase'
  | 'mapTheme.roadBase'
  | 'mapTheme.sandBase'
  | 'mapTheme.transitBase'
  | 'mapTheme.waterBase'
  | 'mapTheme.buildingMinMeters'
  | 'mapTheme.buildingMaxMeters'
  | 'mapTheme.roadLMeters'
  | 'mapTheme.roadMMeters'
  | 'mapTheme.roadSMeters'
  | 'mapTheme.roadXLMeters'
  | 'mapTheme.transitMeters'
  | 'mapTheme.waterMeters'
  | 'mapTheme.roadLMin'
  | 'mapTheme.roadMMin'
  | 'mapTheme.roadSMin'
  | 'mapTheme.roadXLMin'
  | 'mapTheme.transitMin'
  | 'mapTheme.waterMin'
  | 'mapTheme.landVisibility'
  | 'mapTheme.buildingVisibility'
  | 'mapTheme.parkVisibility'
  | 'mapTheme.parkingVisibility'
  | 'mapTheme.roadVisibility'
  | 'mapTheme.sandVisibility'
  | 'mapTheme.transitVisibility'
  | 'mapTheme.waterVisibility'
  | 'mapPoint.latitude'
  | 'mapPoint.longitude'
  | 'mapPoint.targetEntity'
  | 'mapPoint.meters'
  | 'mapPoint.minScale'

// PathValue type - union of objects, each with a single key-value pair (no optionals)
type PathValue =
  | { 'id': string }
  | { 'name': string }
  | { 'parentId': string }
  | { 'prefab': true }
  | { 'position': [number, number, number] }
  | { 'rotation': [number, number, number, number] }
  | { 'scale': [number, number, number] }
  | { 'hidden': boolean }
  | { 'ephemeral': boolean }
  | { 'disabled': true }
  | { 'persistent': true }
  | { 'order': number }
  | { 'components': Record<string, GraphComponent> }
  | { 'geometry.type': GeometryType }
  | { 'geometry.width': number }
  | { 'geometry.height': number }
  | { 'geometry.depth': number }
  | { 'geometry.radius': number }
  | { 'geometry.innerRadius': number }
  | { 'geometry.outerRadius': number }
  | { 'geometry.tubeRadius': number }
  | { 'geometry.faces': Faces }
  | { 'geometry.id': number }
  | { 'material.type': 'basic' | 'unlit' | 'shadow' | 'hider' }
  | { 'material.color': string }
  | { 'material.textureSrc': string | Resource }
  | { 'material.roughness': number }
  | { 'material.metalness': number }
  | { 'material.opacity': number }
  | { 'material.normalScale': number }
  | { 'material.emissiveIntensity': number }
  | { 'material.roughnessMap': string | Resource }
  | { 'material.metalnessMap': string | Resource }
  | { 'material.opacityMap': string | Resource }
  | { 'material.normalMap': string | Resource }
  | { 'material.emissiveMap': string | Resource }
  | { 'material.emissiveColor': string }
  | { 'material.side': Side }
  | { 'material.blending': MaterialBlending }
  | { 'material.repeatX': number }
  | { 'material.repeatY': number }
  | { 'material.offsetX': number }
  | { 'material.offsetY': number }
  | { 'material.wrap': TextureWrap }
  | { 'material.depthTest': boolean }
  | { 'material.depthWrite': boolean }
  | { 'material.wireframe': boolean }
  | { 'material.forceTransparent': boolean }
  | { 'gltfModel.src': Resource }
  | { 'gltfModel.animationClip': string }
  | { 'gltfModel.loop': boolean }
  | { 'gltfModel.paused': boolean }
  | { 'gltfModel.timeScale': number }
  | { 'gltfModel.reverse': boolean }
  | { 'gltfModel.repetitions': number }
  | { 'gltfModel.crossFadeDuration': number }
  | { 'splat.src': Resource }
  | { 'splat.skybox': boolean }
  | { 'collider.geometry.type': ColliderType }
  | { 'collider.geometry.width': number }
  | { 'collider.geometry.height': number }
  | { 'collider.geometry.depth': number }
  | { 'collider.geometry.radius': number }
  | { 'collider.mass': number }
  | { 'collider.linearDamping': number }
  | { 'collider.angularDamping': number }
  | { 'collider.friction': number }
  | { 'collider.rollingFriction': number }
  | { 'collider.spinningFriction': number }
  | { 'collider.restitution': number }
  | { 'collider.eventOnly': boolean }
  | { 'collider.lockXAxis': boolean }
  | { 'collider.lockYAxis': boolean }
  | { 'collider.lockZAxis': boolean }
  | { 'collider.gravityFactor': number }
  | { 'audio.src': Resource }
  | { 'audio.volume': number }
  | { 'audio.loop': boolean }
  | { 'audio.paused': boolean }
  | { 'audio.pitch': number }
  | { 'audio.positional': boolean }
  | { 'audio.refDistance': number }
  | { 'audio.rolloffFactor': number }
  | { 'audio.distanceModel': DistanceModel }
  | { 'audio.maxDistance': number }
  | { 'ui.top': string }
  | { 'ui.left': string }
  | { 'ui.right': string }
  | { 'ui.bottom': string }
  | { 'ui.width': number | string }
  | { 'ui.height': number | string }
  | { 'ui.type': UiRootType }
  | { 'ui.font': FontResource }
  | { 'ui.background': string }
  | { 'ui.backgroundOpacity': number }
  | { 'ui.backgroundSize': BackgroundSize }
  | { 'ui.nineSliceBorderTop': string }
  | { 'ui.nineSliceBorderBottom': string }
  | { 'ui.nineSliceBorderLeft': string }
  | { 'ui.nineSliceBorderRight': string }
  | { 'ui.nineSliceScaleFactor': number }
  | { 'ui.opacity': number }
  | { 'ui.color': string }
  | { 'ui.text': string }
  | { 'ui.textAlign': TextAlignContent }
  | { 'ui.image': Resource }
  | { 'ui.fixedSize': boolean }
  | { 'ui.borderColor': string }
  | { 'ui.borderRadius': number }
  | { 'ui.borderRadiusTopLeft': string }
  | { 'ui.borderRadiusTopRight': string }
  | { 'ui.borderRadiusBottomRight': string }
  | { 'ui.borderRadiusBottomLeft': string }
  | { 'ui.fontSize': number }
  | { 'ui.alignContent': AlignContent }
  | { 'ui.alignItems': AlignItems }
  | { 'ui.alignSelf': AlignItems }
  | { 'ui.borderWidth': number }
  | { 'ui.direction': Direction }
  | { 'ui.display': Display }
  | { 'ui.flex': number }
  | { 'ui.flexBasis': string }
  | { 'ui.flexDirection': FlexDirection }
  | { 'ui.rowGap': string }
  | { 'ui.gap': string }
  | { 'ui.columnGap': string }
  | { 'ui.flexGrow': number }
  | { 'ui.flexShrink': number }
  | { 'ui.flexWrap': FlexWrap }
  | { 'ui.justifyContent': JustifyContent }
  | { 'ui.margin': string }
  | { 'ui.marginBottom': string }
  | { 'ui.marginLeft': string }
  | { 'ui.marginRight': string }
  | { 'ui.marginTop': string }
  | { 'ui.maxHeight': string }
  | { 'ui.maxWidth': string }
  | { 'ui.minHeight': string }
  | { 'ui.minWidth': string }
  | { 'ui.overflow': Overflow }
  | { 'ui.padding': string }
  | { 'ui.paddingBottom': string }
  | { 'ui.paddingLeft': string }
  | { 'ui.paddingRight': string }
  | { 'ui.paddingTop': string }
  | { 'ui.position': PositionMode }
  | { 'ui.video': Resource }
  | { 'shadow.castShadow': boolean }
  | { 'shadow.receiveShadow': boolean }
  | { 'light.type': LightType }
  | { 'light.color': string }
  | { 'light.intensity': number }
  | { 'light.castShadow': boolean }
  | { 'light.target': [number, number, number] }
  | { 'light.shadowNormalBias': number }
  | { 'light.shadowBias': number }
  | { 'light.shadowAutoUpdate': boolean }
  | { 'light.shadowBlurSamples': number }
  | { 'light.shadowRadius': number }
  | { 'light.shadowMapSize': [number, number] }
  | { 'light.shadowCamera': [number, number, number, number, number, number] }
  | { 'light.distance': number }
  | { 'light.decay': number }
  | { 'light.followCamera': boolean }
  | { 'light.angle': number }
  | { 'light.penumbra': number }
  | { 'light.colorMap': Resource }
  | { 'camera.type': CameraType }
  | { 'camera.left': number }
  | { 'camera.right': number }
  | { 'camera.top': number }
  | { 'camera.bottom': number }
  | { 'camera.fov': number }
  | { 'camera.zoom': number }
  | { 'camera.nearClip': number }
  | { 'camera.farClip': number }
  | { 'camera.xr.xrCameraType': XRCameraType }
  | { 'camera.xr.phone': DeviceSupportType }
  | { 'camera.xr.desktop': DeviceSupportType }
  | { 'camera.xr.headset': DeviceSupportType }
  | { 'camera.xr.leftHandedAxes': boolean }
  | { 'camera.xr.uvType': 'standard' | 'projected' }
  | { 'camera.xr.direction': CameraDirectionType }
  | { 'camera.xr.world.scale': 'absolute' | 'responsive' }
  | { 'camera.xr.world.disableWorldTracking': boolean }
  | { 'camera.xr.world.enableLighting': boolean }
  | { 'camera.xr.world.enableWorldPoints': boolean }
  | { 'camera.xr.world.enableVps': boolean }
  | { 'camera.xr.face.mirroredDisplay': boolean }
  | { 'camera.xr.face.meshGeometryFace': boolean }
  | { 'camera.xr.face.meshGeometryEyes': boolean }
  | { 'camera.xr.face.meshGeometryIris': boolean }
  | { 'camera.xr.face.meshGeometryMouth': boolean }
  | { 'camera.xr.face.enableEars': boolean }
  | { 'camera.xr.face.maxDetections': number }
  | { 'face.id': number }
  | { 'face.addAttachmentState': boolean }
  | { 'imageTarget.name': string }
  | { 'location.name': string }
  | { 'location.poiId': string }
  | { 'location.lat': number }
  | { 'location.lng': number }
  | { 'location.title': string }
  | { 'location.anchorNodeId': string }
  | { 'location.anchorSpaceId': string }
  | { 'location.imageUrl': string }
  | { 'location.anchorPayload': string }
  | { 'location.visualization': LocationVisualization }
  | { 'map.latitude': number }
  | { 'map.longitude': number }
  | { 'map.targetEntity': EntityReference }
  | { 'map.radius': number }
  | { 'map.spawnLocations': boolean }
  | { 'map.useGps': boolean }
  | { 'mapTheme.landColor': string }
  | { 'mapTheme.buildingColor': string }
  | { 'mapTheme.parkColor': string }
  | { 'mapTheme.parkingColor': string }
  | { 'mapTheme.roadColor': string }
  | { 'mapTheme.sandColor': string }
  | { 'mapTheme.transitColor': string }
  | { 'mapTheme.waterColor': string }
  | { 'mapTheme.landOpacity': number }
  | { 'mapTheme.buildingOpacity': number }
  | { 'mapTheme.parkOpacity': number }
  | { 'mapTheme.parkingOpacity': number }
  | { 'mapTheme.roadOpacity': number }
  | { 'mapTheme.sandOpacity': number }
  | { 'mapTheme.transitOpacity': number }
  | { 'mapTheme.waterOpacity': number }
  | { 'mapTheme.lod': number }
  | { 'mapTheme.buildingBase': number }
  | { 'mapTheme.parkBase': number }
  | { 'mapTheme.parkingBase': number }
  | { 'mapTheme.roadBase': number }
  | { 'mapTheme.sandBase': number }
  | { 'mapTheme.transitBase': number }
  | { 'mapTheme.waterBase': number }
  | { 'mapTheme.buildingMinMeters': number }
  | { 'mapTheme.buildingMaxMeters': number }
  | { 'mapTheme.roadLMeters': number }
  | { 'mapTheme.roadMMeters': number }
  | { 'mapTheme.roadSMeters': number }
  | { 'mapTheme.roadXLMeters': number }
  | { 'mapTheme.transitMeters': number }
  | { 'mapTheme.waterMeters': number }
  | { 'mapTheme.roadLMin': number }
  | { 'mapTheme.roadMMin': number }
  | { 'mapTheme.roadSMin': number }
  | { 'mapTheme.roadXLMin': number }
  | { 'mapTheme.transitMin': number }
  | { 'mapTheme.waterMin': number }
  | { 'mapTheme.landVisibility': boolean }
  | { 'mapTheme.buildingVisibility': boolean }
  | { 'mapTheme.parkVisibility': boolean }
  | { 'mapTheme.parkingVisibility': boolean }
  | { 'mapTheme.roadVisibility': boolean }
  | { 'mapTheme.sandVisibility': boolean }
  | { 'mapTheme.transitVisibility': boolean }
  | { 'mapTheme.waterVisibility': boolean }
  | { 'mapPoint.latitude': number }
  | { 'mapPoint.longitude': number }
  | { 'mapPoint.targetEntity': EntityReference }
  | { 'mapPoint.meters': number }
  | { 'mapPoint.minScale': number }

export type {
  Path,
  PathValue,
}
