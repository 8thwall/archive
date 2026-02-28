import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import type {GraphObject} from '@ecs/shared/scene-graph'
import {useTranslation} from 'react-i18next'

import {RowBooleanField, RowSelectField} from './row-fields'
import {useGltfWithDraco} from '../hooks/gltf'
import {useResourceUrl} from '../hooks/resource-url'

interface IGpsPointer {
  faceGpsDirection: boolean
  idleClip: string
  walkClip: string
  runClip: string
  driveClip: string
}

type ClipProp = keyof Pick<IGpsPointer,
  'idleClip' | 'walkClip' | 'runClip' | 'driveClip'
>

interface IGpsPointerConfigurator {
  object: DeepReadonly<GraphObject>
  values: DeepReadonly<IGpsPointer>
  onChange: (callback: (oldValues: DeepReadonly<IGpsPointer>) => DeepReadonly<IGpsPointer>) => void
}

const GpsPointerConfigurator: React.FC<IGpsPointerConfigurator> = ({
  object, values, onChange,
}) => {
  const {t} = useTranslation('cloud-studio-pages')
  const gltfModelSrcUrl = useResourceUrl(object.gltfModel?.src)
  const gltf = useGltfWithDraco(gltfModelSrcUrl)
  const clipOptions = gltf?.animations?.map(clip => ({value: clip.name, content: clip.name})) ?? []

  const renderSpeedGroup = (clipProp: ClipProp, clipLabel: string) => (
    <RowSelectField
      id={clipProp}
      label={t(`gps_pointer_configurator.${clipLabel}.label`)}
      value={values[clipProp] ?? ''}
      options={clipOptions}
      placeholder={t('gps_pointer_configurator.clips.placeholder')}
      onChange={v => onChange(old => ({...old, [clipProp]: v}))}
    />
  )

  return (
    <>
      <RowBooleanField
        id='faceGpsDirection'
        label={t('gps_pointer_configurator.face_gps_direction.label')}
        checked={values.faceGpsDirection}
        onChange={e => onChange(old => ({...old, faceGpsDirection: e.target.checked}))}
      />
      {clipOptions.length > 0 &&
        <>
          {renderSpeedGroup('idleClip', 'idle_clip')}
          {renderSpeedGroup('walkClip', 'walk_clip')}
          {renderSpeedGroup('runClip', 'run_clip')}
          {renderSpeedGroup('driveClip', 'drive_clip')}
        </>
      }
    </>
  )
}

export {
  GpsPointerConfigurator,
}
