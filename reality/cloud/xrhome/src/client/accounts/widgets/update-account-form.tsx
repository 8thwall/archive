import * as React from 'react'
import {Input, Form, Button} from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import actions from '../account-actions'
import {getPathForWorkspacesPage} from '../../common/paths'
import UpgradeButton from '../../billing/upgrade-button'
import type {IAccount} from '../../common/types/models'
import {CustomDomainModal} from '../../domains/custom-domain-modal'
import {
  getPlanTypeForAccountType, isEntryWebAccount, isUnityAccount, isCustomDomainsEnabled,
} from '../../../shared/account-utils'
import useActions from '../../common/use-actions'
import {useFormInput} from '../../common/form-change-hook'

interface IUpdateAccountFormProps {
  // Callbacks when users click the Cancel or Delete button
  onCancel?: () => void
  onDelete?: () => void

  // Available from an IAccount object
  account: IAccount
}

const UpdateAccountForm: React.FC<IUpdateAccountFormProps> = ({
  onCancel, onDelete, account,
}) => {
  const {t} = useTranslation(['account-pages', 'common'])
  const {updateAccount} = useActions(actions)
  const history = useHistory()
  const {accountType} = account
  const [name, onFormName] = useFormInput(account.name)
  const [url, onFormUrl] = useFormInput(account.url)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const isSameForm = (name === account.name) && (url === account.url)
  const disabled = isSameForm || (!isEntryWebAccount(account) && (!name || !url))
  const canDelete = isUnityAccount(account) && onDelete
  const customDomainEnabled = isCustomDomainsEnabled(account)
  const canUpgrade = account && account.accountType === 'WebDeveloper'

  const handleSubmit = async () => {
    setIsUpdating(true)
    await updateAccount({uuid: account.uuid, name, url})
    history.push(getPathForWorkspacesPage())
  }

  return (
    <div>
      <section className='section'>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Field
              width={6}
              inline
            >
              <p>{t('edit_account_page.update_account_form.label.workspace_type')}</p>
              <span>
                {getPlanTypeForAccountType(accountType)}
              </span>
            </Form.Field>
          </Form.Group>

          <Form.Field
            required
            width={16}
            control={Input}
            name='name'
            label={t('edit_account_page.update_account_form.label.workspace_name')}
            value={name}
            onChange={onFormName}
          />
          <Form.Field
            width={16}
            control={Input}
            name='url'
            label={t('edit_account_page.update_account_form.label.website_url')}
            value={url}
            onChange={onFormUrl}
          />
          <Form.Field>
            <Button
              icon='edit'
              primary
              content={t('edit_account_page.update_account_form.button.update')}
              disabled={disabled}
              loading={isUpdating}
            />
            {onCancel && <Button onClick={onCancel} content={t('button.cancel', {ns: 'common'})} />}
            {canDelete &&
              <Form.Button
                icon='trash alternate outline'
                onClick={onDelete}
                content={t('edit_account_page.update_account_form.button.delete')}
              />
            }
          </Form.Field>
        </Form>
      </section>

      {canUpgrade &&
        <section className='section'>
          <p>
            {t('edit_account_page.update_account_form.web_developer_description')}
          </p>
          {canUpgrade && <UpgradeButton account={account} />}
        </section>
      }

      {customDomainEnabled &&
        <section className='section'>
          <h2 className='cam-section'>
            {t('edit_account_page.update_account_form.heading.custom_domain')}
          </h2>
          <CustomDomainModal account={account} />
        </section>
      }
    </div>
  )
}

export {
  UpdateAccountForm,
}
