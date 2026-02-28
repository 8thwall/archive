import * as React from 'react'
import {useTranslation} from 'react-i18next'

import {CampaignRedirectModal} from './campaign-redirect-modal'

const CampaignRedirectSection = ({app, updateApp}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const sectionContent = !app.campaignRedirectUrl
    ? (
      <p>{t('project_dashboard_page.redirect_url.warning.no_redirect')}</p>
    )
    : (
      <p>{app.campaignRedirectUrl}</p>
    )

  return (
    <>
      <p className='cam-section'>{t('project_dashboard_page.redirect_url.header')}</p>
      {sectionContent}
      <CampaignRedirectModal
        app={app}
        updateApp={updateApp}
        createTrigger={(handleOpen => (
          <p>
            <b>
              <a onClick={handleOpen}>{!app.campaignRedirectUrl
                ? t('project_dashboard_page.redirect_url.cta.set_a_url')
                : t('button.edit', {ns: 'common'})
            }
              </a>
            </b> {!app.campaignRedirectUrl &&
            t('project_dashboard_page.redirect_url.cta.set_a_url_continued')}
          </p>
        ))
        }
      />
    </>
  )
}

export {
  CampaignRedirectSection,
}
