import React from 'react'

import {StandardLink} from '../ui/components/standard-link'
import {createThemedStyles} from '../ui/theme'
import {useGitActiveClient} from '../git/hooks/use-current-git'
import useCurrentAccount from '../common/use-current-account'
import {useSelector} from '../hooks'
import {getPathForModuleFile} from '../common/paths'

const useStyles = createThemedStyles(() => ({
  developmentClientMissingMessage: {
    paddingTop: '1rem',
  },
}))

interface IModuleManifestMissingMessage {
  moduleUuid: string
  isDevelopmentMode: boolean
}

const ModuleManifestMissingMessage: React.FC<IModuleManifestMissingMessage> = ({
  moduleUuid,
  isDevelopmentMode,
}) => {
  const classes = useStyles()

  // Used for missing manifest message.
  const activeClientName = useGitActiveClient()?.name
  const account = useCurrentAccount()
  const underlyingModule = useSelector(s => moduleUuid && s.modules.entities[moduleUuid])
  const moduleEditorLink = underlyingModule &&
    getPathForModuleFile(account, underlyingModule, 'module.js')

  if (isDevelopmentMode) {
    return (
      <div className={classes.developmentClientMissingMessage}>
        <p>
          To use the development target for your module, there has to be a cloud editor client
          in your module with the same name as the client in which you are editing your app.
        </p>
        <p>
          The current client is <strong>{activeClientName}</strong>.
        </p>
        {moduleEditorLink &&
          <StandardLink newTab color='primary' href={moduleEditorLink}>
            Got to module editor.
          </StandardLink>
        }
      </div>
    )
  }

  return (
    <div className={classes.developmentClientMissingMessage}>
      <p>
        Module Manifest file is missing.
      </p>
    </div>
  )
}

export {
  ModuleManifestMissingMessage,
}
