import {basename} from 'path'
import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {ResourceConfigValue} from '../../../shared/module/module-dependency'
import type {
  ModuleConfigFieldPatch, ResourceConfigField,
} from '../../../shared/module/module-config'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {isAllowedExtensions, isAssetPath, isFolderPath} from '../../common/editor-files'
import {StandardRadioButton} from '../../ui/components/standard-radio-group'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {StandardSelectField} from '../../ui/components/standard-select-field'
import {tinyViewOverride} from '../../static/styles/settings'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    maxWidth: '300px',
    flexDirection: 'column',
    gap: '1rem',
  },
  comboRow: {
    'display': 'grid',
    'gridTemplateColumns': '5em 1fr',
    'gap': '1rem',
    [tinyViewOverride]: {
      'display': 'flex',
      'flexDirection': 'column',
    },
  },
})

interface IResourceDefaultFieldBuilder {
  id: string
  value: ResourceConfigField['default']
  allowedExtensions: string[]
  defaultLabel: string
  modifiedLabel: boolean
  onUpdate: (update: ModuleConfigFieldPatch) => void
  children?: React.ReactNode
}

const ResourceDefaultFieldBuilder: React.FC<IResourceDefaultFieldBuilder> = ({
  id, value, children, defaultLabel, modifiedLabel, onUpdate, allowedExtensions,
}) => {
  const nonId = `${id}-nontype`
  const urlId = `${id}-url`
  const assetId = `${id}-asset`
  const defaultLabelId = `${id}-labelForDefault`
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  const {type} = value || {}

  const updateValue = (newValue: ResourceConfigValue, newLabel = '') => {
    if (modifiedLabel) {
      onUpdate({default: newValue})
    } else {
      onUpdate({default: newValue, labelForDefault: newLabel})
    }
  }

  const onTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value as ResourceConfigValue['type'] | 'none') {
      case 'none':
        updateValue(undefined)
        break
      case 'asset':
        updateValue({type: 'asset', asset: null})
        break
      case 'url':
        updateValue({type: 'url', url: ''})
        break
      default:
        // eslint-disable-next-line no-console
        console.error(`Unexpected type selected in default builder: ${e.target.value}`)
        break
    }
  }

  const onAssetChange = (e) => {
    updateValue({type: 'asset', asset: e.target.value}, basename(e.target.value))
    e.preventDefault()
  }

  const onUrlChange = (e) => {
    updateValue({type: 'url', url: e.target.value}, e.target.value)
    e.preventDefault()
  }

  const {filePaths} = useCurrentGit()
  const filterPath = (path: string) => (
    isAssetPath(path) &&
    !isFolderPath(path) &&
    isAllowedExtensions(path, allowedExtensions)
  )
  const assetPaths = filePaths.filter(filterPath)

  React.useEffect(() => {
    if (value?.type === 'asset' && !isAllowedExtensions(value.asset, allowedExtensions)) {
      onUpdate({default: undefined})
    }
  }, [allowedExtensions])

  return (
    <div>
      {children}
      <div className={classes.container}>
        <StandardTextField
          id={defaultLabelId}
          value={defaultLabel || ''}
          label={null}
          placeholder={t('module_config.resource_default_field_builder.label_default')}
          height='tiny'
          type='text'
          onChange={e => onUpdate({labelForDefault: e.target.value, modifiedLabel: true})}
        />
        <div className={classes.comboRow}>
          <StandardRadioButton
            id={urlId}
            type='radio'
            value='url'
            checked={type === 'url'}
            onChange={onTypeChange}
            label='URL'
          />
          <StandardTextField
            id={`${urlId}-value`}
            type='text'
            label={null}
            aria-label={t('module_config.resource_default_field_builder.enter_url')}
            width='fill'
            height='tiny'
            name='url'
            value={(value?.type === 'url' && value.url) || ''}
            onChange={onUrlChange}
          />
        </div>
        <div className={classes.comboRow}>
          <StandardRadioButton
            id={assetId}
            type='radio'
            value='asset'
            checked={type === 'asset'}
            onChange={onTypeChange}
            label={t('module_config.resource_default_field_builder.asset')}
          />
          <StandardSelectField
            name='asset'
            label={null}
            aria-label={t('module_config.resource_default_field_builder.choose_asset')}
            height='tiny'
            id={`${assetId}-value`}
            disabled={!assetPaths.length}
            value={(value?.type === 'asset' && value.asset) || ''}
            onChange={onAssetChange}
          >
            <option key='none' value=''>
              {t('module_config.resource_default_field_builder.none')}
            </option>
            {assetPaths.map(path => (
              <option key={path} value={path}>{basename(path)}</option>
            ))}
          </StandardSelectField>
        </div>
        <StandardRadioButton
          id={nonId}
          type='radio'
          value='none'
          checked={!value}
          onChange={onTypeChange}
          label={t('module_config.resource_default_field_builder.no_explicit_default')}
        />
      </div>
    </div>
  )
}

export {ResourceDefaultFieldBuilder}
