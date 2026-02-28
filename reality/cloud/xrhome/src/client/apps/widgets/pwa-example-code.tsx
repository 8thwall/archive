import * as React from 'react'
import {useTranslation} from 'react-i18next'

import {Segment, Message} from 'semantic-ui-react'

const PwaExampleCode: React.FunctionComponent = () => {
  const {t} = useTranslation(['app-pages'])

  const EXAMPLE_CODE = (
    `// ${t('project_settings_page.pwa_example_code.step_1_paste_head')}
<meta name="8thwall:package" content="@8thwall.xrextras">

// ${t('project_settings_page.pwa_example_code.step_2_paste_appjs')}
XR8.addCameraPipelineModules([
  ...
  XRExtras.PwaInstaller.pipelineModule(),
  ...
])

// ${t('project_settings_page.pwa_example_code.step_3_paste_body')}
<a-scene
  ...
  xrextras-pwa-installer
  xrweb>
`)

  return (
    <Segment className='pwa-example-code'>
      <Message info>
        <Message.Header>
          {t('project_settings_page.pwa_example_code.message.header')}
        </Message.Header>
      </Message>
      <p className='code-example'>{EXAMPLE_CODE}</p>
    </Segment>
  )
}

export default PwaExampleCode
