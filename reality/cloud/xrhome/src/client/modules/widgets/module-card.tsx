import React from 'react'
import {Card, Dropdown, DropdownItemProps} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {createUseStyles} from 'react-jss'

import {getPathForModule, ModulePathEnum} from '../../common/paths'
import type {IAccount, IModule} from '../../common/types/models'
import {deriveModuleCoverImageUrl} from '../../../shared/module-cover-image'
import {BasicCardThumbnail} from '../../widgets/basic-card-thumbnail'
import useActions from '../../common/use-actions'
import moduleActions from '../actions'
import {getDisplayNameForModule} from '../../../shared/module/module-display-name'
import {Badge} from '../../ui/components/badge'
import {useAppCardStyles} from '../../apps/widgets/use-app-card-styles'

const useStyles = createUseStyles({
  archivedBadge: {
    paddingLeft: '1rem',
  },
})

interface IModuleCard {
  account: IAccount
  module: IModule
}

const ModuleCard: React.FC<IModuleCard> = ({account, module}) => {
  const {t} = useTranslation('account-pages')
  const appCardClasses = useAppCardStyles()
  const classes = useStyles()
  const title = getDisplayNameForModule(module)
  const thumbnailSrc = deriveModuleCoverImageUrl(module)
  const editorLink = getPathForModule(account, module, ModulePathEnum.files)
  const settingsLink = getPathForModule(account, module, ModulePathEnum.settings)
  const {duplicateModule} = useActions(moduleActions)

  const handleDuplicateModule = async () => {
    // eslint-disable-next-line no-alert
    const name = prompt(t('account_dashboard_page.module_card.prompt.duplicate_name'))
    if (!name) {
      // eslint-disable-next-line no-alert
      alert(t('account_dashboard_page.module_card.prompt.duplicate_canceled'))
      return
    }
    await duplicateModule(module, {
      name,
    })
  }

  const options: DropdownItemProps[] = [
    <Dropdown.Item
      as={Link}
      to={editorLink}
      key='editor'
      text={t('account_dashboard_page.app_card.link.go_to_editor')}
    />,
    <Dropdown.Item
      onClick={handleDuplicateModule}
      key='duplicate'
      text={t('account_dashboard_page.module_card.link.duplicate_module')}
    />,
    <Dropdown.Item
      as={Link}
      to={settingsLink}
      key='settings'
      text={t('account_dashboard_page.app_card.link.settings')}
    />,
  ]

  return (
    <Card as='li' key={module.uuid} className={appCardClasses.appCard}>
      <Card.Content className='header-content'>
        <Card.Header className={appCardClasses.header}>
          {module.archived &&
            <div className={classes.archivedBadge}>
              <Badge color='mango'>
                {t('account_dashboard_page.module_card.badge.archived')}
              </Badge>
            </div>
          }
          <Link title={title} className='left truncate-span' to={editorLink}>{title}</Link>
          <Dropdown options={options} pointing='top right' icon='ellipsis vertical' />
        </Card.Header>
      </Card.Content>
      <BasicCardThumbnail to={editorLink} src={thumbnailSrc} />
    </Card>
  )
}

export {
  ModuleCard,
}
