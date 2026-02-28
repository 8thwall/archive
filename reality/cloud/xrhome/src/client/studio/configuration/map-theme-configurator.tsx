import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import type {MapTheme} from '@ecs/shared/scene-graph'
import {useTranslation} from 'react-i18next'
import {
  THEME_PRESETS, MAP_THEME_DEFAULTS, COLOR_SUFFIX, VISIBILITY_SUFFIX, OFFSET_SUFFIX,
  OPACITY_SUFFIX, SIZE_SUFFIX,
} from '@ecs/shared/map-constants'

import {FloatingTraySection} from '../../ui/components/floating-tray-section'
import {RowBooleanField, RowColorField, RowNumberField, RowSelectField} from './row-fields'
import {MapPropertySelector} from './map-property-selector'
import {
  getLabel, LAND_PROPS, BUILDING_PROPS, PARK_PROPS, PARKING_PROPS, ROAD_PROPS, SAND_PROPS,
  TRANSIT_PROPS, WATER_PROPS,
} from './map-property-strings'

interface IMapThemeConfigurator {
  mapTheme?: DeepReadonly<MapTheme>
  onChangeTheme: (themeUpdater: (newMap: MapTheme) => MapTheme) => void
}

const MapThemeConfigurator: React.FC<IMapThemeConfigurator> = ({mapTheme = {}, onChangeTheme}) => {
  const {t} = useTranslation(['cloud-studio-pages'])

  const selectedPreset = Object.entries(THEME_PRESETS)
    .find(([, props]) => {
      for (const key of Object.keys(MAP_THEME_DEFAULTS)) {
        if (mapTheme[key] !== props[key]) {
          return false
        }
      }
      return true
    })?.[0] ?? 'custom'

  const setTheme = (preset: string) => {
    onChangeTheme((o) => {
      const updated = {...o}
      // enumerate all keys so undefined properties are removed
      Object.keys(MAP_THEME_DEFAULTS).forEach((prop) => {
        if (THEME_PRESETS[preset][prop] !== undefined) {
          updated[prop] = THEME_PRESETS[preset][prop]
        } else {
          delete updated[prop]
        }
      })
      return updated
    })
  }

  // eslint-disable-next-line arrow-parens
  const updateTheme = <T extends keyof MapTheme>(key: T, value: NonNullable<MapTheme[T]>) => {
    onChangeTheme(o => ({...o, [key]: value}))
  }

  const removeThemeProperty = (key: keyof MapTheme) => {
    onChangeTheme((o) => {
      const updated = {...o}
      delete updated[key]
      return updated
    })
  }

  const presetOptions = Object.keys(THEME_PRESETS)
    .map(key => ({value: key, content: t(`map_configurator.preset.option.${key}`)}))
    .sort((a, b) => a.content.localeCompare(b.content))

  const LAYER_PROPS = [
    ...LAND_PROPS, ...BUILDING_PROPS, ...PARK_PROPS, ...PARKING_PROPS, ...TRANSIT_PROPS,
    ...ROAD_PROPS, ...SAND_PROPS, ...WATER_PROPS,
  ]

  return (
    <FloatingTraySection
      title={t('map_theme_configurator.title')}
      borderBottom={false}
    >
      {presetOptions.length > 1 &&
        <RowSelectField
          label={t('map_configurator.preset.label')}
          id='preset'
          value={selectedPreset}
          placeholder={t('map_configurator.preset.option.custom')}
          options={presetOptions}
          onChange={setTheme}
        />
      }
      {LAYER_PROPS.map((prop) => {
        if (prop.includes(COLOR_SUFFIX)) {
          return mapTheme[prop] !== undefined && <RowColorField
            key={prop}
            label={t(getLabel(prop))}
            id={prop}
            value={mapTheme[prop] as string}
            onChange={color => updateTheme(prop, color)}
            onDelete={() => removeThemeProperty(prop)}
          />
        } else if (prop.includes(OPACITY_SUFFIX)) {
          return mapTheme[prop] !== undefined && <RowNumberField
            key={prop}
            label={t(getLabel(prop))}
            id={prop}
            value={mapTheme[prop] as number}
            onChange={opacity => updateTheme(prop, opacity)}
            onDelete={() => removeThemeProperty(prop)}
            step={0.002}
            min={0}
            max={1}
          />
        } else if (prop.includes(SIZE_SUFFIX)) {
          return mapTheme[prop] !== undefined && <RowNumberField
            key={prop}
            label={t(getLabel(prop))}
            id={prop}
            value={mapTheme[prop] as number}
            onChange={size => updateTheme(prop, size)}
            onDelete={() => removeThemeProperty(prop)}
            step={Math.max(0.01 * (mapTheme[prop] as number), 0.01)}
            min={0}
          />
        } else if (prop.includes(OFFSET_SUFFIX)) {
          return mapTheme[prop] !== undefined && <RowNumberField
            key={prop}
            label={t(getLabel(prop))}
            id={prop}
            value={mapTheme[prop] as number}
            onChange={base => updateTheme(prop, base)}
            onDelete={() => removeThemeProperty(prop)}
            step={0.002}
          />
        } else if (prop.includes(VISIBILITY_SUFFIX)) {
          return mapTheme[prop] !== undefined && <RowBooleanField
            key={prop}
            label={t(getLabel(prop))}
            id={prop}
            checked={mapTheme[prop] as boolean}
            onChange={e => updateTheme(prop, e.target.checked)}
            onDelete={() => removeThemeProperty(prop)}
          />
        }
        return null
      })}
      <MapPropertySelector
        onSelect={prop => updateTheme(prop as keyof MapTheme, MAP_THEME_DEFAULTS[prop])}
        theme={mapTheme}
      />
    </FloatingTraySection>
  )
}

export {
  MapThemeConfigurator,
}
