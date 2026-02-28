import * as React from 'react'
import {useTranslation} from 'react-i18next'

import {gray5} from '../static/styles/settings'
import SpaceBelow from '../ui/layout/space-below'
import {SpaceBetween} from '../ui/layout/space-between'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  footerLinks: {
    '& a': {
      'color': theme.fgMuted,
      'textDecoration': 'underline',
      '&:hover': {
        color: gray5,
      },
    },
  },
}))

const PageFooterIdentity: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['navigation'])

  return (
    <footer className='section centered'>
      <SpaceBelow>
        <SpaceBetween direction='vertical' wide centered justifyCenter>
          <div className={classes.footerLinks}>
            <SpaceBetween centered justifyCenter>
              <a href='https://www.8thwall.com/terms'>{t('page_footer.terms_and_conditions')}</a>
              <a href='https://www.8thwall.com/privacy'>{t('page_footer.privacy')}</a>
              <a href='https://www.8thwall.com/copyright-dispute-policy'>
                {t('page_footer.copyright_dispute_policy')}
              </a>
              <a href='https://www.8thwall.com/guidelines'>{t('page_footer.content_guidelines')}</a>
            </SpaceBetween>
          </div>
        </SpaceBetween>
      </SpaceBelow>
    </footer>
  )
}

export {
  PageFooterIdentity,
}
