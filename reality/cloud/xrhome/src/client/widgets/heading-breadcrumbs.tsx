import React from 'react'
import {createUseStyles} from 'react-jss'
import {Link} from 'react-router-dom'

import {bool, combine} from '../common/styles'
import {brandWhite, gray4} from '../static/styles/settings'
import Title from './title'

interface ILink {
  path: string
  text: string
  key: string
}

interface IHeadingBreadcrumbs {
  title: string
  text?: string
  links: ILink[]
  className?: string
  divider?: string
  dark?: boolean
}

const useStyles = createUseStyles({
  breadCrumb: {
    'text-transform': 'none',
    'text-overflow': 'ellipsis',
    'overflow': 'hidden',
    'max-width': '60%',
    'white-space': 'nowrap',
    '& >*': {
      'padding': '0 0.5em',
    },
  },
  label: {
    'text-transform': 'uppercase',
    'font-weight': '300',
    'letter-spacing': '0.05em',
    'font-size': '0.9em',
    'color': gray4,
    'vertical-align': 'bottom',
  },
  pathText: {
    'font-weight': '400',
    '&:last-child': {
      'font-weight': '700',
    },
  },
  darkTheme: {
    'color': brandWhite,
    '& a': {
      'color': brandWhite,
    },
  },
  heading: {
    fontSize: '1.5rem',
  },
})

const HeadingBreadcrumbs = ({
  title, text, links, className = '', divider = '/', dark,
}: IHeadingBreadcrumbs) => {
  const {breadCrumb, heading, pathText, label, darkTheme} = useStyles()
  return (
    <div className={combine(heading, className)}>
      <Title>{title}</Title>
      <span className={label}>{text || title}</span>
      <span className={breadCrumb}>
        {links.map<React.ReactNode>(link => (
          <span className={combine(bool(dark, darkTheme), pathText)} key={link.key}>
            <Link to={link.path}>{link.text || 'NULL'}</Link>
          </span>
        )).reduce((prev, curr) => [prev, divider, curr])
        }
      </span>
    </div>
  )
}

export {
  HeadingBreadcrumbs as default,
}

export type {
  IHeadingBreadcrumbs,
}
