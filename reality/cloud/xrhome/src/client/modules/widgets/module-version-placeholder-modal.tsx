import React from 'react'
import {Placeholder} from 'semantic-ui-react'

import {StandardModalContent} from '../../editor/standard-modal-content'
import {StandardModalActions} from '../../editor/standard-modal-actions'
import {StandardModalHeader} from '../../editor/standard-modal-header'
import {StandardModal} from '../../editor/standard-modal'
import {LinkButton} from '../../ui/components/link-button'
import {useModuleVersionModalStyles} from './module-version-modal-styles'

interface IModuleVersionPlaceholderModal {
  onClose: () => void
}

const ModuleVersionPlaceholderModal: React.FC<IModuleVersionPlaceholderModal> = ({onClose}) => {
  const classes = useModuleVersionModalStyles()

  return (
    <StandardModal onClose={onClose}>
      <StandardModalHeader>
        <div className={classes.headerPadding} />
      </StandardModalHeader>
      <StandardModalContent>
        <div className={classes.placeholder}>
          <Placeholder fluid className={classes.titlePlaceholder}>
            <Placeholder.Image />
          </Placeholder>
          <Placeholder fluid className={classes.releasePlaceholder}>
            <Placeholder.Image />
          </Placeholder>
          <Placeholder fluid>
            <Placeholder.Header>
              <Placeholder.Line length='very short' />
              <Placeholder.Line length='long' />
              <Placeholder.Line length='medium' />
            </Placeholder.Header>
          </Placeholder>
          <Placeholder fluid>
            <Placeholder.Header>
              <Placeholder.Line length='very short' />
              <Placeholder.Line length='medium' />
            </Placeholder.Header>
          </Placeholder>
        </div>
      </StandardModalContent>
      <StandardModalActions>
        <LinkButton type='button' onClick={onClose}>Cancel</LinkButton>
        <Placeholder className={classes.submitPlaceholder}>
          <Placeholder.Image />
        </Placeholder>
      </StandardModalActions>
    </StandardModal>
  )
}

export {
  ModuleVersionPlaceholderModal,
}
