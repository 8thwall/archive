import * as React from 'react'
import {Icon} from 'semantic-ui-react'

import {getSelectedAccountField, getSelectedAccount} from '../accounts/account-select'
import {InlineMessage} from '../uiWidgets/messages'
import '../static/styles/violation-notice.scss'
import {connect} from '../common/connect'

// TODO (john): Language used here needs to be Jen/Erik approved.
const formatViolationType = (type) => {
  switch (type) {
    case 'InappropriateContent':
      return 'inappropriate content'
    case 'PaymentFailed':
      return 'failing to make an expected payment'
    case 'LicenseMisuse':
      return 'abusing license agreement terms'
    case 'RegionRestriction':
      return 'being in an unsupported region. 8th Wall is currently not available in your region'
    default:
      throw new Error(`Invalid violation type: ${type}`)
  }
}

const violationsToString = (violationTypes, objectFlagged) => {
  const numberOfViolations = violationTypes.length
  const reasonsForViolation = []
  if (numberOfViolations === 1) {
    reasonsForViolation.push(formatViolationType(violationTypes[0]))
  } else {
    violationTypes.forEach((type, index) => {
      const formattedType = formatViolationType(type)
      if (index === numberOfViolations - 1) {
        reasonsForViolation.push(`and ${formattedType}`)
      } else {
        reasonsForViolation.push(`${formattedType}, `)
      }
    })
  }
  const violationString = reasonsForViolation.join('')
  return `We've flagged ${objectFlagged} for ${violationString}. Please contact support@8thwall.com for further steps.`
}

const ViolationNotice = ({accountViolationStatus, apps, account}) => {
  const violationApps = apps ? apps.filter(a => a.violationStatus === 'Violation') : []
  if (accountViolationStatus !== 'Violation' && violationApps.length === 0) {
    return null
  }

  let message
  if (accountViolationStatus === 'Violation') {
    // We need to get the unique violations of the account, coming from props,
    // located at account.PolicyVioaltions
    const activeViolations = account.PolicyViolations.filter(v => v.status === 'Violation')
    message = violationsToString([...new Set(activeViolations.map(v => v.violationType))], 'your account')
  } else if (violationApps.length === 1) {
    // We need to get the unique violations of the account's only violating app,
    // which has a .PolicyViolations field
    const activeViolations = violationApps[0].PolicyViolations.filter(v => v.status === 'Violation')
    message = violationsToString([...new Set(activeViolations.map(v => v.violationType))], 'one of your apps')
  } else {
    // Separate out logic for getting the unique PolicyViolations into many steps.
    const violations = new Set()
    violationApps.forEach((app) => {
      const activeViolations = app.PolicyViolations.filter(v => v.status === 'Violation')
      activeViolations.forEach(policyViolation => violations.add(policyViolation.violationType))
    })
    message = violationsToString([...violations], 'more than one of your apps')
  }

  return (
    <InlineMessage error className='violation-notice'>
      <Icon name='exclamation circle' />{message}
    </InlineMessage>
  )
}

export default connect(state => ({
  accountViolationStatus: getSelectedAccountField(state, 'violationStatus'),
  account: getSelectedAccount(state),
  apps: state.apps,
}))(ViolationNotice)
