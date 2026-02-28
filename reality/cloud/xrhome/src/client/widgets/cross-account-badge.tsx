import React from 'react'

import type {IApp, IExternalAccount} from '../common/types/models'
import useAppSharingInfo from '../common/use-app-sharing-info'
import {Badge} from '../ui/components/badge'

interface ICrossAccountBadge {
  app: IApp
}

const CrossAccountBadge: React.FC<ICrossAccountBadge> = ({app}) => {
  const {externalOwnerAccount, sharingAccounts} = useAppSharingInfo(app)
  const sharedWithList = sharingAccounts
    ?.map((account: IExternalAccount) => account?.shortName)
    .join(', ')
  let badgeContent
  const isExternalApp = !!externalOwnerAccount
  if (isExternalApp) {
    badgeContent = `Shared by ${externalOwnerAccount?.shortName}`
  } else {
    badgeContent = `Shared with ${sharingAccounts[0]?.shortName}`
    badgeContent += sharingAccounts.length > 1 ? ` + ${sharingAccounts.length - 1}` : ''
  }

  return (
    <Badge
      variant='pastel'
      height='tiny'
      color={isExternalApp ? 'mint' : 'purple'}
      title={isExternalApp ? '' : sharedWithList}
    >
      {badgeContent}
    </Badge>
  )
}

export default CrossAccountBadge
