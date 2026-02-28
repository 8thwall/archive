import {isEditorEnabled, isBasic, isStarter} from '../../shared/account-utils'
import {isCloudStudioApp} from '../../shared/app-utils'

const isPwaSettingsVisible = (account, app) => isEditorEnabled(account) &&
  app.hostingType !== 'SELF' && !isCloudStudioApp(app) &&
  !isBasic(account) && !isStarter(account)

export default isPwaSettingsVisible
