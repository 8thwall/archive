import React from 'react'
import {useTranslation} from 'react-i18next'

import LinkOut from '../../uiWidgets/link-out'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import {Icon} from '../../ui/components/icon'
import type {UiTheme} from '../../ui/theme'

const useStyles = createCustomUseStyles<{left: string}>()((theme: UiTheme) => ({
  container: {
    position: 'absolute',
    bottom: '0',
    left: ({left}) => left,
  },
  linkOut: {
    'color': theme.fgMuted,
    'fontWeight': '700',
    'cursor': 'pointer',
    'fontSize': '14px',
    '& i': {
      color: 'inherit',
    },
    '&:hover': {
      color: theme.fgMain,
    },
  },
}))

type ReportType = 'project' | 'profile'
interface IReportPageCta {
  className?: string
  pageName: ReportType
  left?: string
}

const ReportPageCta: React.FunctionComponent<IReportPageCta> = ({
  className = '', pageName, left = '0',
}) => {
  const {t} = useTranslation(['public-featured-pages'])
  const url = typeof window !== 'undefined' ? window.location?.href : ''
  // TODO(kim): Fix when BuildIf.DISCOVERY_POLISH_PROJECT_LIBRARY_20220120 is deleted
  const {linkOut} = useStyles({left})
  const encodedSubject = encodeURIComponent(t('report_page_cta.encoded_subject', {url}))
  const encodedBody = encodeURIComponent(t('report_page_cta.encoded_body', {url}))
  const mailLink = `mailto:support@8thwall.com?subject=${encodedSubject}&body=${encodedBody}`

  return (
    <div className={className}>
      <LinkOut
        className={linkOut}
        url={mailLink}
      >
        <Icon stroke='flagOutline' inline />
        {t(`report_cta.${pageName}.link`)}
      </LinkOut>
    </div>
  )
}

export default ReportPageCta
