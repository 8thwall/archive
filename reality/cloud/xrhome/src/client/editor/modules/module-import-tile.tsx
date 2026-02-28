import React from 'react'

import icons from '../../apps/icons'
import type {IBrowseModule} from '../../common/types/models'
import {ModuleImportItemPreview} from './module-import-item-preview'
import {createThemedStyles} from '../../ui/theme'
import {getDisplayNameForModule} from '../../../shared/module/module-display-name'
import {responsiveAccountIcons} from '../../../shared/responsive-account-icons'
import ResponsiveImage from '../../common/responsive-image'
import * as settings from '../../static/styles/settings'
import {is8thWallAccountUuid, isPartner} from '../../../shared/account-utils'
import {CheckedCertificateIcon} from '../../browse/public-icons'

const useStyles = createThemedStyles(theme => ({
  icon: {
    'gridArea': 'icon',
    'display': 'flex',
    'justify-content': 'flex-end',
    'alignSelf': 'flex-end',
  },
  moduleName: {
    'font-size': '14px',
    'color': theme.fgMain,
    'font-weight': 'bold',
  },
  accountName: {
    fontSize: '12px',
    color: theme.fgMuted,
    display: 'flex',
    gap: '4px',
  },
  content: {
    display: 'flex',
    gap: '8px',
  },
  accountIcon: {
    'objectFit': 'cover',
    'border': '1px solid',
    'borderRadius': '50%',
    'borderColor': settings.gray2,
    'height': '32px',
  },
  textContainer: {
    'display': 'flex',
    'flexDirection': 'column',
    'justifyContent': 'space-between',
    'gap': '2px',
  },
  cloneIcon: {
    'background': theme.cloneIconBg,
    'filter': theme.cloneIconFilter,
    'height': '18px',
    'border-radius': '2px',
  },
}))

interface IModuleImportTile {
  module: IBrowseModule
}

const ModuleImportTile: React.FC<IModuleImportTile> = ({module}) => {
  const classes = useStyles()

  const showMetadata = () => {
    if (module.Account) {
      const accountIconSet = responsiveAccountIcons(module.Account)
      const showVerified = isPartner(module.Account) || is8thWallAccountUuid(module.Account.uuid)
      return (
        <>
          <ResponsiveImage
            className={classes.accountIcon}
            width={32}
            alt={`${module.Account.name} icon`}
            sizeSet={accountIconSet}
          />
          <div className={classes.textContainer}>
            <span className={classes.moduleName}>{getDisplayNameForModule(module)}</span>
            <span className={classes.accountName}>
              {module.Account.name}
              {showVerified && <CheckedCertificateIcon height={1} />}
            </span>
          </div>
        </>
      )
    }

    return <span className={classes.moduleName}>{getDisplayNameForModule(module)}</span>
  }

  return (
    <>
      <ModuleImportItemPreview module={module} />
      <div className={classes.content}>
        {showMetadata()}
      </div>
      {module.repoVisibility === 'PUBLIC' &&
        <div className={classes.icon}>
          <img
            className={classes.cloneIcon}
            src={icons.projectClone}
            alt='Clone'
            title='Code Available'
          />
        </div>
      }
    </>
  )
}

export {ModuleImportTile}
