import React from 'react'

import useCurrentAccount from '../../common/use-current-account'
import {useAccountModules} from '../../modules/use-account-modules'
import {usePublicModules} from '../../modules/use-public-modules'
import useActions from '../../common/use-actions'
import moduleActions from '../../modules/actions'
import {ModuleImportList} from './module-import-list'
import {ModuleCreateView} from '../../modules/module-create-view'
import {Tab, TabModal} from '../../uiWidgets/tab-modal'
import {isModuleAuthorAllowed} from '../../../shared/account-module-access'
import {useCurrentMemberAccount} from '../../common/use-current-member-account'
import {useDismissibleModal} from '../dismissible-modal-context'
import type {AppHostingType} from '../../common/types/db'

interface IModuleImportPanel {
  onClose: () => void
  isSelfHosted?: boolean
  appHostingType: AppHostingType
}

const ModulePrivateImport: React.FC<IModuleImportPanel> = (
  {onClose, isSelfHosted, appHostingType}
) => {
  const account = useCurrentMemberAccount()
  const modules = useAccountModules(account)

  if (!modules) {
    // Pending load by WorkspaceContainer
    return null
  }

  return (
    <ModuleImportList
      modules={modules}
      onClose={onClose}
      currentTab='My Modules'
      isPrivate
      isSelfHosted={isSelfHosted}
      appHostingType={appHostingType}
    />
  )
}

const ModulePublicImport: React.FC<IModuleImportPanel> = (
  {onClose, isSelfHosted, appHostingType}
) => {
  const modules = usePublicModules()
  return (
    <ModuleImportList
      modules={modules}
      onClose={onClose}
      currentTab='Featured Modules'
      isSelfHosted={isSelfHosted}
      appHostingType={appHostingType}
    />
  )
}

interface IModuleImportModal {
  onClose: () => void
  isSelfHosted?: boolean
  appHostingType: AppHostingType
}

const ModuleImportModal: React.FC<IModuleImportModal> = (
  {isSelfHosted, onClose, appHostingType}
) => {
  useDismissibleModal(onClose)
  const {listPublicModules} = useActions(moduleActions)
  const account = useCurrentAccount()

  React.useEffect(() => {
    listPublicModules()
  }, [])

  const viewProps = {onClose, isSelfHosted, appHostingType}

  const moduleImportTabs: Tab[] = [
    {
      name: 'Featured Modules',
      key: 'public',
      component: <ModulePublicImport {...viewProps} />,
    },
  ]
  if (isModuleAuthorAllowed(account)) {
    moduleImportTabs.push({
      name: 'My Modules',
      key: 'owned',
      component: <ModulePrivateImport {...viewProps} />,
    })
    moduleImportTabs.push({
      name: 'Create New Module',
      key: 'create',
      component: <ModuleCreateView {...viewProps} />,
    })
  }

  return (
    <TabModal tabs={moduleImportTabs} onClose={onClose} showCloseButton />
  )
}

export {ModuleImportModal}

export type {IModuleImportModal}
