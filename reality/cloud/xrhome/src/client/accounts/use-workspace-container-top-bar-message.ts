import {TFunction, useTranslation} from 'react-i18next'

import type {IAccount} from '../common/types/models'
import {getPathForAccount, AccountPathEnum} from '../common/paths'
import type {TopBarState} from '../messages/top-bar/top-bar-reducer'
import type {IncompleteAccountPlan} from '../../shared/account/account-types'

type MessageGetter = (
  account: IAccount,
  t: TFunction<'account-pages'[]>
) => TopBarState

const getPendingUpgradeMessage: MessageGetter = (account, t) => ({
  isShown: true,
  icon: 'clock outline',
  summary: t('workspace_container.top_bar.pending_upgrade.summary'),
  text: t('workspace_container.top_bar.pending_upgrade.text'),
  linkText: t('workspace_container.top_bar.pending_upgrade.link'),
  linkTo: getPathForAccount(account, AccountPathEnum.account),
  linkIsButton: true,
  color: 'purple' as const,
  closeable: false,
})

const useWorkspaceContainerTopBarMessage = (
  account: IAccount | null,
  incompletePlan: IncompleteAccountPlan | null
) => {
  const {t} = useTranslation(['account-pages'])

  if (!account) {
    return null
  }

  if (incompletePlan) {
    return getPendingUpgradeMessage(account, t)
  }

  return null
}

export {
  useWorkspaceContainerTopBarMessage,
}
