import React from 'react'
import {basename} from 'path'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {ResourceConfigField} from '../../../shared/module/module-config'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {isAllowedExtensions, isAssetPath, isFolderPath} from '../../common/editor-files'
import {StandardRadioGroup, StandardRadioButton} from '../../ui/components/standard-radio-group'
import {StandardSelectField} from '../../ui/components/standard-select-field'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {combine} from '../../common/styles'
import {useCurrentRepoId} from '../../git/repo-id-context'

interface IResourceFieldInput {
  field: ResourceConfigField
  value: ResourceConfigField['default']
  onChange: (newValue: ResourceConfigField['default']) => void
  onReset: () => void
}

const useStyles = createUseStyles({
  option: {
    '&:not(:last-child)': {
      'marginBottom': '0.75rem',
    },
  },
  comboRow: {
    'display': 'grid',
    'gridTemplateColumns': '5em 1fr',
    'gap': '1rem',
  },
})

const ResourceFieldInput: React.FC<IResourceFieldInput> = ({field, value, onChange, onReset}) => {
  const defaultId = `module-input-${field.fieldName}-default`
  const urlId = `module-input-${field.fieldName}-url`
  const assetId = `module-input-${field.fieldName}-asset`
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const {type} = value || {}
  const {extensions: allowedExtensions} = field

  const onTypeChange = (e) => {
    switch (e.target.value) {
      case 'none':
        onChange(null)
        break
      case 'default':
        onReset()
        break
      case 'url':
        onChange({type: 'url', url: null})
        break
      case 'asset':
        onChange({type: 'asset', asset: null})
        break
      default:
        throw new Error('unknown type')
    }
  }

  // TODO (tri) enforce file type requirements for resource field
  const onUrlChange = (e) => {
    onChange({type: 'url', url: e.target.value})
  }

  const onAssetChange = (e) => {
    onChange({type: 'asset', asset: e.target.value})
  }

  // NOTE(christoph): If we're not in a repo, we're in the self-hosted view where assets aren't
  // available
  const isAssetAvailable = !!useCurrentRepoId()

  const {filePaths} = useCurrentGit()
  const filterPath = (path: string) => (
    isAssetPath(path) &&
    !isFolderPath(path) &&
    isAllowedExtensions(path, allowedExtensions)
  )
  const assetPaths = filePaths.filter(filterPath)

  React.useEffect(() => {
    if (value?.type === 'asset' && !isAllowedExtensions(value.asset, allowedExtensions)) {
      onChange(null)
    }
  }, [allowedExtensions])

  const defaultLabel = field.labelForDefault
    ? t('module_config.resource_field_input.default_field_label', {
      fieldDefaultLabel: field.labelForDefault,
    })
    : t('module_config.resource_field_input.default_label')

  return (
    <StandardRadioGroup
      label={field.label || field.fieldName}
      boldLabel
    >
      {(field.extensions?.length > 0) &&
        <p>
          {t('module_config.resource_field_input.accepted_extensions')}<br />
          [{field.extensions.join(', ')}]
        </p>
      }
      <div className={classes.option}>
        <StandardRadioButton
          id={defaultId}
          value='default'
          checked={typeof value === 'undefined'}
          onChange={onTypeChange}
          label={defaultLabel}
        />
      </div>
      <div className={combine(classes.option, classes.comboRow)}>
        <StandardRadioButton
          id={urlId}
          label='URL'
          checked={value?.type === 'url'}
          onChange={onTypeChange}
          value='url'
        />
        <StandardTextField
          id={`${urlId}-value`}
          label={null}
          aria-label={t('module_config.resource_field_input.enter_url')}
          value={(value?.type === 'url' && value.url) || ''}
          onChange={onUrlChange}
          height='tiny'
        />
      </div>
      {isAssetAvailable &&
        <div className={combine(classes.option, classes.comboRow)}>
          <StandardRadioButton
            id={assetId}
            value='asset'
            checked={type === 'asset'}
            onChange={onTypeChange}
            label={t('module_config.resource_field_input.asset')}
          />
          <StandardSelectField
            id={`${assetId}-value`}
            disabled={!assetPaths.length}
            value={(value?.type === 'asset' && value.asset) || ''}
            onChange={onAssetChange}
            label={null}
            aria-label={t('module_config.resource_field_input.choose_asset')}
            height='tiny'
          >
            <option key='none' value=''>{t('module_config.resource_field_input.none')}</option>
            {assetPaths.map(path => (
              <option key={path} value={path}>{basename(path)}</option>
            ))}
          </StandardSelectField>
        </div>
      }
    </StandardRadioGroup>
  )
}

export {
  ResourceFieldInput,
}
