import * as React from 'react'
import {createUseStyles} from 'react-jss'

import {useTranslation} from 'react-i18next'

import {getRootDomain, getSubdomain} from '../../shared/domain-utils'

import {brandWhite, darkBlue} from '../static/styles/settings'
import CopyableLine from '../widgets/copyable-line'
import {Icon} from '../ui/components/icon'

const useRowStyles = createUseStyles({
  dnsRecordCopyable: {
    'flex': '0 1 25em',
    'padding': '0.5em',
  },
})

// record looks like this
// HOST TYPE VALUE CONNECTED
const RecordRow = ({record}) => {
  const classes = useRowStyles()

  if (!record) {
    return (
      <tr>
        <td />
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
    )
  }
  const split = record.split(' ')

  const rawDomain = split[0].replace(/\.$/, '')

  const rootDomain = getRootDomain(rawDomain)
  const subdomain = getSubdomain(rawDomain)

  // If naked domain, show ANAME instead of CNAME
  const type = subdomain ? split[1] : 'ANAME'
  const connected = split[3] === 'true' ? 'connected' : ''
  const value = split[2]

  return (
    <tr>
      <td>{connected && <Icon stroke='checkmark' color='success' />}</td>
      <td>
        {rootDomain}
      </td>
      <td>
        <div className={classes.dnsRecordCopyable}>
          <CopyableLine text={subdomain || '@'} theme='dark' />
        </div>
      </td>
      <td>{type}</td>
      <td>
        <div className={classes.dnsRecordCopyable}>
          <CopyableLine text={value} theme='dark' />
        </div>
      </td>
    </tr>
  )
}

const useStyles = createUseStyles({
  dnsRecordTable: {
    'width': '100%',
    'backgroundColor': darkBlue,
    'color': brandWhite,
    'borderRadius': '0.25em',
    'tableLayout': 'fixed',
    'marginBottom': '0.5em',
    '& th': {
      fontWeight: 'bold',
    },
    '& th, & td': {
      'padding': '0.5em',
      '&.status': {
        width: '2em',
      },
      '&.domain': {
        width: '16em',
      },
      '&.type': {
        width: '7em',
      },
    },
    '& tbody': {
      '& td': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontFamily: 'monospace',
      },
    },
  },
})

const DnsRecordTable = ({records}) => {
  const realRecords = (records || [null])
  const classes = useStyles()
  const {t} = useTranslation(['app-pages'])

  return (
    <table className={classes.dnsRecordTable}>
      <thead>
        <tr>
          <th className='status' />
          <th className='domain'>
            {t('project_dashboard_page.domain_setup.column_header.domain')}
          </th>
          <th>
            {t('project_dashboard_page.domain_setup.column_header.host')}
          </th>
          <th className='type'>
            {t('project_dashboard_page.domain_setup.column_header.record_type')}
          </th>
          <th>{t('project_dashboard_page.domain_setup.column_header.value')}</th>
        </tr>
      </thead>
      <tbody>
        {realRecords.map((record, i) => <RecordRow key={`${record}${i}`} record={record} />)}
      </tbody>
    </table>
  )
}

export default DnsRecordTable
