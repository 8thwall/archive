import React from 'react'
import {useTranslation} from 'react-i18next'

import type {ModuleConfigField, ModuleConfigFieldPatch} from '../../../shared/module/module-config'
import {StringFieldBuilder} from './string-field-builder'
import {BooleanFieldBuilder} from './boolean-field-builder'
import {ResourceFieldBuilder} from './resource-field-builder'
import {NumberFieldBuilder} from './number-field-builder'

interface IFieldBuilder {
  fieldName: string
  field: ModuleConfigField
  onUpdate: (e: ModuleConfigFieldPatch) => void
}

const FieldBuilder: React.FC<IFieldBuilder> = ({fieldName, field, onUpdate}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  switch (field?.type) {
    case 'string': {
      return (
        <StringFieldBuilder
          field={field}
          onUpdate={onUpdate}
        />
      )
    }
    case 'boolean': {
      return (
        <BooleanFieldBuilder
          field={field}
          onUpdate={onUpdate}
        />
      )
    }
    case 'resource': {
      return (
        <ResourceFieldBuilder
          field={field}
          onUpdate={onUpdate}
        />
      )
    }
    case 'number': {
      return (
        <NumberFieldBuilder
          field={field}
          onUpdate={onUpdate}
        />
      )
    }
    // TODO(christoph): Add more types
    default:
      return <p>{t('module_config.field_builder.invalid_field', {fieldName})}</p>
  }
}

export {
  FieldBuilder,
}
