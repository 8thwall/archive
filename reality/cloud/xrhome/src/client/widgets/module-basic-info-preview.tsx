import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/app-constants'
import {
  bodySanSerif, headerSanSerif, tinyViewOverride,
  gray4, moonlight, gray5,
} from '../static/styles/settings'
import type {IPublicAccount, IPublicModule} from '../common/types/models'
import {deriveModuleCoverImageUrl} from '../../shared/module-cover-image'
import {useModuleCompatibilityToString} from '../modules/use-module-compatibility-to-string'
import AutoHeadingScope from './auto-heading-scope'
import AutoHeading from './auto-heading'

const useStyles = createUseStyles({
  rootContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: '1em',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  coverImage: {
    borderRadius: '0.5em !important',
    width: '20rem',
    height: 'auto',
    textAlign: 'center',
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  moduleInfo: {
    'flex': '1',
    'display': 'flex',
    'alignItems': 'flex-start',
    'flexWrap': 'wrap',
    'flexDirection': 'column',
    'padding': '0 0 0 1em !important',
    'alignSelf': 'stretch',
    'justifyContent': 'space-between',

    '& h3': {
      fontFamily: headerSanSerif,
      margin: '0em 0em 0.5em 0em',
    },

    '& p': {
      fontFamily: bodySanSerif,
    },
    [tinyViewOverride]: {
      padding: '1em 0 0 0 !important',
    },
  },
  moduleInfoBoxes: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5em',
    width: '100%',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  moduleInfoBox: {
    width: '14rem',
    display: 'flex',
    flexDirection: 'column',
    background: moonlight,
    padding: '0.7em 1.34em',
    borderRadius: '0.2em',
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  moduleInfoLabel: {
    color: gray4,
    margin: '0',
  },
  moduleInfoText: {
    width: '100%',
    fontWeight: 'bold',
    color: gray5,
    margin: '0',
    overflow: 'hidden',
    whiteSpace: 'no-wrap',
    textOverflow: 'ellipsis',
  },
  moduleAliasText: {
    fontWeight: 'lighter',
    color: gray4,
    marginTop: '0',
  },
  moduleTitleText: {
    margin: '0 !important',
  },
})

interface IModuleBasicInfoPreview {
  account: IPublicAccount
  module: IPublicModule
}

const ModuleBasicInfoPreview: React.FC<IModuleBasicInfoPreview> = ({account, module}) => {
  const {t} = useTranslation(['module-pages'])
  const moduleCompatibilityToString = useModuleCompatibilityToString()
  const classes = useStyles()

  return (
    <div className={classes.rootContainer}>
      <AutoHeadingScope>
        <img
          src={deriveModuleCoverImageUrl(module, COVER_IMAGE_PREVIEW_SIZES[600])}
          className={classes.coverImage}
          alt='Cover for the app'
        />
        <div className={classes.moduleInfo}>
          <div>
            <AutoHeading className={classes.moduleTitleText}>{module.title}</AutoHeading>
            <p className={classes.moduleAliasText}>
              <i>
                {t('import_module_page.module_basic_info_preview.label.alias')} {module.name}
              </i>
            </p>
          </div>
          <div className={classes.moduleInfoBoxes}>
            <div className={classes.moduleInfoBox}>
              <p className={classes.moduleInfoLabel}>
                {t('import_module_page.module_basic_info_preview.label.workspace')}
              </p>
              <p className={classes.moduleInfoText}>{account?.name}</p>
            </div>
            {module.compatibility !== 'ANY' &&
              <div className={classes.moduleInfoBox}>
                <p className={classes.moduleInfoLabel}>
                  {t('import_module_page.module_basic_info_preview.label.compatibility')}
                </p>
                <p className={classes.moduleInfoText}>
                  {moduleCompatibilityToString[module.compatibility]}
                </p>
              </div>
          }
          </div>
        </div>
      </AutoHeadingScope>
    </div>
  )
}

export default ModuleBasicInfoPreview
