import * as React from 'react'
import {Button, Header, Message, Icon} from 'semantic-ui-react'
import {Trans, useTranslation} from 'react-i18next'

import type {IAccount, IApp} from '../common/types/models'
import domainsActions from './domains-actions'
import DnsRecordTable from './dns-record-table'
import {CustomDomainInput} from './custom-domain-input'
import {parseConnectedDomainFull} from '../../shared/domain-utils'
import useActions from '../common/use-actions'
import {useChangeEffect} from '../hooks/use-change-effect'

const INPUT_STAGE = 1
const VERIFY_STAGE = 2
const CONNECT_STAGE = 3
const COMPLETE_STAGE = 4

type HeadingTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingLevel = 0 | 1 | 2 | 3 | 4 | 5

const InlineLink = ({href}) => <a href={`https://${href}`} className='inline-link'>{href}</a>

const commaCombineList = (items) => {
  if (items.length <= 1) {
    return items
  } else if (items.length === 2) {
    return <>{items[0]} and {items[1]}</>
  } else {
    const withCommas = items.slice(0, items.length - 1).reduce((o, v) => {
      o.push(v)
      o.push(', ')
      return o
    }, [])

    return <>{withCommas}and {items[items.length - 1]}</>
  }
}

const getDomainInfo = (customDomainStatus, connectedDomain) => {
  const {domainName, domains} = customDomainStatus
  if (domainName && domains) {
    return {
      domainName,
      redirectDomains: domains.filter(d => d !== domainName),
    }
  }
  if (!connectedDomain) {
    return {
      domainName: '',
      redirectDomains: [],
    }
  }
  return parseConnectedDomainFull(connectedDomain)
}

const ConnectedDomainStatusDisplay = ({
  domainName,
  redirectDomains,
  domainStatus,
  deleting,
  onDelete,
  loading,
  onReload,
  haveResourceRecords,
}) => {
  if (!domainStatus) {
    return <p>Loading status... {domainStatus}</p>
  }

  if (domainStatus === 'VALIDATION_TIMED_OUT') {
    return (
      <>
        <p>Domain ownership verification timed out after 72 hours. Please delete and retry.</p>
        <Button size='small' color='red' onClick={onDelete} loading={deleting} content='Delete' />
      </>
    )
  }

  if (!haveResourceRecords && domainStatus !== 'FAILED') {
    return (
      <>
        <p>Please wait, your custom domain is being set up...</p>
        <div className='button-row right'>
          <Button
            loading={loading}
            onClick={onReload}
            size='small'
            content='Refresh status'
          />
        </div>
      </>
    )
  }

  return (
    <>
      <p>
        Your custom domain has been created at <InlineLink href={domainName} />
        {redirectDomains.length > 0 &&
          <span>
            , with {redirectDomains.length === 1 ? 'a redirect' : 'redirects'}{' from: '}
            {commaCombineList(redirectDomains.map(r => <InlineLink key={r} href={r} />))}
          </span>

        }
        .
      </p>
      <Button size='small' color='red' onClick={onDelete} loading={deleting} content='Delete' />
    </>
  )
}

const getSectionClass = (currentStage, stage) => {
  let result = 'stage '

  if (currentStage === stage) {
    result += 'current '
  }

  if (currentStage !== stage) {
    result += 'faded '
  }

  if (currentStage > stage) {
    result += 'complete'
  }

  return result
}

const describeDomainValidation = ({ResourceRecord, ValidationStatus}) => ResourceRecord && (
  // eslint-disable-next-line max-len
  `${ResourceRecord.Name} ${ResourceRecord.Type} ${ResourceRecord.Value} ${ValidationStatus === 'SUCCESS'}`
)

const ErrorHeader = ({children, headingLevel}) => {
  const ErrorHeadingTag = `h${headingLevel}` as HeadingTagType
  return (
    <ErrorHeadingTag><span className='cherry'>ERROR: </span>{children}</ErrorHeadingTag>
  )
}

