import React from 'react'
import {useTranslation} from 'react-i18next'

import AssetLabContainer from './asset-lab-container'
import Title from '../widgets/title'
import {UiThemeProvider} from '../ui/theme'
import {AssetLabStateContextProvider} from './asset-lab-context'

const AssetLabModal = () => {
  const {t} = useTranslation(['asset-lab'])
  return (
    <>
      <Title>{t('asset_lab.page_title')}</Title>
      <UiThemeProvider mode='dark'>
        <AssetLabStateContextProvider>
          <AssetLabContainer />
        </AssetLabStateContextProvider>
      </UiThemeProvider>
    </>
  )
}

export default AssetLabModal
