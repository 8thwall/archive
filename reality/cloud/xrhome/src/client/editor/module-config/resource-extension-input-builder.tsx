import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {ModuleConfigFieldPatch} from '../../../shared/module/module-config'
import {FILE_KIND} from '../../common/editor-files'
import {smallMonitorViewOverride} from '../../static/styles/settings'
import {StandardCheckboxField} from '../../ui/components/standard-checkbox-field'
import {StandardInlineToggleField} from '../../ui/components/standard-inline-toggle-field'
import {Tag} from '../../ui/components/tag'

interface IExtensionInput {
  value: string[]
  id: string
  onUpdate: (update: ModuleConfigFieldPatch) => void
  children?: React.ReactNode
}

const useStyles = createUseStyles({
  extensionInput: {
    'display': 'none',
  },
  buttonContainer: {
    margin: '0.5rem 0rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  checkboxContainer: {
    display: 'flex',
    gap: '1rem',
    [smallMonitorViewOverride]: {
      flexDirection: 'column',
    },
  },
  restrictToggle: {
    fontWeight: 700,
    margin: '1rem 0rem',
  },
})

// TODO (Tri) - swap this out for final file version
const FILE_CATEGORIES = {
  'image': FILE_KIND.image,
  'video': FILE_KIND.video,
  'audio': FILE_KIND.audio,
  '3d_model': FILE_KIND.model,
  'volumetric_video': FILE_KIND.hologram,
  'font': FILE_KIND.font,
  'web_files': [].concat(
    FILE_KIND.js, FILE_KIND.json, FILE_KIND.md, FILE_KIND.react, FILE_KIND.txt, FILE_KIND.html,
    FILE_KIND.css
  ),
}

const ResourceExtensionInputBuilder: React.FC<IExtensionInput> = ({
  value, id, onUpdate, children,
}) => {
  const currentExtensions = value || []
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const [showExts, setShowExts] = React.useState(currentExtensions.length !== 0)

  const filterExtensions = (extFilter: (ext: string) => boolean) => {
    const newExts = currentExtensions.filter(extFilter)
    if (newExts.length === 0) {
      onUpdate({extensions: undefined})
    } else {
      onUpdate({extensions: newExts})
    }
  }

  const onFileTypeButtonClick = (ext: string) => {
    filterExtensions(e => e !== ext)
  }

  const onCategoryCheckboxChange = (checked: boolean, cat: string) => {
    const catExts = FILE_CATEGORIES[cat]
    if (checked) {  // Add extensions to list
      onUpdate({
        extensions: [...currentExtensions,
          ...catExts.filter(ext => !currentExtensions.includes(ext))],
      })
    } else {  // Delete extensions from list
      filterExtensions(ext => !catExts.includes(ext))
    }
  }

  const onRestrictFileTypeChange = (checked: boolean) => {
    if (checked) {
      setShowExts(true)
    } else {
      onUpdate({extensions: undefined})
      setShowExts(false)
    }
  }

  return (
    <div>
      {children}
      <div className={classes.restrictToggle}>
        <StandardInlineToggleField
          id={`${id}-restrict`}
          label={t('module_config.resource_extension_input_builder.restrict')}
          checked={showExts}
          onChange={onRestrictFileTypeChange}
        />
      </div>
      {(showExts || currentExtensions.length !== 0) && (
        <>
          <div className={classes.checkboxContainer}>
            {Object.keys(FILE_CATEGORIES).map(cat => (
              <StandardCheckboxField
                key={cat}
                id={`${id}-${cat}`}
                label={t(`module_config.resource_extension_input_builder.file_category.${cat}`)}
                checked={currentExtensions.some(ext => FILE_CATEGORIES[cat].includes(ext))}
                onChange={(e) => { onCategoryCheckboxChange(e.target.checked, cat) }}
              />
            ))}
            <label htmlFor={id}>
              <input  // NOTE(johnny): This input is used to hold information in the html.
                id={id}
                type='hidden'
                value={currentExtensions ? currentExtensions.join(', ') : ''}
                className={classes.extensionInput}
              />
            </label>
          </div>
          <div className={classes.buttonContainer}>
            {currentExtensions && currentExtensions.map(file => (
              <Tag
                key={file}
                height='tiny'
                dismissible
                onClick={() => onFileTypeButtonClick(file)}
              >
                {file}
              </Tag>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export {
  ResourceExtensionInputBuilder,
}
