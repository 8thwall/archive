import React from 'react'
import {createUseStyles} from 'react-jss'
import {Trans, useTranslation} from 'react-i18next'

import type {IAccount, IApiKey} from '../common/types/models'
import CollapsibleSetting from '../settings/collapsible-setting'
import CopyableLine from '../widgets/copyable-line'
import {isPlatformApiEnabled} from '../../shared/account-utils'
import {goDocs} from '../common'
import CopyableBlock from '../widgets/copyable-block'
import SpaceBelow from '../ui/layout/space-below'
import {useSelector} from '../hooks'
import LinkOut from '../uiWidgets/link-out'
import {Icon} from '../ui/components/icon'

const getKeyAccessRequestHref = (account: IAccount) => (
  `mailto:support@8thwall.com?subject=${encodeURIComponent(
    'Request for Image Target API Key'
  )}&body=${encodeURIComponent(
    `Hi 8th Wall Support - Can you please enable the Image Target API key for \
${account.name} (account ID: ${account.uuid})?

I will be using this API to [insert your API use case].`
  )}`
)

const getUploadTargetExample = (appKey: string, secretKey: string) => (
  `curl "https://api.8thwall.com/v1/apps/${appKey}/targets" \\
    -X POST \\
    -H "X-Api-Key:${secretKey}" \\
    -F "name=my-target-name" \\
    -F "image=@path/to/file.png" \\
    -F "geometry.top=0" \\
    -F "geometry.left=0"\\
    -F "geometry.width=480" \\
    -F "geometry.height=640"`
)

const getListTargetsExample = (appKey: string, secretKey: string) => (
  `curl "https://api.8thwall.com/v1/apps/${appKey}/targets" \\
    -H "X-Api-Key:${secretKey}"`
)

const useKeyItemClasses = createUseStyles({
  item: {
    'maxWidth': '30rem',
    '&:not(:last-child)': {
      marginBottom: '1rem',
    },
  },
})

const KeyItem: React.FC<{apiKey: IApiKey}> = ({apiKey}) => {
  const classes = useKeyItemClasses()
  return (
    <div className={classes.item}>
      <CopyableLine
        text={apiKey?.secretKey || 'SorryThisIsNotARealKey-ContactSupport'}
        disabled={!apiKey}
      />
    </div>
  )
}

const useStyles = createUseStyles({
  miniHeader: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: '1rem',
    textTransform: 'uppercase',
  },
})

interface IImageTargetApiBox {
  account: IAccount
  active?: boolean
  onClick?: () => void
  appKey?: string
}

const ImageTargetApiBox: React.FC<IImageTargetApiBox> = ({account, active, onClick, appKey}) => {
  const {t} = useTranslation(['account-pages'])
  const [ownActive, setOwnActive] = React.useState(false)
  const keys: IApiKey[] = useSelector(
    s => s.apiKeys.byAccountUuid[account.uuid]?.map(u => s.apiKeys.entities[u])
  )

  const classes = useStyles()

  if (!keys || (keys.length === 0 && !isPlatformApiEnabled(account))) {
    return null
  }

  const activeKey = keys.find(key => key.status === 'ENABLED')?.secretKey
  const showUsage = !!(isPlatformApiEnabled(account) && activeKey && appKey)

  return (
    <CollapsibleSetting
      active={active !== undefined ? active : ownActive}
      onClick={onClick || (() => setOwnActive(!ownActive))}
      title={(
        <>
          {appKey
            ? t('plan_billing_page.image_target_api_box.title.platform_api')
            : t('plan_billing_page.image_target_api_box.title.api_key')
          }
          &nbsp;<Icon inline stroke='key' />
        </>
      )}
    >
      <p>
        {t('plan_billing_page.image_target_api_box.description')}{' '}
        {!showUsage &&
          <Trans
            ns='account-pages'
            i18nKey='plan_billing_page.image_target_api_box.learn_more'
            components={{
              3: <LinkOut url={goDocs('api/platform-api/')} className='inline-link' />,
            }}
          />
        }
      </p>

      <h3 className={classes.miniHeader}>
        {t('plan_billing_page.image_target_api_box.heading.secret_key')}
      </h3>
      <p>
        {t('plan_billing_page.image_target_api_box.instructions')}
      </p>

      {keys.length
        ? (
          <>
            {keys.map(key => (<KeyItem key={key.uuid} apiKey={key} />))}
            {!isPlatformApiEnabled(account) &&
              <p className='cherry'>
                <Trans
                  ns='account-pages'
                  i18nKey='plan_billing_page.image_target_api_box.disabled_key'
                  count={keys.length}
                >
                  Please{' '}
                  <a href='mailto:support@8thwall.com' className='inline-link'>contact support</a>.
                </Trans>
              </p>
            }
          </>
        )
        : (
          <>
            <KeyItem apiKey={null} />
            <p>
              <Trans
                ns='account-pages'
                i18nKey='plan_billing_page.image_target_api_box.obtain_access_please_contact'
                components={{
                  1: <Icon inline stroke='lock' />,
                  3: <LinkOut url={getKeyAccessRequestHref(account)} className='inline-link' />,
                }}
              />
            </p>
          </>
        )
      }

      {showUsage &&
        <>
          <h3 className={classes.miniHeader}>
            {t('plan_billing_page.image_target_api_box.heading.usage')}
          </h3>
          <p>
            <Trans
              ns='account-pages'
              i18nKey='plan_billing_page.image_target_api_box.usage.get_started'
            >
              Get started with the Image Target Platform API by running the following sample
              commands. These include this project&apos;s app key and workspace&apos;s Platform
              API key. Learn more in our{' '}
              <a href={goDocs('api/platform-api/')} className='inline-link'>
                Platform API documentation
              </a>.
            </Trans>
          </p>
          <SpaceBelow>
            <CopyableBlock
              description={t('plan_billing_page.image_target_api_box.copyable_block.create_upload')}
              text={getUploadTargetExample(appKey, activeKey)}
            />
          </SpaceBelow>
          <CopyableBlock
            description={t('plan_billing_page.image_target_api_box.copyable_block.request_list')}
            text={getListTargetsExample(appKey, activeKey)}
          />
        </>
      }
    </CollapsibleSetting>
  )
}

export default ImageTargetApiBox
