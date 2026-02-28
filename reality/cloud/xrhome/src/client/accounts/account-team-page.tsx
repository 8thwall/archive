import * as React from 'react'

import {withTeamLoaded} from '../common/with-state-loaded'
import Page from '../widgets/page'
import TeamPage from '../team/team-page'

export default withTeamLoaded(() => (
  <Page headerVariant='workspace'>
    <TeamPage />
  </Page>
))
