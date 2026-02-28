import React from 'react'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../../ui/theme'
import {ModuleImportItem} from './module-import-item'
import type {IBrowseModule} from '../../common/types/models'
import {ModuleImportDetail} from './module-import-detail'
import {mobileViewOverride} from '../../static/styles/settings'
import {filterCompatibleModules} from '../../../shared/module-compatibility'
import {combine} from '../../common/styles'
import {LIBRARY_ACCOUNTS} from '../../../shared/account-constants'
import ProjectModulesIcon from '../../apps/widgets/project-modules-icon'
import type {AppHostingType} from '../../common/types/db'
import {Icon} from '../../ui/components/icon'

const useStyles = createThemedStyles(theme => ({
  moduleImportList: {
    zIndex: '1',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    display: 'grid',
    position: 'sticky',
    top: '0',
    padding: '2rem 3rem 0 3rem',
    gap: '1rem',
    gridTemplateColumns: 'auto',
  },
  headerName: {
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
    fontSize: '14px',
    fontWeight: '700',
  },
  headerIcon: {
    width: '30px',
    height: '30px',
  },
  searchGroup: {
    'display': 'flex',
    'alignItems': 'baseline',
    'padding': '0.5rem',
    'borderRadius': '0.25rem',
    'color': theme.fgMain,
    'cursor': 'text',
    'background': theme.sfcBackgroundDefault,
    'boxShadow': `0 0 0 1px ${theme.sfcBorderDefault} inset`,
    '&:focus-within': {
      outline: `1px solid ${theme.sfcBorderFocus}`,
      boxShadow: `0 0 0 1px ${theme.sfcBorderFocus} inset`,
    },
  },
  searchInput: {
    'width': '100%',
    'background': 'transparent',
    'border': 'none',
    'outline': 'none',
    'color': theme.fgMain,
    '&::selection': {
      background: theme.sfcHighlight,
      color: theme.fgMain,
    },
    '&::placeholder': {
      color: theme.fgMuted,
    },
    '&:focus-visible': {
      outline: 'none',
    },
  },
  moduleList: {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(auto-fill, minmax(260px, 1fr))',
    'gridAutoRows': 'minmax(min-content, max-content)',
    'gap': '1.7rem 2.5rem',
    'height': '100%',
    'padding': '0 3rem 2rem 3rem',
    'overflowY': 'scroll',
    [mobileViewOverride]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    },
    '&::-webkit-scrollbar': {
      width: '6px',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.scrollbarTrackBackground,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.scrollbarThumbColor,
      borderRadius: '20px',
      border: `1px solid ${theme.scrollbarThumbColor}`,
    },
  },
  tabsContainer: {
    display: 'flex',
    gap: '0 0.5rem',
    height: '2.25rem',
    margin: '0 3rem 0.5rem',
  },
  tab: {
    'display': 'flex',
    'alignItems': 'center',
    'height': '100%',
    'padding': '0.5rem 1rem',
    'fontWeight': '600',
    'borderRadius': '6px',
    'cursor': 'pointer',
    'border': 'none',

    '&:hover': {
      backgroundColor: theme.tabActiveLightBg,
      color: theme.tabHover,
    },
  },
  defaultTab: {
    backgroundColor: 'transparent',
    color: theme.tabDefaultLightBg,
  },
  activeTab: {
    backgroundColor: theme.tabActiveLightBg,
    color: theme.tabHover,
  },
}))

interface IModuleImportList {
  modules: readonly IBrowseModule[]
  onClose: () => void
  currentTab: string
  isPrivate?: boolean
  isSelfHosted?: boolean
  appHostingType: AppHostingType
}

const ModuleImportList: React.FC<IModuleImportList> = ({
  modules, onClose, currentTab, isPrivate, isSelfHosted, appHostingType,
}) => {
  const {t} = useTranslation(['module-pages'])
  const classes = useStyles()
  const [searchValue, changeSearchValue] = React.useState('')
  const [selectedModuleUuid, setSelectedModuleUuid] = React.useState<string>()
  const onModuleSelect = id => setSelectedModuleUuid(id)
  const [activeTabKey, setActiveTabKey] = React.useState<string>()

  const eighthWallTabKey = '8thwall'
  const featuredPaneTabs = [
    {name: t('import_module_modal.featured_modules.all_tab.label'), key: 'all'},
    {name: '8th Wall', key: eighthWallTabKey},
  ] as const

  const matchSearch = (m: IBrowseModule) => {
    const lowerSearch = searchValue.toLowerCase()
    return (
      m.title?.toLowerCase().includes(lowerSearch) ||
      m.description?.toLowerCase().includes(lowerSearch) ||
      m.name?.toLowerCase().includes(lowerSearch)
    )
  }

  if (selectedModuleUuid) {
    return (
      <ModuleImportDetail
        // NOTE(christoph): ModuleImportDetail doesn't support moduleUuid changing while mounted,
        //                  so we use key to remount if the selectedModuleUuid changes
        key={selectedModuleUuid}
        onClose={onClose}
        onCancel={() => setSelectedModuleUuid(null)}
        moduleUuid={selectedModuleUuid}
        currentTab={currentTab}
        isPrivate={isPrivate}
      />
    )
  }

  const activeTab = featuredPaneTabs.find(tab => tab.key === activeTabKey) || featuredPaneTabs[0]
  const allModules = filterCompatibleModules(modules, isSelfHosted, appHostingType)
    .filter(matchSearch)
  const isLimitedTo8thWall = !isPrivate && activeTab.key === eighthWallTabKey
  const visibleModules = isLimitedTo8thWall
    ? allModules.filter(m => LIBRARY_ACCOUNTS.includes(m.AccountUuid))
    : allModules

  const showToggle = !isPrivate && allModules.some(m => !LIBRARY_ACCOUNTS.includes(m.AccountUuid))

  return (
    <div className={classes.moduleImportList}>
      <div className={classes.header}>
        <div className={classes.headerName}>
          <ProjectModulesIcon className={classes.headerIcon} />
          <div>
            Import New Module
          </div>
        </div>
        <label className={classes.searchGroup} htmlFor='module-import-search'>
          <Icon stroke='search' size={1.2} />
          <input
            id='module-import-search'
            type='text'
            className={classes.searchInput}
            value={searchValue}
            onChange={e => changeSearchValue(e.target.value)}
            placeholder='Search by keyword'
          />
        </label>
      </div>
      {showToggle && (
        <div className={classes.tabsContainer}>
          {featuredPaneTabs.map(({name, key}) => (
            <button
              type='button'
              key={key}
              className={combine(
                classes.tab,
                key === activeTab.key ? classes.activeTab : classes.defaultTab
              )}
              onClick={() => setActiveTabKey(key)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      <div className={classes.moduleList}>
        {visibleModules.map((m: IBrowseModule) => (
          <ModuleImportItem
            key={m.uuid}
            module={m}
            onSelect={() => onModuleSelect(m.uuid)}
          />
        ))}
      </div>
    </div>
  )
}

export {ModuleImportList}
