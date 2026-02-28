import React from 'react'

import {MarkdownFilePage} from './markdown-file-page'
import openSourceLicenseMd from '../i18n/en-US/legal/open-source-licenses.md'

const OpenSourceLicensesPage = () => {
  // eslint-disable-next-line local-rules/hardcoded-copy
  const privacyPageHeader = 'Open Source Licenses'

  return (
    <MarkdownFilePage
      markdownSource={openSourceLicenseMd as unknown as string}
      header={privacyPageHeader}
      title={privacyPageHeader}
    />
  )
}

export default OpenSourceLicensesPage
