import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link, useLocation} from 'react-router-dom'

import {tinyViewOverride} from '../static/styles/settings'
import {combine} from '../common/styles'
import {SpaceBetween} from '../ui/layout/space-between'
import {MODULE_LIBRARY_PATH, PROJECT_LIBRARY_PATH} from '../common/paths'
import ProjectIcon from './project-icon'
import ProjectModulesIcon from '../apps/widgets/project-modules-icon'
import {createThemedStyles, useUiTheme} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  activeLink: {
    border: `1px solid ${theme.linkBtnFg}`,
    boxShadow: `0px 0px 20px ${theme.linkBtnFg}40`,
    color: `${theme.linkBtnFg} !important`,
  },
  link: {
    display: 'flex',
    width: '200px',
    height: '67px',
    borderRadius: '100px',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '18px',
    color: theme.fgMuted,
    boxSizing: 'border-box',
    border: `1px solid ${theme.fgMuted}`,
    [tinyViewOverride]: {
      width: '160px',
      height: '60px',
    },
  },
  linkArea: {
    display: 'flex',
    gap: '1.5rem',
    margin: '1.5rem',
    [tinyViewOverride]: {
      margin: '0rem',
      gap: '1rem',
    },
  },
  moduleIcon: {
    width: '30px',
    height: '30px',
    color: theme.linkBtnDisableFg,
  },
  enabledIconColor: {
    color: theme.linkBtnFg,
  },
}))

const ProjectModuleLibraryLinks: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const onProjectPage = useLocation().pathname === PROJECT_LIBRARY_PATH
  const theme = useUiTheme()

  return (
    <div className={classes.linkArea}>
      <Link
        className={combine(onProjectPage && classes.activeLink, classes.link)}
        to={PROJECT_LIBRARY_PATH}
      >
        <SpaceBetween narrow centered>
          <ProjectIcon color={onProjectPage ? theme.linkBtnFg : theme.linkBtnDisableFg} />
          {t('project_module_library_links.projects')}
        </SpaceBetween>
      </Link>
      <Link
        className={combine(!onProjectPage && classes.activeLink, classes.link)}
        to={MODULE_LIBRARY_PATH}
      >
        <SpaceBetween narrow centered>
          <ProjectModulesIcon
            className={combine(!onProjectPage && classes.enabledIconColor, classes.moduleIcon)}
          />
          {t('project_module_library_links.modules')}
        </SpaceBetween>
      </Link>
    </div>
  )
}

export {
  ProjectModuleLibraryLinks,
}
