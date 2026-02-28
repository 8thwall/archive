import React from 'react'
import {Card, Label, Button, Grid, Checkbox, Statistic} from 'semantic-ui-react'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import {useTranslation} from 'react-i18next'

import type {IApp} from '../common/types/models'
import appsActions from './apps-actions'
import useActions from '../common/use-actions'
import {useSelector} from '../hooks'
import {Icon} from '../ui/components/icon'

type IAppOrDeleted = IApp | {appKey: string, appName: string, status: 'DELETED'}

interface IAppDetails {
  app: IAppOrDeleted
  onCopy: (text: string, success: boolean) => void
  isCopied?: boolean
}

const AppDetails: React.FC<IAppDetails> = ({app, onCopy, isCopied}) => {
  const {updateApp} = useActions(appsActions)
  const {t} = useTranslation(['common'])
  return (
    <div className='camera-detail'>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <p className='cam-section'>Status</p>
            {app.status === 'DELETED'
              ? <Label color='red' size='tiny'>DELETED</Label>
              : <Checkbox
                  toggle
                  checked={app.status === 'ENABLED'}
                  label={app.status === 'ENABLED' ? 'ENABLED' : 'DISABLED'}
                  onClick={() => updateApp({
                    uuid: app.uuid,
                    status: app.status === 'ENABLED'
                      ? 'DISABLED'
                      : 'ENABLED',
                  })}
              />}
          </Grid.Column>
          <Grid.Column width={12}>
            <p className='cam-section'>App Key</p>
            <CopyToClipboard text={app.appKey} onCopy={onCopy}>
              <span>
                <Button
                  icon
                  size='mini'
                  style={{marginBottom: '0.5em'}}
                  color={isCopied ? 'green' : 'grey'}
                >
                  <Icon stroke='clipboard' inline />
                  {isCopied ? t('button.copied') : t('button.copy')}
                </Button>
                <span title={app.appKey} className='truncate-span'>{app.appKey}</span>
              </span>
            </CopyToClipboard>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

interface IStat {
  value?: number
  label: React.ReactNode
}

const Stat: React.FC<IStat> = ({value, label}) => (
  <Grid.Column className='views' width={1} verticalAlign='middle' style={{marginLeft: '2em'}}>
    <Statistic size='mini' horizontal={false} color={value ? 'black' : 'grey'}>
      <Statistic.Label>{label}</Statistic.Label>
      <Statistic.Value>{value ? Number(value).toFixed(2) : 0}</Statistic.Value>
      <Statistic.Label>Hours</Statistic.Label>
    </Statistic>
  </Grid.Column>
)

interface IAppSummary {
  toggle: () => void
  app: IAppOrDeleted
}

const AppSummary: React.FC<IAppSummary> = ({toggle, app}) => {
  const {deleteApp} = useActions(appsActions)
  const usage = useSelector(s => s.usage.summaries.find(u => u.appKey === app.appKey))
  return (
    <Grid className='camera-summary'>
      <Grid.Row
        className={`clickable-head ${app.status === 'ENABLED'
          ? 'live'
          : 'disabled'} ${app.status === 'DELETED'
          ? 'deleted'
          : ''}`}
        onClick={toggle}
      >
        <Grid.Column className='name' width={7} verticalAlign='middle'>
          {app.appName}
        </Grid.Column>
        <Stat value={usage?.C8} label='8th&nbsp;Wall&nbsp;XR' />
        <Stat value={usage?.ARCORE} label='ARCore' />
        <Stat value={usage?.ARKIT} label='ARKit' />
        <Stat value={usage?.TOTAL} label='Total' />
        <Grid.Column width={3} textAlign='right' style={{float: 'right'}}>
          { app.status === 'DELETED'
            ? 'Deleted'
            : <Button size='tiny' icon='trash alternate' content='Delete' onClick={(event) => { deleteApp(app); event.stopPropagation() }} />}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

interface IAppItem extends IAppDetails {
  active?: boolean
}

const AppListItem: React.FC<IAppItem> = ({active: startsActive, app, isCopied, onCopy}) => {
  const [active, setActive] = React.useState(!!startsActive)

  const activeClass = active ? 'active' : ''
  return (
    <Card fluid className={`box-shadow ${activeClass}`}>
      <AppSummary app={app} toggle={() => setActive(a => !a)} />
      {active &&
        <Card.Content className={activeClass}>
          <AppDetails app={app} isCopied={isCopied} onCopy={onCopy} />
        </Card.Content>
      }
    </Card>
  )
}

export default AppListItem
