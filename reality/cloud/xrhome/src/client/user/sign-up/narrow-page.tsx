/* eslint-disable quote-props */
import React from 'react'
import {createUseStyles} from 'react-jss'

import Page from '../../widgets/page'
import {mobileViewOverride, tinyViewOverride} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import HangingLogo from './hanging-logo'

interface INarrowPage {
  title?: string
  commonPrefixed?: boolean
  description?: string
  className?: string
  hasHeader?: boolean
  hasFooter?: boolean
  children?: React.ReactNode
}

const useStyles = createUseStyles({
  narrowPage: {
    '& .page-content': {
      '--page-left-margin': '300px',
      '--page-right-margin': '300px',
      maxWidth: '40em',
      width: 'calc(100% - var(--page-left-margin) - var(--page-right-margin))',
      marginTop: '3em',
      marginLeft: 'var(--page-left-margin)',
      marginRight: 'var(--page-right-margin)',
      position: 'relative',
      [mobileViewOverride]: {
        '--page-left-margin': '200px',
        '--page-right-margin': '1rem',
      },
      [tinyViewOverride]: {
        margin: '1em 2em',
        width: 'auto',
        '--page-left-margin': '1rem',
      },
    },
  },
})

const NarrowPage: React.FunctionComponent<INarrowPage> = ({
  title, commonPrefixed, description, className, children, hasHeader = false, hasFooter = true,
}) => {
  const classes = useStyles()

  return (
    <Page
      title={title}
      commonPrefixed={commonPrefixed}
      description={description}
      className={combine(classes.narrowPage, className)}
      centered={false}
      hasFooter={hasFooter}
      hasHeader={hasHeader}
    >
      {!hasHeader && <HangingLogo />}
      {children}
    </Page>
  )
}
export default NarrowPage
