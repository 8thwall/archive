import type {MapTheme} from '@ecs/shared/scene-graph'

import type {SubMenuCategory} from '../ui/submenu'

const LAND_PROPS: (keyof MapTheme)[] = [
  'landColor',
  'landOpacity',
  'landVisibility',
]

const BUILDING_PROPS: (keyof MapTheme)[] = [
  'buildingColor',
  'buildingOpacity',
  'buildingMinMeters',
  'buildingMaxMeters',
  'buildingVisibility',
  'buildingBase',
]

const PARK_PROPS: (keyof MapTheme)[] = [
  'parkColor',
  'parkOpacity',
  'parkVisibility',
  'parkBase',
]

const PARKING_PROPS: (keyof MapTheme)[] = [
  'parkingColor',
  'parkingOpacity',
  'parkingVisibility',
  'parkingBase',
]

const TRANSIT_PROPS: (keyof MapTheme)[] = [
  'transitColor',
  'transitOpacity',
  'transitVisibility',
  'transitMeters',
  'transitBase',
]

const ROAD_PROPS: (keyof MapTheme)[] = [
  'roadColor',
  'roadOpacity',
  'roadVisibility',
  'roadSMeters',
  'roadMMeters',
  'roadLMeters',
  'roadXLMeters',
  'roadBase',
]

const SAND_PROPS: (keyof MapTheme)[] = [
  'sandColor',
  'sandOpacity',
  'sandVisibility',
  'sandBase',
]

const WATER_PROPS: (keyof MapTheme)[] = [
  'waterColor',
  'waterOpacity',
  'waterVisibility',
  'waterMeters',
  'waterBase',
]

const getLabel = (
  prop: keyof MapTheme
) => `map_configurator.${prop.replace(/([A-Z])/g, '_$1').toLowerCase()}.label`

const makeCategoryMenu = (category: string, properties: (keyof MapTheme)[]) => ({
  value: `map_configurator.property_selector.category.${category}`,
  parent: null,
  options: properties.map(prop => ({
    content: getLabel(prop),
    value: prop,
    ns: 'cloud-studio-pages',
  })),
})

const ALL_MAP_CATEGORIES = [
  makeCategoryMenu('land', LAND_PROPS),
  makeCategoryMenu('building', BUILDING_PROPS),
  makeCategoryMenu('park', PARK_PROPS),
  makeCategoryMenu('parking', PARKING_PROPS),
  makeCategoryMenu('transit', TRANSIT_PROPS),
  makeCategoryMenu('road', ROAD_PROPS),
  makeCategoryMenu('sand', SAND_PROPS),
  makeCategoryMenu('water', WATER_PROPS),
] as SubMenuCategory[]

export {
  LAND_PROPS,
  BUILDING_PROPS,
  PARK_PROPS,
  PARKING_PROPS,
  ROAD_PROPS,
  SAND_PROPS,
  WATER_PROPS,
  TRANSIT_PROPS,
  getLabel,
  ALL_MAP_CATEGORIES,
}
