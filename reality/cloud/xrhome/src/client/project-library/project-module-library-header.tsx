import React from 'react'
import {useTranslation} from 'react-i18next'

import {SpaceBetween} from '../ui/layout/space-between'
import {useLibraryStyles} from './library-styles'
import Icons from '../apps/icons'
import {ProjectModuleLibraryLinks} from './project-module-library-links'

const ProjectModuleLibraryHeader: React.FC = () => {
  const classes = useLibraryStyles()
  const {t} = useTranslation(['public-featured-pages'])

  return (
    <SpaceBetween direction='vertical' wide centered>
      <div className={classes.header}>
        <div className={classes.imgWrapper}>
          <img
            src={Icons.codeHubRocket}
            alt=''
            width='20px'
            height='20px'
          />
        </div>
        <h1 className={classes.headerTitle}>{t('project_module_library_header.header')}</h1>
      </div>
      <p className={classes.headerBlurb}>{t('project_module_library_header.blurb')}</p>
      <ProjectModuleLibraryLinks />
    </SpaceBetween>
  )
}

export {
  ProjectModuleLibraryHeader,
}
