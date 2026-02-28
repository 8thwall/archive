import * as React from 'react'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import type {DeepReadonly} from 'ts-essentials'

import type {IPublicAccount, IPublicModule} from '../common/types/models'
import {
  brandPurple,
  gray5,
  headerSanSerif,
} from '../static/styles/settings'

import ProfileAvatarBlock from './widgets/profile-avatar-block'
import BrowseLink from './widgets/browse-link'
import {PrimaryButton} from '../ui/components/primary-button'
import {getDisplayNameForModule} from '../../shared/module/module-display-name'
import {TooltipIcon} from '../widgets/tooltip-icon'
import {useModuleCompatibilityToString} from '../modules/use-module-compatibility-to-string'
import {createThemedStyles} from '../ui/theme'
import {getPublicPathForModuleImport} from '../common/paths'
import {SpaceBetween} from '../ui/layout/space-between'
import type {VersionInfo} from '../../shared/module/module-target-api'
import {getVersionSpecifier} from '../../shared/module/module-version-patches'
import {RequireLoginModal} from '../uiWidgets/require-login-modal'
import {isModuleRepoVisible} from '../../shared/module-repo-visibility'
import {Tag} from '../ui/components/tag'
import {useUserHasSession} from '../user/use-current-user'
import {Icon} from '../ui/components/icon'

const useStyles = createThemedStyles(theme => ({
  moduleTitle: {
    fontFamily: headerSanSerif,
    fontSize: '1.5rem',
  },
  clickableBold: {
    'color': `${brandPurple} !important`,
    'fontWeight': 'bold',
    '&:hover': {
      color: `${gray5} !important`,
      opacity: '0.7',
    },
  },
  moduleInfo: {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '0.5rem',
    'height': 'fit-content',
    'flex': '0 0 25rem',
    'padding': '1.5em',
    'border': `1px solid ${theme.sfcBorderDefault}`,
    'borderRadius': theme.sfcBorderRadius,
    'background': theme.sfcBackgroundDefault,
    'backdropFilter': theme.sfcBackdropFilter,
    '& > p': {
      margin: '0.7em 0',
      lineHeight: '20px',
    },
  },
  tagView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '1em',
    gap: '0.5em',
  },
  moduleInfoTable: {
    border: 'none',
    borderCollapse: 'collapse',
    marginTop: '1em',
  },
  clone: {
    display: 'flex',
    backgroundColor: theme.secondaryBtnBg,
    borderRadius: theme.sfcBorderRadius,
    padding: '0.5rem',
    alignItems: 'center',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    flexWrap: 'nowrap',
  },
  importButton: {
    width: '100%',
  },
}))

interface IModuleInfoCard {
  module: DeepReadonly<IPublicModule>
  account: DeepReadonly<IPublicAccount>
  latestVersion: VersionInfo
}

const ModuleInfoCard: React.FC<IModuleInfoCard> = ({
  module, account, latestVersion,
}) => {
  const moduleTitle = getDisplayNameForModule(module)
  const moduleCompatibilityToString = useModuleCompatibilityToString()

  const history = useHistory()
  const classes = useStyles()

  const {t} = useTranslation(['public-featured-pages', 'common'])

  const isLoggedIn = useUserHasSession()

  const {license, publishTime, patchTarget} = latestVersion ??
    {license: null, publishTime: null, patchTarget: null}

  const dateString = new Date(publishTime)?.toLocaleDateString(
    undefined, {year: 'numeric', month: 'short', day: 'numeric'}
  )

  // TODO(Dale): update this logic for paid
  const isImportable = true

  const onImportClick = () => {
    const moduleImportPath = getPublicPathForModuleImport(account, module.name)
    history.push(moduleImportPath)
  }

  const moduleCompatibilityLabel = (
    <>
      {t('featured_module_page.info_card.module_data.compatibility')}
      <TooltipIcon
        content={(
          <p>
            {t('featured_module_page.info_card.tooltip.compatibility_label')}
          </p>
        )}
      />
    </>
  )

  const data = [
    {
      id: 1,
      name: t('featured_module_page.info_card.module_data.license'),
      value: (
        <BrowseLink path='LICENSE' className={classes.clickableBold}>
          {license}
        </BrowseLink>
      ),
      hide: !license || !isModuleRepoVisible(module),
    },
    {
      id: 2,
      name: moduleCompatibilityLabel,
      value: (moduleCompatibilityToString[module.compatibility]),
      hide: !module.compatibility,
    },
    {
      id: 3,
      name: t('featured_module_page.info_card.module_data.latest_release'),
      value: dateString,
      hide: !dateString,
    },
    {
      id: 4,
      name: t('featured_module_page.info_card.module_data.latest_version'),
      value: patchTarget && `${getVersionSpecifier(patchTarget)}`,
      hide: !patchTarget,
    },
    // // TODO(Dale): Update when we have the number of imported
    // {
    //   id: 5,
    //   name: t('featured_module_page.info_card.module_data.imported'),
    //   value: 123,
    // },
  ]

  const moduleInfoTable = (
    <table className={classes.moduleInfoTable}>
      <thead>
        <tr>
          <th style={{fontWeight: 'bold', textAlign: 'left'}}>Details</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          if (!item.hide) {
            return (
              <tr key={item.id}>
                <td style={{textAlign: 'left'}}>{item.name}</td>
                <td style={{textAlign: 'right'}}>{item.value}</td>
              </tr>
            )
          }
          return null
        })}
      </tbody>
    </table>
  )

  const additionalModuleInfo = (
    <>
      <p className='description'>{module.description}</p>
      <div className={classes.buttonRow}>
        {isImportable &&
          <div
            className={classes.importButton}
          >
            {isLoggedIn
              ? (
                <PrimaryButton
                  a8={`click;public-module;click-import-project-${module.uuid}`}
                  type='button'
                  spacing='full'
                  onClick={onImportClick}
                >{t('button.import', {ns: 'common'})}
                </PrimaryButton>
              )
              : (
                <RequireLoginModal
                  trigger={(
                    <PrimaryButton
                      a8={`click;public-module;click-import-project-${module.uuid}`}
                      type='button'
                      spacing='full'
                      onClick={null}
                    >{t('button.import', {ns: 'common'})}
                    </PrimaryButton>
                  )}
                  type='module'
                  redirectTo={getPublicPathForModuleImport(account, module.name)}
                />
              )}
          </div>
        }
        {isModuleRepoVisible(module) &&
          <div className={classes.clone}>
            <Icon stroke='code' size={1.5} />
          </div>
        }
      </div>
      {moduleInfoTable}
      {module.Tags?.length > 0 &&
        <div className={classes.tagView}>
          {module.Tags.map(tag => (
            <Tag
              height='small'
              key={tag.name}
              wrap
            >
              {tag.name}
            </Tag>
          ))}
        </div>
      }
    </>
  )

  return (
    <div className={classes.moduleInfo}>
      <h1 className={classes.moduleTitle}>{moduleTitle}</h1>
      <ProfileAvatarBlock hideImage={!!account.icon} account={account} />
      <SpaceBetween direction='vertical'>
        {additionalModuleInfo}
      </SpaceBetween>
    </div>
  )
}

export default ModuleInfoCard
