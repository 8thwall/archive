import React from 'react'

import type {IBrowseModule} from '../../common/types/models'
import {deriveModuleCoverImageUrl} from '../../../shared/module-cover-image'
import {LoadingImage} from '../../uiWidgets/loading-image'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  moduleImportItemPreview: {
    'width': '100%',
    'gridArea': 'image',
    'position': 'relative',
    '&:hover $description': {
      'opacity': '1',
    },
    '&:hover $image': {
      'opacity': '0',
    },
  },
  image: {
    'width': '100%',
    'border-radius': '.5rem',
  },
  description: {
    'position': 'absolute',
    'top': '0',
    'padding': '1rem',
    'width': '100%',
    'height': '100%',
    'overflow': 'hidden',
    'cursor': 'grab',
    'opacity': '0',
    'transition': '.5s ease',
    'border-radius': '.5rem',
    'color': theme.fgMain,
    'background': theme.descriptionBackground,
  },
}))

interface IPreviewImage {
  module: IBrowseModule
}

const ModuleImportItemPreview: React.FC<IPreviewImage> = ({module}) => {
  const thumbnailSrc = deriveModuleCoverImageUrl(module)
  const classes = useStyles()

  return (
    <div className={classes.moduleImportItemPreview}>
      <LoadingImage src={thumbnailSrc} alt={`${module.name}`} className={classes.image} />
      <p className={classes.description}>{module.description}</p>
    </div>
  )
}

export {ModuleImportItemPreview}
