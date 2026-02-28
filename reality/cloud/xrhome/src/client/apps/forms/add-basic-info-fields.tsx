import * as React from 'react'
import {useTranslation} from 'react-i18next'

import ProjectUrlField from './project-url-field'
import useTextStyles from '../../styles/text-styles'
import type {IApp, IPublicApp} from '../../common/types/models'
import useCurrentAccount from '../../common/use-current-account'
import {isEntryWebAccount} from '../../../shared/account-utils'
import {ProjectChooseHostingType} from './project-choose-hosting-type'
import {isWebAccount} from '../../../shared/account-utils'
import {
  FTUE_SAMPLE_PROJECTS,
} from '../../home/first-time-user-experience/first-time-user-constants'
import {StaticBanner} from '../../ui/components/banner'
import {useSelector} from '../../hooks'
import {withAppsLoaded} from '../../common/with-state-loaded'

interface IAddBasicInfoFields {
  onChange: Function
  basicInfo: Partial<IApp>
  fromApp: IApp | IPublicApp
}

const AddBasicInfoFields: React.FunctionComponent<IAddBasicInfoFields> = ({
  onChange, basicInfo, fromApp,
}) => {
  const {t} = useTranslation(['app-pages'])
  const account = useCurrentAccount()

  // Disable and set URL name if app belongs to the FTUE list
  const isFTUEAppField = !!FTUE_SAMPLE_PROJECTS.find(app => app.uuid === fromApp?.uuid)
  const apps = useSelector(state => state.apps)

  React.useEffect(() => {
    if (isFTUEAppField) {
      let generatedShortName = fromApp.appName
      let index = 1
      const isAppNameTaken = name => apps?.find(a => a.appName === name)
      while (isAppNameTaken(generatedShortName)) {
        generatedShortName = `${fromApp.appName}-${index}`
        index++
      }
      const newState = {...basicInfo}
      newState.appName = generatedShortName
      onChange(newState)
    }
  }, [fromApp])

  const onTextFieldChange = (e) => {
    const {name, value} = e.target
    const newState = {...basicInfo}
    newState[name] = value
    onChange(newState)
  }
  const onHostingChange = (value) => {
    const newState = {...basicInfo}
    newState.hostingType = value
    onChange(newState)
  }

  const showLabel = basicInfo.hostingType === 'CLOUD_EDITOR' ||
    basicInfo.hostingType === 'CLOUD_STUDIO' ||
    (!fromApp && basicInfo.hostingType !== 'SELF')
  const textStyles = useTextStyles()

  const showProjectHostingCards = isWebAccount(account) && !fromApp

  return (
    <>
      {showProjectHostingCards && <ProjectChooseHostingType
        onOptionClick={onHostingChange}
        selectedOption={basicInfo.hostingType}
        fromApp={fromApp}
      />}
      {isFTUEAppField &&
        <StaticBanner type='info'>
          {t('create_project_page.add_basic_info_fields.ftue_app_warning')}
        </StaticBanner>
      }
      <h3 className={textStyles.miniHeading}>
        {showLabel
          ? t('create_project_page.add_basic_info_fields.heading.project_url')
          : t('create_project_page.add_basic_info_fields.heading.project_name')
        }
        {isEntryWebAccount(account) && <span className={textStyles.requiredField}> *</span>}
      </h3>
      <ProjectUrlField
        value={basicInfo.appName}
        onChange={onTextFieldChange}
        showLabel={showLabel && !isFTUEAppField}
        isFTUEAppField={isFTUEAppField}
      />
    </>
  )
}

export default withAppsLoaded(AddBasicInfoFields)
