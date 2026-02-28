import React from 'react'

import {MarkdownTextarea} from './markdown-textarea'
import {useModuleVersionModalStyles} from './module-version-modal-styles'

interface IVersionDescriptionField {
  value: string
  onChange: (newValue: string) => void
}

const VersionDescriptionField: React.FC<IVersionDescriptionField> = ({value, onChange}) => {
  const classes = useModuleVersionModalStyles()

  return (
    <MarkdownTextarea
      id='version-description-input'
      maxLength={1000}
      rows={4}
      cols={80}
      showCharCount
      label={<span className={classes.required}>Release Notes</span>}
      placeholder='Describe this release...'
      value={value}
      setValue={onChange}
    />
  )
}

export {
  VersionDescriptionField,
}
