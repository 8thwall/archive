import * as React from 'react'
import {Button, Form, Header, Modal} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import type {IContract} from '../common/types/models'
import '../static/styles/contract-pdf-modal.scss'
import LinkOut from '../uiWidgets/link-out'
import contractActions from './contract-actions'
import useActions from '../common/use-actions'

interface IContractPdfModal {
  isOpen: boolean
  onClose: () => void
  contract: IContract

  // Finish callback
  // onContractAccept(contractAccept: IAccountContractAgreement): void
  onContractAccept: Function
}

const ContractPdfModal: React.FC<IContractPdfModal> = ({
  isOpen, onClose, contract, onContractAccept,
}) => {
  const {t} = useTranslation(['app-pages'])
  const [isAccepting, setIsAccepting] = React.useState(false)
  const {acceptContractForAcc} = useActions(contractActions)
  const onAcceptClick = async () => {
    setIsAccepting(true)
    const contractAccept = await acceptContractForAcc(contract.uuid)
    setIsAccepting(false)
    return onContractAccept(contractAccept)
  }

  return (
    <Modal
      closeIcon
      open={isOpen}
      onClose={onClose}
      className='contract-pdf-inner-modal'
    >
      <Header as='h1'>
        {t('purchase_license_page.web_app_upgrade_agreement_field.label')}
      </Header>
      <Header as='h4'>{contract.name}</Header>
      <LinkOut url={contract.pdfSignedUrl}>
        {t('purchase_license_page.contract_pdf_modal.linkout.download_agreement')}
      </LinkOut>

      <Header as='h2'>
        {t('purchase_license_page.contract_pdf_modal.header.summary')}
      </Header>
      <p>
        {t('purchase_license_page.contract_pdf_modal.blurb.subscription_web_application_created')}
      </p>
      <Form>
        <iframe
          title='pdf preview'
          className='contract-pdf-modal-iframe'
          src={contract.pdfSignedUrl}
        />
        <Button
          className='contract-pdf-modal-button-primary'
          primary
          loading={isAccepting}
          disabled={isAccepting}
          onClick={onAcceptClick}
        >
          {t('purchase_license_page.contract_pdf_modal.button.accept')}
        </Button>
      </Form>
    </Modal>
  )
}

export {ContractPdfModal}
