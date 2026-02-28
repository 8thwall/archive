import React from 'react'
import {createUseStyles} from 'react-jss'
import {Modal, Segment} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import modal8Styles from '../../uiWidgets/styles/modal'
import ButtonLink from '../../uiWidgets/button-link'
import AddPaymentMethodForm from './add-payment-method-form'
import {Icon} from '../../ui/components/icon'

const useStyles = createUseStyles({
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
  },
  icon: {
    marginLeft: '1em',
  },
  buttonLink: {
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3em',
    padding: '1em 0',
  },
  segment: {
    '&.ui.segment': {
      borderRadius: '10px',
      padding: '2em',
    },
  },
})

const AddPaymentMethod = () => {
  const {t} = useTranslation(['billing'])
  const classes = useStyles()
  const modal8 = modal8Styles()
  const [editing, setEditing] = React.useState(false)
  const handleSubmitComplete = () => setEditing(false)
  const handleError = () => setEditing(false)
  const handleCancel = () => setEditing(false)

  return (
    <>
      <Modal
        open={editing}
        className={modal8.modal}
        size='tiny'
        closeIcon
        onClose={() => {
          setEditing(false)
        }}
      >
        <div>
          <h2 className={modal8.mainText}>{t('billing.add_payment_method_modal.title')}</h2>
        </div>
        <Segment className={classes.segment}>
          <AddPaymentMethodForm
            onSubmitComplete={handleSubmitComplete}
            onCancel={handleCancel}
            onError={handleError}
          />
        </Segment>
      </Modal>
      <ButtonLink
        className={classes.buttonLink}
        onClick={() => {
          setEditing(true)
        }}
      >
        <Icon stroke='plus' />
        {t('billing.add_payment_method_modal.button.add_payment_method')}
      </ButtonLink>
    </>
  )
}

export default AddPaymentMethod
