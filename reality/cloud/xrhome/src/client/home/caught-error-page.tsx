import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {headerSanSerif, mobileViewOverride} from '../static/styles/settings'
import NarrowPage from '../user/sign-up/narrow-page'
import {PrimaryButton} from '../ui/components/primary-button'
import {SpaceBetween} from '../ui/layout/space-between'
import CopyableBlock from '../widgets/copyable-block'

interface ICaughtErrorPage {
  onReset: () => void
  error: Error
}

const useStyles = createUseStyles({
  headingText: {
    fontWeight: 900,
    fontFamily: headerSanSerif,
    fontSize: '2.25em',
    lineHeight: '1.25em',
    marginBottom: '0.5em',
    [mobileViewOverride]: {
      fontSize: '2.5em',
    },
  },
  details: {
    marginTop: '1em',
  },
})

const CaughtErrorPage: React.FC<ICaughtErrorPage> = ({error, onReset}) => {
  const {t} = useTranslation(['caught-error-page', 'common'])

  const classes = useStyles()

  return (
    <NarrowPage>
      <SpaceBetween direction='vertical'>
        <h1 className={classes.headingText}>
          {t('caught_error_page.heading')}
        </h1>
        <p>
          <Trans
            ns='caught-error-page'
            i18nKey='caught_error_page.description'
            components={{
              supportLink: <a href='mailto:support@8thwall.com'>1</a>,
            }}
          />
        </p>

        <div>
          <PrimaryButton onClick={onReset}>{t('button.back', {ns: 'common'})}</PrimaryButton>
        </div>

        <details className={classes.details}>
          <summary>{t('caught_error_page.button.show_details')}</summary>
          <p>
            {t('caught_error_page.client_version.label')} {Build8.VERSION_ID}
          </p>
          <CopyableBlock description='' text={String(error.stack)} />
        </details>
      </SpaceBetween>
    </NarrowPage>
  )
}

export default CaughtErrorPage
