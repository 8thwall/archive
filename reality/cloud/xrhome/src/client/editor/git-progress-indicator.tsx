import * as React from 'react'
import {Progress} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {gitLoadProgress} from './git-load-progress'

interface IGitProgressIndicator {
  status: string
}

const GitProgressIndicator: React.FunctionComponent<IGitProgressIndicator> =
  ({status}) => {
    const {t} = useTranslation(['cloud-editor-pages'])
    const msg = gitLoadProgress[status] || {}
    return (
      <div className='loading-progress'>
        <div className='progress-message'>
          {t(msg.message)}
        </div>
        <Progress percent={Math.floor(msg.progress * 100)} size='small' progress color='purple' />
      </div>
    )
  }

export default GitProgressIndicator