const describeCertificateFailureJsx =
  (customDomainStatus, retryCreateCertificate, headingLevel) => {
    const failureReason = customDomainStatus?.CertificateFailureReason
    if (!failureReason) {
      return null
    }
    if (failureReason === 'ADDITIONAL_VERIFICATION_REQUIRED') {
      return (
        <>
          <ErrorHeader headingLevel={headingLevel}>
            Could not connect your domain to this 8th Wall project.
          </ErrorHeader>
          <p>
            Domain has been flagged for additional verification.
          </p>
          <p>
            TO RESOLVE: If you own this domain contact
            {' '}
            <a href='mailto:support@8thwall.com'>support@8thwall.com</a>
            {' '}
            to initiate the additional domain verification.
          </p>
        </>
      )
    } else if (failureReason === 'CAA_ERROR') {
      return (
        <>
          <ErrorHeader headingLevel={headingLevel}>
            Could not connect your domain to this 8th Wall project.
          </ErrorHeader>
          <p>
            Domain failed validation due to a Certificate Authority Authentication (CAA) error.
          </p>
          <p>
            TO RESOLVE: Verify that your domain’s DNS configuration is
            {' '}
            <a href='//8th.io/caa-error'>
              set up to allow AWS Certificate Manager (amazon.com) to issue an SSL cert.
            </a>
            {' '}
            Once the DNS setup is properly
            configured please press the resolved button below. After pressing the resolved button
            delete the previous verification records and add the updated verification record(s)
            to your domain(s).
          </p>
          <p>
            <Button onClick={retryCreateCertificate}>Retry</Button>
          </p>
        </>
      )
    } else {
      return (
        <>
          <ErrorHeader headingLevel={headingLevel}>
            Could not connect domain.
          </ErrorHeader>
          <p>
            Please reach out to customer support or try different domains.
          </p>
        </>
      )
    }
  }

const describeCloudFrontFailureJsx =
  (customDomainStatus, retryCreateStack, isLoading, headingLevel) => {
    const {StackResourceFailures} = customDomainStatus || {}
    const failedCloudFront = StackResourceFailures?.find(resource => (
      resource.LogicalResourceId === 'CloudFront'
    ))
    const {ResourceStatusReason: reason} = failedCloudFront || {}
    if (!reason) {
      return null
    }

    // NOTE(pawel) Amazon changed the message string and removed CNAMEAlreadyExists, I think
    // we can reasonable expect both the error code (409) and the word CNAME to appear
    // since the message includes a url to the help page on CNAMEs

    // NOTE(pawel) There are 2 kinds of 409 errors:
    // - "One or more of the CNAMEs you provided are already associated with a different resource."
    // - "One or more aliases specified for the distribution includes an incorrectly configured
    //    DNS record that points to another CloudFront distribution."

    const isCnameError = reason.includes('CNAME') && reason.includes('409')
    const isDnsRecordIssue = reason.includes('points to another CloudFront distribution')
    const pointsToAnotherCloudfront = reason.includes('associated with a different resource')

    let errorBody

    if (isCnameError && isDnsRecordIssue) {
      errorBody = (
        <>
          <p>
            One or more of the domain(s) you are attempting to connect is already in use.
            Your DNS configuration includes an incorrectly configured DNS record that points to
            another hosting environment.
          </p>
          <p>
            TO RESOLVE: Delete the existing CNAME record(s) for the domain(s) specified, and then
            press the resolved button.
            After pressing the resolved button please wait up to 3 hrs for your domain to connect as
            DNS updates may take time to propagate.
            <br />
          </p>
          <p>
            <Button disabled={isLoading} onClick={retryCreateStack}>I resolved this issue.</Button>
          </p>
        </>
      )
    } else if (isCnameError && pointsToAnotherCloudfront) {
      errorBody = (
        <>
          <p>
            One or more of the domain(s) you are attempting to connect is already associated with
            another CloudFront distribution.
          </p>
          <p>
            TO RESOLVE: Ensure that all the domains you want to connect are not included as CNAMEs
            in existing CloudFront distributions, and then press the resolved button.
            <br />
          </p>
          <p>
            <Button disabled={isLoading} onClick={retryCreateStack}>I resolved this issue.</Button>
          </p>
        </>
      )
      // Log the error that we aren't familiar with so it shows up in ac.8thwall.com/errors
      // eslint-disable-next-line no-console
      console.error(`Unknown CloudFront failed reason ${reason}`)
    } else {
      errorBody = (
        <>
          <p>
            An error occurred when connecting your domain.
          </p>
          <p>
            Contact support to resolve this issue or try another domain.
          </p>
        </>
      )
    }

    return (
      <>
        <ErrorHeader headingLevel={headingLevel}>
          Could not connect your domain(s) to this 8th Wall project.
        </ErrorHeader>
        {errorBody}
      </>
    )
  }

