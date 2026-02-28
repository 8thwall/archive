import React from 'react'
import {Form, Button, Message} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Trans, useTranslation} from 'react-i18next'

import type {IAccount, IApp} from '../common/types/models'
import {getPathForApp, getAccountEditPath} from '../common/paths'

import {isValidDomain, getRootDomain} from '../../shared/domain-utils'
import domainsActions from './domains-actions'
import useActions from '../common/use-actions'
import GenericHeading, {toHeadingLevel} from '../widgets/generic-heading'

const REDIRECT_DOMAIN_LIMIT = 10

interface ICustomDomainInput {
  app?: IApp
  account: IAccount
  headerLevel?: number
}

const CustomDomainInput: React.FC<ICustomDomainInput> = ({app, account, headerLevel = 3}) => {
  const [error, setError] = React.useState<string | null>(null)
  const [inUseApp, setInUseApp] = React.useState<IApp | null>(null)
  const [inUseAccount, setInUseAccount] = React.useState<IAccount | null>(null)
  const [isCreating, setIsCreating] = React.useState(false)
  const [domainName, setDomainName] = React.useState('')
  const [redirectDomains, setRedirectDomains] = React.useState<string[]>([])

  const {createCustomDomain} = useActions(domainsActions)

  const {t} = useTranslation(['app-pages', 'common'])

  const handleSubmit = async () => {
    if (!isValidDomain(domainName)) {
      setError(t('project_dashboard_page.domain_setup.error.no_match'))
      return
    }

    const rootDomain = getRootDomain(domainName)

    if (/8thwall/.test(rootDomain)) {
      setError(t('project_dashboard_page.domain_setup.error.no_8th_wall_domain'))
      return
    }

    if (!redirectDomains.every(s => getRootDomain(s) === rootDomain)) {
      setError(t('project_dashboard_page.domain_setup.error.same_root_domain'))
      return
    }

    const type = app ? 'app' : 'account'
    const uuid = app ? app.uuid : account.uuid

    setIsCreating(true)

    try {
      const res = await createCustomDomain(type, uuid, domainName, redirectDomains)

      if (res.status === 'unavailable') {
        if (res.account) {
          setIsCreating(false)
          setError('')
          setInUseApp(res.app)
          setInUseAccount(res.account)
        } else {
          setIsCreating(false)
          setError(t('project_dashboard_page.domain_setup.error.domain_unavailable'))
        }
      }
    } catch (err) {
      setIsCreating(false)
      setError(t('project_dashboard_page.domain_setup.error.general_error', {
        error_message: err.message,
      }))
    }
  }

  const handleChangeDomainName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainName(e.target.value.toLowerCase())
  }

  const handleAddSubdomain = () => {
    setRedirectDomains([...redirectDomains, ''])
  }

  const handleRemoveSubdomain = (index: number) => {
    setRedirectDomains(redirectDomains.filter((_, i) => i !== index))
  }

  const handleChangeSubdomain = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value.toLowerCase()
    setRedirectDomains(redirectDomains.map((subdomain, i) => (i === index ? newValue : subdomain)))
  }

  let errorContent: React.ReactNode
  if (error) {
    errorContent = error
  } else if (inUseApp && inUseAccount) {
    errorContent = (
      <Trans
        ns='app-pages'
        i18nKey='project_dashboard_page.domain_setup.input.error.other_project_in_use'
        components={{2: <Link to={getPathForApp(inUseAccount, inUseApp)} />}}
      />
    )
  } else if (inUseAccount) {
    errorContent = (
      <Trans
        ns='app-pages'
        i18nKey='project_dashboard_page.domain_setup.input.error.other_account_in_use'
        components={{2: <Link to={getAccountEditPath(inUseAccount)} />}}
      />

    )
  }

  return (
    <Form onSubmit={handleSubmit} error={!!errorContent}>
      <Message
        error
        onDismiss={() => {
          setError('')
          setInUseAccount(null)
          setInUseApp(null)
        }}
      >{errorContent}
      </Message>

      <Form.Input
        label={t('project_dashboard_page.domain_setup.input.label')}
        value={domainName}
        name='domainName'
        placeholder='webar.mydomain.com'
        onChange={handleChangeDomainName}
        required
      />
      <GenericHeading level={toHeadingLevel(headerLevel)}>
        {t('project_dashboard_page.domain_setup.additional_sub_domains.input.label')}
      </GenericHeading>

      {redirectDomains.map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Form.Group key={i}>
          <Form.Input
            required
            size='small'
            placeholder='redirect.mydomain.com'
            value={redirectDomains[i]}
            onChange={e => handleChangeSubdomain(e, i)}
          />
          <Form.Button
            size='small'
            type='button'
            onClick={() => handleRemoveSubdomain(i)}
            content={t('button.remove', {ns: 'common'})}
          />
        </Form.Group>
      ))}

      <Form.Field>
        <Button
          type='button'
          onClick={handleAddSubdomain}
          size='small'
          content={t('project_dashboard_page.domain_setup.additional_sub_domains.input.button')}
          disabled={redirectDomains.length >= REDIRECT_DOMAIN_LIMIT}
        />
      </Form.Field>

      <p>
        {t('project_dashboard_page.domain_setup.additional_sub_domains.input.blurb')}
      </p>

      <Form.Field className='button-row right'>
        <Button
          type='submit'
          size='small'
          primary
          loading={isCreating}
          content={t('button.connect', {ns: 'common'})}
        />
      </Form.Field>
    </Form>
  )
}

export {
  CustomDomainInput,
}
