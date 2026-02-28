import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import {useTranslation} from 'react-i18next'
import type {Location} from '@ecs/shared/scene-graph'

import {ComponentConfiguratorTray} from './component-configurator-tray'
import {RowTextField} from './row-fields'
import {StudioLocationDetails} from '../gsb/studio-location-details'
import {useSelector} from '../../hooks'
import {LOCATION_COMPONENT} from './direct-property-components'

interface ILocationConfigurator {
  location: DeepReadonly<Location>
  onChange: (updater: (newLocation: Location) => Location) => void
}

const LocationConfigurator: React.FC<ILocationConfigurator> = (
  {location, onChange}
) => {
  const {t} = useTranslation(['cloud-studio-pages'])
  const poi = useSelector(s => s.vps.pois[location.poiId])

  return (
    <ComponentConfiguratorTray
      title={t('location_configurator.title')}
      description={t('location_configurator.description')}
      sectionId='location'
      componentData={[LOCATION_COMPONENT]}
    >
      {BuildIf.LOCAL &&
        <>
          <RowTextField
            id='poi-id'
            // eslint-disable-next-line local-rules/hardcoded-copy
            label='POI ID'
            value={location.poiId}
            onChange={e => onChange(o => ({
              ...o,
              poiId: e.target.value,
            }))}
          />
          <RowTextField
            id='node-id'
            // eslint-disable-next-line local-rules/hardcoded-copy
            label='NODE ID'
            value={location.anchorNodeId ?? ''}
            onChange={e => onChange(o => ({
              ...o,
              anchorNodeId: e.target.value,
            }))}
          />
        </>
        }
      {poi && <StudioLocationDetails poi={poi} location={location} onChange={onChange} />}
    </ComponentConfiguratorTray>
  )
}

export {
  LocationConfigurator,
}
