import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import {
  DEFAULT_LAT, DEFAULT_LNG, LAT_LNG_SLIDER_FACTOR, MAX_LAT, MAX_LNG, MIN_LAT,
  MIN_LNG,
} from '@ecs/shared/map-constants'

import {RowNumberField, useStyles as useRowFieldStyles} from './row-fields'
import type {SubMenuCategory, SubMenuItem} from '../ui/submenu'
import {StandardFieldLabel} from '../../ui/components/standard-field-label'
import {SubMenuSelectWithSearch} from '../ui/submenu-select-with-search'
import {combine} from '../../common/styles'
import {useDerivedScene} from '../derived-scene-context'

const useStyles = createUseStyles({
  selectContainer: {
    flex: 1,
    fontSize: '12px',
  },
})

interface ILatLongSelector {
  lat: number
  lng: number
  id: string
  onChange: (lat: number, lng: number, id: string) => void
  radius: number
  showMapPoints?: boolean
}

const LatLongSelector: React.FC<ILatLongSelector> = ({
  lat, lng, id, onChange, radius, showMapPoints = false,
}) => {
  const {t} = useTranslation(['cloud-studio-pages'])
  const classes = useStyles()
  const rowFieldStyles = useRowFieldStyles()
  const derivedScene = useDerivedScene()
  const object = derivedScene.getObject(id)
  const objects = derivedScene.getAllSceneObjects()

  const locationOptions: SubMenuItem[] = Object.values(objects)
    .filter(obj => !!obj.location)
    .map(obj => ({
      value: obj.id,
      content: obj.name,
    }))

  const mapPointOptions: SubMenuItem[] = Object.values(objects)
    .filter(obj => !!obj.mapPoint)
    .map(obj => ({
      value: obj.id,
      content: obj.name,
    }))

  const categories: SubMenuCategory[] = [
    {
      value: null,
      parent: null,
      options: [
        {value: 'latlng', content: t('map_point_configurator.location.option.lat_long')},
      ],
    },
    {
      value: 'map_point_configurator.location.option.location',
      parent: null,
      options: locationOptions,
    },
    showMapPoints && {
      value: 'map_point_configurator.location.option.map_point',
      parent: null,
      options: mapPointOptions,
    },
  ].filter(Boolean)

  const onSelect = (value: string) => {
    const {location, mapPoint} = derivedScene.getObject(value) ?? {}
    if (value === 'latlng') {
      onChange(lat, lng, undefined)
    } else if (location) {
      onChange(location.lat, location.lng, value)
    } else if (mapPoint) {
      onChange(mapPoint.latitude, mapPoint.longitude, value)
    }
  }

  const selected = object?.name ?? t('map_point_configurator.location.option.lat_long')

  return (
    <>
      {!!(locationOptions.length || mapPointOptions.length) &&
        <div className={rowFieldStyles.row}>
          <div className={rowFieldStyles.flexItem}>
            <StandardFieldLabel
              label={t('map_point_configurator.location.label')}
              mutedColor
            />
          </div>
          <div className={classes.selectContainer}>
            <SubMenuSelectWithSearch
              categories={categories}
              onChange={onSelect}
              trigger={(
                <button
                  className={combine('style-reset', rowFieldStyles.select,
                    rowFieldStyles.preventOverflow)}
                  type='button'
                >
                  <div className={rowFieldStyles.selectText}>
                    {selected}
                  </div>
                  <div className={rowFieldStyles.chevron} />
                </button>
              )}
            />
          </div>
        </div>
      }
      {!object &&
        <>
          <RowNumberField
            id='lat'
            label={t('map_point_configurator.latitude.label')}
            value={lat ?? DEFAULT_LAT}
            onChange={newLat => onChange(newLat, lng, undefined)}
            step={LAT_LNG_SLIDER_FACTOR * radius}
            max={MAX_LAT}
            min={MIN_LAT}
            fixed={5}
          />
          <RowNumberField
            id='lng'
            label={t('map_point_configurator.longitude.label')}
            value={lng ?? DEFAULT_LNG}
            onChange={newLng => onChange(lat, newLng, undefined)}
            step={LAT_LNG_SLIDER_FACTOR * radius}
            max={MAX_LNG}
            min={MIN_LNG}
            fixed={5}
          />
        </>
    }
    </>
  )
}

export {
  LatLongSelector,
}
