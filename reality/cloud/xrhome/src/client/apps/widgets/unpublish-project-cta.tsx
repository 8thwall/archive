import React, {useState} from 'react'
import {createUseStyles} from 'react-jss'

import type {IApp} from '../../common/types/models'
import {brandBlack} from '../../static/styles/settings'
import ButtonLink from '../../uiWidgets/button-link'
import UnpublishProjectModal from './unpublish-project-modal'

interface IUnpublishProjectCTA {
  app: IApp
  onUnpublish: () => void
}

const useStyles = createUseStyles({
  linkButton: {
    textDecoration: 'underline',
    color: brandBlack,
    fontWeight: '700',
  },
  container: {
    marginTop: '1.5em',
  },
})

const UnpublishProjectCTA: React.FC<IUnpublishProjectCTA> = ({app, onUnpublish}) => {
  const classes = useStyles()
  const [isModalOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const onClose = () => setModalOpen(false)
  const onConfirm = () => {
    setModalOpen(false)
    onUnpublish()
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }

  if (!app.publicFeatured) {
    return null
  }
  return (
    <div className={classes.container}>
      <ButtonLink
        className={classes.linkButton}
        type='button'
        onClick={openModal}
      >
        Unpublish Featured Project
      </ButtonLink>
      {isModalOpen && <UnpublishProjectModal
        app={app}
        onConfirm={onConfirm}
        onClose={onClose}
      />}
    </div>
  )
}

export default UnpublishProjectCTA
