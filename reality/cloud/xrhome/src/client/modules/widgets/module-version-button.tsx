import React from 'react'
import {Button} from 'semantic-ui-react'

import type {IDeployableModule} from '../../common/types/models'
import {useGitLoaded} from '../../git/hooks/use-current-git'
import {ModuleVersionModal} from './module-version-modal'
import {useDismissibleModalContext} from '../../editor/dismissible-modal-context'

interface IModuleVersionButton {
  module: IDeployableModule
  onDeploy?: () => void
}

const ModuleVersionButton: React.FC<IModuleVersionButton> = ({module, onDeploy}) => {
  const [modalOpen, setModalOpen] = React.useState(false)
  const {dismissModals} = useDismissibleModalContext()

  const gitLoaded = useGitLoaded()

  return (
    <>
      <Button
        icon='cloud upload'
        content='Deploy'
        disabled={!gitLoaded}
        onClick={() => {
          dismissModals()
          setModalOpen(true)
        }}
      />
      {modalOpen && gitLoaded &&
        <ModuleVersionModal
          module={module}
          onClose={() => setModalOpen(false)}
          onDeploy={onDeploy}
        />
      }
    </>
  )
}

export {
  ModuleVersionButton,
}
