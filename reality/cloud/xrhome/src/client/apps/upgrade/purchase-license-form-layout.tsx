import React, {FC} from 'react'
import {Form, Header, Grid} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import useWebAppUpgradeStyles from './web-app-upgrade-jss'

interface IPurchaseLicenseFormLayout {
  children?: React.ReactNode
}

const PurchaseLicenseFormLayout: FC<IPurchaseLicenseFormLayout> = ({
  children,
}) => {
  const {t} = useTranslation(['app-pages'])
  const webAppUpgradeClasses = useWebAppUpgradeStyles()

  return (
    <>
      <Header as='h1'>
        {t('purchase_license_page.purchase_subscription_form_layout.heading')}
      </Header>
      <Grid className={webAppUpgradeClasses.hoveringPlanContainer} stackable>
        <Form className={webAppUpgradeClasses.upgradeForm}>
          {children}
        </Form>
      </Grid>
    </>
  )
}

export default PurchaseLicenseFormLayout
