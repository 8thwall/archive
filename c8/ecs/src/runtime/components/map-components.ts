import * as Types from '../types'

import {registerAttribute} from '../registry'
import {
  DEFAULT_LAT, DEFAULT_LNG, DEFAULT_RADIUS, DEFAULT_SCALE, MAP_DEFAULTS, MAP_THEME_DEFAULTS,
  THEME_PRESETS,
} from '../../shared/map-constants'

const Map = registerAttribute('map', {
  latitude: Types.f64,
  longitude: Types.f64,
  targetEntity: Types.eid,
  radius: Types.f32,
  spawnLocations: Types.boolean,
  useGps: Types.boolean,
}, {...MAP_DEFAULTS, targetEntity: BigInt(0)})

const MapTheme = registerAttribute('map-theme', {
  landColor: Types.string,
  buildingColor: Types.string,
  parkColor: Types.string,
  parkingColor: Types.string,
  roadColor: Types.string,
  sandColor: Types.string,
  transitColor: Types.string,
  waterColor: Types.string,

  landOpacity: Types.f32,
  buildingOpacity: Types.f32,
  parkOpacity: Types.f32,
  parkingOpacity: Types.f32,
  roadOpacity: Types.f32,
  sandOpacity: Types.f32,
  transitOpacity: Types.f32,
  waterOpacity: Types.f32,

  lod: Types.f32,

  buildingBase: Types.f32,
  parkBase: Types.f32,
  parkingBase: Types.f32,
  roadBase: Types.f32,
  sandBase: Types.f32,
  transitBase: Types.f32,
  waterBase: Types.f32,

  buildingMinMeters: Types.f32,
  buildingMaxMeters: Types.f32,
  roadLMeters: Types.f32,
  roadMMeters: Types.f32,
  roadSMeters: Types.f32,
  roadXLMeters: Types.f32,
  transitMeters: Types.f32,
  waterMeters: Types.f32,

  roadLMin: Types.f32,
  roadMMin: Types.f32,
  roadSMin: Types.f32,
  roadXLMin: Types.f32,
  transitMin: Types.f32,
  waterMin: Types.f32,

  landVisibility: Types.boolean,
  buildingVisibility: Types.boolean,
  parkVisibility: Types.boolean,
  parkingVisibility: Types.boolean,
  roadVisibility: Types.boolean,
  sandVisibility: Types.boolean,
  transitVisibility: Types.boolean,
  waterVisibility: Types.boolean,
}, {...MAP_THEME_DEFAULTS, ...THEME_PRESETS.natural})

const MapPoint = registerAttribute('map-point', {
  latitude: Types.f32,
  longitude: Types.f32,
  targetEntity: Types.eid,
  meters: Types.f32,
  minScale: Types.f32,
}, {
  latitude: DEFAULT_LAT,
  longitude: DEFAULT_LNG,
  targetEntity: BigInt(0),
  meters: DEFAULT_RADIUS / DEFAULT_SCALE,
  minScale: 0,
})

export {
  Map,
  MapTheme,
  MapPoint,
}
