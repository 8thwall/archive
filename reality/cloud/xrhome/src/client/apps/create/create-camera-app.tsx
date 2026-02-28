import * as React from 'react'
import {withRouter} from 'react-router-dom'
import {Form, Header} from 'semantic-ui-react'

import {isOkAppName} from '../../../shared/app-utils'
import actions from '../apps-actions'
import {getPathForApp, getRouteAccount} from '../../common/paths'
import type {IAccount} from '../../common/types/models'
import CreateAppAccountSelect from './create-app-account-select'
import {connect} from '../../common/connect'

interface CICreateCameraApp {
  account: IAccount
  newApp: Function
  history: any
}

const CreateCameraApp: React.FunctionComponent<CICreateCameraApp> = ({account, newApp, history}) => {
  const [appName, setAppName] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onChange = (e) => {
    setAppName(e.target.value)
  }

  const onSubmit = () => {
    if (!isOkAppName(appName)) {
      return
    }

    setLoading(true)
    newApp({
      appName,
      isWeb: true,
      isCamera: true,
    }).then(
      app => history.push(getPathForApp(account, app))
    ).catch(e => setLoading(false))
  }

  return (
    <>
      <Header as='h2'>New Project</Header>
      <CreateAppAccountSelect />
      <Form onSubmit={onSubmit}>
        <Form.Field required>
          <label>Camera Name</label>
          <p>
            Your camera name must be between 4 and 128 characters in length and should be descriptive.
            It can only include lowercase letters, numbers, and &quot;-&quot;.
          </p>
          <input placeholder='camera-name' value={appName} onChange={onChange} />
        </Form.Field>
        <Form.Button primary loading={loading} disabled={!isOkAppName(appName)}>
          Create
        </Form.Button>
      </Form>
    </>
  )
}

// @ts-expect-error LEGACY_TS_ERRORS
export default withRouter(connect((state, props) => ({
  // @ts-expect-error LEGACY_TS_ERRORS
  account: getRouteAccount(state, props.match),
  // @ts-expect-error LEGACY_TS_ERRORS
}), actions)(CreateCameraApp))
