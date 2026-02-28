import * as React from 'react'
import {Button, Modal} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'react-i18next'

import {Icon} from '../../ui/components/icon'
import {BoldButton} from '../../ui/components/bold-button'
import {SpaceBetween} from '../../ui/layout/space-between'
import type {RepoState} from '../../git/git-redux-types'

const useStyles = createUseStyles({
  hidden: {
    visibility: 'hidden',
  },
})

const UnpublishModal = ({
  modalOpen, confirmSwitch, rejectSwitch, branchName, isFeatured, inProgress,
}) => {
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const isStaging = branchName === 'staging'
  const isProduction = branchName === 'production'

  const unpublishText = isStaging
    ? t('editor_page.unpublish_modal.header.unpublish_staging')
    : t('editor_page.unpublish_modal.header.unpublish_public')

  const unpublishPublicBlurb = isFeatured
    ? t('editor_page.unpublish_modal.unpublish_public.blurb.is_featured')
    : t('editor_page.unpublish_modal.unpublish_public.blurb')

  return (
    <Modal open={modalOpen} onClose={rejectSwitch} closeOnDimmerClick={false}>
      <Modal.Header>{unpublishText}?</Modal.Header>
      <Modal.Content>
        {(isProduction && <p>{unpublishPublicBlurb}</p>) ||
        (<p>{t('editor_page.unpublish_modal.unpublish_staging.blurb')}</p>)}
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content={unpublishText}
          onClick={confirmSwitch}
          loading={inProgress}
        />
        <Button content={t('button.cancel', {ns: 'common'})} onClick={rejectSwitch} />
      </Modal.Actions>
    </Modal>
  )
}

interface IBranchUnpublishWidget {
  deployment: RepoState['deployment']
  undeployBranch: (branch: string) => Promise<void>
  onUnpublishComplete?: (branch: string) => void
  isFeatured: boolean
  shouldHide?: boolean
}

const UnpublishStagingWidget: React.FC<IBranchUnpublishWidget> = (
  {deployment, undeployBranch, onUnpublishComplete, isFeatured, shouldHide = false}
) => {
  const [stagingUnpublishInProgress, setStagingUnpublishInProgress] = React.useState(false)
  const [stagingModalOpen, setStagingModalOpen] = React.useState(false)
  const hasStagingDeployment = !!(deployment && deployment.staging)

  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  return (
    <>
      <BoldButton
        className={(!hasStagingDeployment && shouldHide) && classes.hidden}
        disabled={!hasStagingDeployment || stagingUnpublishInProgress}
        onClick={() => setStagingModalOpen(true)}
      >
        <Icon stroke='unpublish' color='warning' inline />
        {t('editor_page.unpublish_widget.button.unpublish_staging')}
      </BoldButton>

      <UnpublishModal
        branchName='staging'
        isFeatured={isFeatured}
        modalOpen={stagingModalOpen}
        confirmSwitch={() => {
          setStagingUnpublishInProgress(true)
          return undeployBranch('staging').then(() => {
            setStagingModalOpen(false)
            setStagingUnpublishInProgress(false)
            onUnpublishComplete?.('staging')
          })
        }}
        rejectSwitch={() => {
          setStagingModalOpen(false)
        }}
        inProgress={stagingUnpublishInProgress}
      />
    </>
  )
}

const UnpublishPublicWidget: React.FC<IBranchUnpublishWidget> = (
  {deployment, undeployBranch, onUnpublishComplete, isFeatured, shouldHide = false}
) => {
  const [productionUnpublishInProgress, setProductionUnpublishInProgress] = React.useState(false)
  const [productionModalOpen, setProductionModalOpen] = React.useState(false)
  const hasProdDeployment = !!(deployment && deployment.production)

  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <>
      <BoldButton
        className={(!hasProdDeployment && shouldHide) && classes.hidden}
        disabled={!hasProdDeployment || productionUnpublishInProgress}
        onClick={() => setProductionModalOpen(true)}
      >
        <Icon stroke='unpublish' color='success' inline />
        {t('editor_page.unpublish_widget.button.unpublish_public')}
      </BoldButton>
      <UnpublishModal
        branchName='production'
        isFeatured={isFeatured}
        modalOpen={productionModalOpen}
        confirmSwitch={() => {
          setProductionUnpublishInProgress(true)
          return undeployBranch('production').then(() => {
            setProductionModalOpen(false)
            setProductionUnpublishInProgress(false)
            onUnpublishComplete?.('production')
          })
        }}
        rejectSwitch={() => {
          setProductionModalOpen(false)
        }}
        inProgress={productionUnpublishInProgress}
      />
    </>
  )
}

interface IUnpublishWidget extends Omit<IBranchUnpublishWidget, 'shouldHide'> {
  urls: Record<'staging' | 'production', string>
  editorLink: string
}

const UnpublishWidget: React.FC<IUnpublishWidget> = (
  {
    urls, deployment, undeployBranch, editorLink, onUnpublishComplete, isFeatured,
  }
) => (
  <>
    <p>
      <Trans
        ns='cloud-editor-pages'
        i18nKey='editor_page.unpublish_widget.blurb'
      >
        Unpublishing your project will remove it from&nbsp;
        <a target='_blank' rel='noopener noreferrer' href={urls.staging}>
          <b>Staging</b>
        </a> or&nbsp;
        <a target='_blank' rel='noopener noreferrer' href={urls.production}><b>Public</b></a>.
        You can publish it again at any time from the <Link to={editorLink}><b>Editor</b></Link>.
      </Trans>
    </p>
    <SpaceBetween>
      <UnpublishStagingWidget
        deployment={deployment}
        undeployBranch={undeployBranch}
        onUnpublishComplete={onUnpublishComplete}
        isFeatured={isFeatured}
      />
      <UnpublishPublicWidget
        deployment={deployment}
        undeployBranch={undeployBranch}
        onUnpublishComplete={onUnpublishComplete}
        isFeatured={isFeatured}
      />
    </SpaceBetween>
  </>

)

export {
  UnpublishWidget as default,
  UnpublishStagingWidget,
  UnpublishPublicWidget,
}
