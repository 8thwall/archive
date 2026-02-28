import React from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {getPlanTypeForAccountType} from '../../shared/account-utils'
import {SpaceBetween} from '../ui/layout/space-between'
import {StandardContainer} from '../ui/components/standard-container'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import AutoHeading from '../widgets/auto-heading'
import {Icon} from '../ui/components/icon'
import {Badge} from '../ui/components/badge'
import {StandardLink} from '../ui/components/standard-link'

const PLAN_TYPE = 'WebEnterprise'

const useStyles = createUseStyles({
  heading: {
    margin: '0 !important',
  },
  subHeading: {
    fontSize: '1.25em',
    margin: '0 !important',
  },
})

const EnterprisePlan: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()

  return (
    <AutoHeadingScope>
      <StandardContainer padding='large'>
        <SpaceBetween between centered>
          <SpaceBetween direction='vertical' extraWide>
            <AutoHeading className={classes.heading}>{
            getPlanTypeForAccountType(PLAN_TYPE).toUpperCase()}
            </AutoHeading>
            <AutoHeading className={classes.subHeading}>{
            t('plan_billing_page.enterprise_plan.description')}
            </AutoHeading>
            <p>
              <Trans
                ns='account-pages'
                i18nKey='plan_billing_page.enterprise_plan.licenses_included_contract'
                components={{
                  1: <br />,
                  2: <StandardLink newTab href='https://www.8thwall.com/licensing' />,
                }}
              />
            </p>
          </SpaceBetween>
          <Badge color='mint' height='small'>
            <Icon stroke='checkmark' />
            {t('plan_billing_page.enterprise_plan.label.current_plan')}
          </Badge>
        </SpaceBetween>
      </StandardContainer>
    </AutoHeadingScope>
  )
}

export default EnterprisePlan
