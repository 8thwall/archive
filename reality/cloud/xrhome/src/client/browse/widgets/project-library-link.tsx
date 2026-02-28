import * as React from 'react'
import {join} from 'path'
import {Link} from 'react-router-dom'
import {createUseStyles} from 'react-jss'

import {useTranslation} from 'react-i18next'

import {getRootPath} from '../../common/paths'
import {bodySanSerif, brandWhite, gray3} from '../../static/styles/settings'
import Icons from '../../apps/icons'

const useStyles = createUseStyles({
  projectLibraryLink: {
    display: 'flex',
    gap: '0.5em',
    alignItems: 'center',
  },
  projectLibraryImgWrapper: {
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: brandWhite,
    border: `solid 1px ${gray3}`,
    borderRadius: '50%',
  },
  projectLibraryTitle: {
    fontFamily: bodySanSerif,
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.25em',
  },
})

interface IProjectLibraryLink {
  tab?: 'projects' | 'modules'
}

const ProjectLibraryLink: React.FC<IProjectLibraryLink> = ({tab = 'projects'}) => {
  const classes = useStyles()

  const {t} = useTranslation(['public-featured-pages'])

  const projectLibraryUrl = join(getRootPath(), tab)
  return (
    <Link className={classes.projectLibraryLink} to={projectLibraryUrl}>
      <div className={classes.projectLibraryImgWrapper}>
        <img
          src={Icons.codeHubRocket}
          alt='Project Library Icon'
          width='12px'
          height='12px'
        />
      </div>
      <div className={classes.projectLibraryTitle}>
        {t('featured_app_page.redirect.project_library')}
      </div>
    </Link>
  )
}

export default ProjectLibraryLink
