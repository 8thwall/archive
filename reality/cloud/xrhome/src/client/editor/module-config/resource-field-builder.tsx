import React from 'react'
import {useTranslation} from 'react-i18next'

import type {
  ModuleConfigFieldPatch, ResourceConfigField,
} from '../../../shared/module/module-config'
import {ResourceExtensionInputBuilder} from './resource-extension-input-builder'
import {ResourceDefaultFieldBuilder} from './resource-default-field-builder'
import {FieldBuilderLabel} from './field-builder-label'
import {createThemedStyles} from '../../ui/theme'
import {useId} from '../../hooks/use-id'

const useStyles = createThemedStyles({
  sectionHeader: {
    margin: '2rem 0rem 1rem 0rem',
    fontWeight: '700',
  },
})

interface IResourceFieldBuilder {
  field: ResourceConfigField
  onUpdate: (update: ModuleConfigFieldPatch) => void
}

const ResourceFieldBuilder: React.FC<IResourceFieldBuilder> = ({field, onUpdate}) => {
  const idBase = `config-builder-${field.fieldName}-${useId()}-`
  const defaultId = `${idBase}default`
  const extensionId = `${idBase}default`
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <>
      <FieldBuilderLabel field={field} onUpdate={onUpdate} />
      <ResourceExtensionInputBuilder
        id={extensionId}
        value={field.extensions}
        onUpdate={onUpdate}
      />
      <ResourceDefaultFieldBuilder
        id={defaultId}
        value={field.default}
        allowedExtensions={field.extensions}
        defaultLabel={field.labelForDefault}
        modifiedLabel={field.modifiedLabel}
        onUpdate={onUpdate}
      >
        <div className={classes.sectionHeader}>
          {t('module_config.resource_field_builder.default_resource')}
        </div>
      </ResourceDefaultFieldBuilder>
    </>
  )
}

export {
  ResourceFieldBuilder,
}
