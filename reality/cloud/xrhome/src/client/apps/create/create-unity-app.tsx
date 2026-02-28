/* eslint-disable local-rules/hardcoded-copy */
import * as React from 'react'
import {Form, Header, Container} from 'semantic-ui-react'

import {PrimaryButton} from '../../ui/components/primary-button'
import CreateAppAccountSelect from './create-app-account-select'
import {Icon} from '../../ui/components/icon'

interface ICreateUnityApp {
  create: Function
}
class CreateUnityApp extends React.Component<ICreateUnityApp> {
  state = {appName: ''}

  handleSubmit = () => {
    this.props.create({...this.state, isWeb: false})
    this.setState({})
  }

  render = () => (
    <>
      <Header as='h2'>New Project</Header>
      <CreateAppAccountSelect />
      <Container className='content' fluid>
        <Form onSubmit={() => this.state.appName && this.handleSubmit()}>
          <p>
            Please enter the bundle identifier of the application you’ll be creating.
            A bundle identifier is typically written in reverse domain name notation and identifies your application in the app store.
            It should be unique.
          </p>
          <Form.Group>
            <Form.Field width={6} required>
              <label>Bundle Identifier</label>
              <Form.Input
                onChange={(_, {value}) => this.setState({appName: value})}
              >
                <input
                  pattern='^[a-zA-Z][a-zA-Z0-9_\.]*'
                  title='App bundle must start with a letter. It can only contain letters, numbers, ".", or "_".'
                  placeholder='com.company.application.v1'
                />
              </Form.Input>
            </Form.Field>
            <Form.Field>
              <label>&nbsp;</label>
              <PrimaryButton><Icon stroke='plus' /> Create</PrimaryButton>
            </Form.Field>
          </Form.Group>
        </Form>
      </Container>
    </>
  )
}
export default CreateUnityApp
