import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import {useTranslation} from 'react-i18next'

import type {DependencyConflictDetails} from '../../dependency-conflicts'
import type {ModuleDependency} from '../../../../shared/module/module-dependency'
import {ConflictDisplay} from './conflict-display'
import type {
  GatewayDefinition, ParameterValue, SlotParameter,
} from '../../../../shared/gateway/gateway-types'
import {parameterValueEqual} from '../../../../shared/gateway/compare-parameter-value'
import {getSecretDisplayText} from '../../../../shared/gateway/get-secret-display-text'

const SlotValueDisplay: React.FC<{value: ParameterValue}> = ({value}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  if (!value) {
    return <div>{t('sync_modal.slot_value.unset')}</div>
  }
  switch (value.type) {
    case 'literal':
      return <div>{JSON.stringify(value.value)}</div>
    case 'secret':
      return <div>{getSecretDisplayText(value)}</div>
    default:
      return <div>{t('sync_modal.slot_value.unknown')}</div>
  }
}

const matchesSlot = (slotId: string, value: ParameterValue): value is SlotParameter => {
  if (value.type === 'secretslot' || value.type === 'literalslot') {
    if (value.slotId === slotId) {
      return true
    }
  }
  return false
}

const findSlot = (slotId: string, template: DeepReadonly<GatewayDefinition>): SlotParameter => {
  // eslint-disable-next-line no-restricted-syntax
  for (const header of Object.values(template.headers)) {
    if (matchesSlot(slotId, header)) {
      return header
    }
  }

  if (template.type !== 'function') {
  // eslint-disable-next-line no-restricted-syntax
    for (const route of Object.values(template.routes)) {
    // eslint-disable-next-line no-restricted-syntax
      for (const header of Object.values(route.headers)) {
        if (matchesSlot(slotId, header)) {
          return header
        }
      }
    }
  }

  return null
}

const findSlotDefinition = (slotId: string, dependency: DeepReadonly<ModuleDependency>) => {
  if (dependency.backendTemplates) {
    // eslint-disable-next-line no-restricted-syntax
    for (const template of dependency.backendTemplates) {
      const foundHeader = findSlot(slotId, template)
      if (foundHeader) {
        return foundHeader
      }
    }
  }
  return null
}

interface IConflictedSlotValueDetail {
  details: DeepReadonly<DependencyConflictDetails>
  slotId: string  // the particular slot we are interested in
  resolveValueConflict: (slotId: string, value: ParameterValue) => void
}

const ConflictedSlotValueDetail: React.FC<IConflictedSlotValueDetail> = ({
  details,
  slotId,
  resolveValueConflict,
}) => {
  const {t} = useTranslation(['cloud-editor-pages'])

  const configValueDetail = details.conflictedBackendSlotValues[slotId]
  const mySelected = typeof configValueDetail.resolution !== 'symbol' && parameterValueEqual(
    configValueDetail.resolution,
    configValueDetail.mine
  )
  const theirSelected = typeof configValueDetail.resolution !== 'symbol' && parameterValueEqual(
    configValueDetail.resolution,
    configValueDetail.theirs
  )

  const slotDefinition = (
    findSlotDefinition(slotId, details.mine) ||
    findSlotDefinition(slotId, details.theirs)
  )

  const label = slotDefinition?.label || t('sync_modal.slot_value.unknown_label')

  return (
    <ConflictDisplay
      baseButtonId={`config-merge-${slotId}`}
      title={label}
      leftChecked={mySelected}
      rightChecked={theirSelected}
      onSelectLeft={() => resolveValueConflict(slotId, configValueDetail.mine)}
      onSelectRight={() => resolveValueConflict(slotId, configValueDetail.theirs)}
      left={<SlotValueDisplay value={configValueDetail.mine} />}
      right={<SlotValueDisplay value={configValueDetail.theirs} />}
    />
  )
}

export {
  ConflictedSlotValueDetail,
}
