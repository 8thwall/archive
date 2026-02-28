import * as React from 'react'
import {createUseStyles} from 'react-jss'

import {useTranslation} from 'react-i18next'

import {SpaceBetween} from '../ui/layout/space-between'
import AutoHeading from '../widgets/auto-heading'
import {SecondaryButton} from '../ui/components/secondary-button'
import {PrimaryButton} from '../ui/components/primary-button'
import {FloatingTrayModal} from '../ui/components/floating-tray-modal'

const useStyles = createUseStyles({
  projectListModal: {
    padding: '4rem 7rem',
  },
  projectListHeader: {
    margin: 0,
  },
})

interface IProjectListModal {
  onClose: () => void
  onSubmit: () => Promise<void>
  header: React.ReactNode
  content: React.ReactNode
  submitContent: React.ReactNode
}

const ProjectListModal: React.FC<IProjectListModal> = ({
  onClose, onSubmit, header, content, submitContent,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['studio-desktop-pages', 'common'])
  return (
    <FloatingTrayModal
      startOpen
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
      trigger={undefined}
    >
      {() => (
        <form
          className={classes.projectListModal}
          onSubmit={async (e) => {
            e.preventDefault()
            await onSubmit()
          }}
        >
          <SpaceBetween direction='vertical' centered>
            <AutoHeading className={classes.projectListHeader}>
              {header}
            </AutoHeading>
            {content}
            <SpaceBetween>
              <SecondaryButton
                type='button'
                onClick={() => {
                  onClose()
                }}
              >
                {t('button.cancel', {ns: 'common'})}
              </SecondaryButton>
              <PrimaryButton
                type='submit'
              >
                {submitContent}
              </PrimaryButton>
            </SpaceBetween>
          </SpaceBetween>
        </form>
      )}
    </FloatingTrayModal>
  )
}

export {
  ProjectListModal,
}