interface ICustomDomainView {
  account?: IAccount
  app?: IApp
  onClose?: () => void
  hideHeader?: boolean
  headerLevel?: HeadingLevel
  className?: string
}

const CustomDomainView: React.FC<ICustomDomainView> = ({
  account, app, onClose = () => {}, hideHeader, headerLevel = 2, className,
}) => {
  const {t} = useTranslation(['app-pages'])
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isFetchingStatus, setIsFetchingStatus] = React.useState(false)
  const [customDomainStatus, setCustomDomainStatus] = React.useState(null)
  const {getCustomDomain, deleteCustomDomain, retryCustomDomainStep} = useActions(domainsActions)

  const {CertificateStatus, DomainValidation, CloudFront} = customDomainStatus || {}
  const haveResourceRecords = DomainValidation &&
                              DomainValidation.every(({ResourceRecord}) => !!ResourceRecord)

  const loadStatus = async () => {
    const entity = app || account

    if (!entity.connectedDomain) {
      return Promise.resolve()
    }

    const type = app ? 'app' : 'account'

    try {
      const res = await getCustomDomain(type, entity.uuid)
      setCustomDomainStatus(res)
    } catch {
      setError(t('project_dashboard_page.web_origins_view.loading_error'))
    }
    return Promise.resolve()
  }

  React.useEffect(() => {
    loadStatus()
  }, [])

  useChangeEffect(([prevApp, prevAccount]) => {
    const prevEntity = prevApp || prevAccount
    const newEntity = app || account

    if (prevEntity?.connectedDomain !== newEntity?.connectedDomain) {
      loadStatus()
    }
  }, [app, account])

  const handleReloadStatus = async () => {
    setIsFetchingStatus(true)
    await loadStatus()
    setIsFetchingStatus(false)
  }

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm(t('project_dashboard_page.web_origins_view.delete_domain.confirm'))) {
      return
    }

    const type = app ? 'app' : 'account'
    const uuid = app ? app.uuid : account.uuid
    setIsDeleting(true)
    try {
      await deleteCustomDomain(type, uuid)
      onClose()
      setCustomDomainStatus(null)
    } catch (err) {
      setError(err.message || t('project_dashboard_page.web_origins_view.delete_domain.error'))
    } finally {
      setIsDeleting(false)
    }
  }

  const retryCreate = step => async () => {
    const type = app ? 'app' : 'account'
    const uuid = app?.uuid || account.uuid
    setIsFetchingStatus(true)
    try {
      const res = await retryCustomDomainStep(type, uuid, step)
      setCustomDomainStatus(res)
    } finally {
      setIsFetchingStatus(false)
    }
  }

  // Support either app or account custom domain
  const entity = app || account

  const {domainName, redirectDomains} =
    getDomainInfo(customDomainStatus || {}, entity.connectedDomain)

  // Decide on current stage
  let currentStage
  if (!entity.connectedDomain || !CertificateStatus) {
    currentStage = INPUT_STAGE
  } else if (CertificateStatus === 'PENDING_VALIDATION' ||
             CertificateStatus === 'FAILED'
  ) {
    currentStage = VERIFY_STAGE
  } else if (CertificateStatus === 'ISSUED' &&
             CloudFront && CloudFront.Aliases.every(({Connected}) => Connected)) {
    currentStage = COMPLETE_STAGE
  } else {
    // Generic error?
    currentStage = CONNECT_STAGE
  }

  const SectionHeaderTag = `h${headerLevel + 1}` as HeadingTagType  // type enforced headerLevel
  const errorHeaderLevel = headerLevel + 2

  // If something went wrong when creating the CloudFront
  const cloudFrontFailure =
    describeCloudFrontFailureJsx(
      customDomainStatus,
      retryCreate('stack'),
      isFetchingStatus,
      errorHeaderLevel
    )

  // If something went wrong when creating the ACM certificate
  const certificateFailure =
    describeCertificateFailureJsx(
      customDomainStatus,
      retryCreate('certificate'),
      errorHeaderLevel
    )

  return (
    <div className={className}>
      {!hideHeader && <Header as='h2'>Connect a Custom Domain</Header>}
      {error && <Message error>{error}</Message>}

      <section className={getSectionClass(currentStage, INPUT_STAGE)}>
        <p>
          {t('project_dashboard_page.web_origins_view.setup_domain.description')}
        </p>
        <p>
          <Trans
            ns='app-pages'
            i18nKey='project_dashboard_page.web_origins_view.setup_domain.note'
          ><strong>Note:</strong> It is recommended that you connect a
            <strong>subdomain </strong> (e.g. webar.mydomain.com) instead of the root domain
            (e.g. mydomain.com). Not all DNS providers support CNAME records for the root domain
            (also known as ANAME or ALIAS records). If you are unsure, please contact your DNS
            provider to see if they support ANAME / CNAME / ALIAS records for the root domain
            before proceeding.
          </Trans>
        </p>
        <SectionHeaderTag className='step-title'>
          {t('project_dashboard_page.domain_setup.subheader.step_1')}
        </SectionHeaderTag>
        {entity.connectedDomain
          ? (
            <ConnectedDomainStatusDisplay
              domainName={domainName}
              redirectDomains={redirectDomains}
              domainStatus={CertificateStatus}
              haveResourceRecords={haveResourceRecords}
              onReload={handleReloadStatus}
              loading={isFetchingStatus}
              deleting={isDeleting}
              onDelete={handleDelete}
            />
          )
          : (
            <CustomDomainInput
              headerLevel={headerLevel + 1}
              account={account}
              app={app}
            />
          )
        }
      </section>

      <section className={getSectionClass(currentStage, VERIFY_STAGE)}>
        <SectionHeaderTag className='step-title'>
          {t('project_dashboard_page.domain_setup.subheader.step_2')}
        </SectionHeaderTag>
        <p>
          {t('project_dashboard_page.domain_setup.blurb.verify_ownership')}
        </p>
        <DnsRecordTable
          records={DomainValidation && DomainValidation.map(describeDomainValidation)}
        />
        {certificateFailure}
        {currentStage === VERIFY_STAGE && !certificateFailure &&
          <div className='button-row right'>
            <Button
              loading={isFetchingStatus}
              size='small'
              onClick={handleReloadStatus}
              content='Refresh verification status'
            />
          </div>
          }
      </section>

      <section className={getSectionClass(currentStage, CONNECT_STAGE)}>
        <SectionHeaderTag className='step-title'>
          {t('project_dashboard_page.domain_setup.subheader.step_3')}
        </SectionHeaderTag>
        {cloudFrontFailure ||
          <>
            <p>
              {t('project_dashboard_page.domain_setup.blurb.login_dns_registrar')}
            </p>
            <DnsRecordTable
              records={CloudFront && CloudFront.Aliases.map(({Domain, Connected}) => (
                `${Domain} CNAME ${CloudFront.DomainName} ${Connected}`
              ))}
            />
            {currentStage === CONNECT_STAGE &&
              <div className='button-row right'>
                <Button
                  loading={isFetchingStatus}
                  onClick={handleReloadStatus}
                  size='small'
                  content={t('project_dashboard_page.domain_setup.button.refresh')}
                />
              </div>
            }
          </>
        }
      </section>

      {currentStage === COMPLETE_STAGE &&
        <section className='stage complete align-center'>
          <p>
            <b>
              {t('project_dashboard_page.domain_setup.status.connection_established')}
              <Icon name='check' />
            </b>
          </p>
          <p>
            {app
              ? t('project_dashboard_page.domain_setup.status.project_is_available')
              : t('project_dashboard_page.domain_setup.status.projects_are_available')
            }

          </p>
        </section>
      }

      <p>
        <Trans ns='app-pages' i18nKey='project_dashboard_page.domain_setup.contact_support'>
          Questions? Contact
          {' '}
          <a href='mailto:support@8thwall.com'>support@8thwall.com</a>
          {' '}
          for assistance.

        </Trans>
      </p>
    </div>
  )
}

export {
  CustomDomainView,
}
