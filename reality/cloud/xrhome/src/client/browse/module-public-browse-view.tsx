import * as React from 'react'
import {Redirect, useParams} from 'react-router-dom'
import type {DeepReadonly} from 'ts-essentials'

import {useTranslation} from 'react-i18next'

import {is8thWallAccountUuid} from '../../shared/account-utils'
import type {IPublicModule} from '../common/types/models'
import {tinyViewOverride} from '../static/styles/settings'
import BrowseLink from './widgets/browse-link'
import {getPublicPathForModule} from '../common/paths'
import {combine} from '../common/styles'
import {deriveModuleCoverImageUrl} from '../../shared/module-cover-image'
import ReportPageCta from './widgets/report-page-cta'
import ModuleInfoCard from './module-info-card'
import {StaticBanner} from '../ui/components/banner'
import ModuleFeaturedImageCarousel from './module-featured-image-carousel'
import FileBrowseContext from './file-browse-context'
import {useSelector} from '../hooks'
import type {VersionInfo} from '../../shared/module/module-target-api'
import ProjectLibraryLink from './widgets/project-library-link'
import FileBrowseView from './file-browse-view'
import {ModuleReleaseNotes} from '../modules/module-release-notes'
import {FreeformMarkdownPreview} from '../widgets/freeform-markdown-preview'
import FeaturedDescriptionDisplay from './featured-description-display'
import FeaturedVideoDisplay from './featured-video-display'
import {isValidVideoUrl} from '../../shared/featured-video'
import type {PublicBrowsePageParams} from '../app-switch'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  moduleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  coverImage: {
    [tinyViewOverride]: {
      marginTop: '1.5em',
    },
  },
  activeLink: {
    borderBottom: `4px solid ${theme.badgePurpleColor} !important`,
  },
  childLink: {
    'padding': '0.25em 0',
    'color': `${theme.linkBtnFg} !important`,
    '&:hover': {
      color: `${theme.badgePurpleColor} !important`,
    },
  },
  linkContainer: {
    display: 'flex',
    gap: '1.25em',
  },
  moduleBrowse: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 0',
    gap: '2em',
    minWidth: '0',
  },
  moduleContent: {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'row',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  overview: {
    'display': 'flex',
    'flexDirection': 'column',
    'overflow': 'auto',
    'minHeight': '5em',
    'userSelect': 'text',
    '& img': {
      maxWidth: '100%',
    },
  },
}))

const SELECTABLE_VIEWS = ['', 'code', 'release-notes']

const DEFAULT_FILE_BROWSE_BRANCH = 'default'

const PATH_SEGMENT = 'code'

interface IModulePublicBrowseView {
  module: DeepReadonly<IPublicModule>
  accountUuid: string
  featuredDescriptionText: string
  versions: DeepReadonly<VersionInfo[]>
  latestVersion: VersionInfo
  useReadme: boolean
}

const ModulePublicBrowseView: React.FC<IModulePublicBrowseView> = ({
  module, accountUuid, featuredDescriptionText, versions, latestVersion, useReadme,
}) => {
  const classes = useStyles()

  const {t} = useTranslation(['public-featured-pages'])

  const account = useSelector(state => state.publicBrowse.Accounts[accountUuid])

  const {branch: selectedView = '', repoPath = ''} = useParams<PublicBrowsePageParams>()

  const hasVersions = versions.length !== 0
  const repoVisible = module.repoVisibility === 'PUBLIC' && latestVersion.license

  const redirectToOverview = !SELECTABLE_VIEWS.includes(selectedView) ||
                             (selectedView === 'code' && !repoVisible) ||
                             (selectedView === 'release-notes' && !hasVersions)

  if (redirectToOverview) {
    return <Redirect to={getPublicPathForModule(account, module.name)} />
  }

  // TODO(johnny): Update raw strings to i18n strings.
  const browseLinks = (
    <div className={classes.linkContainer}>
      <BrowseLink
        branch=''
        path='/'
        className={combine(selectedView === '' && classes.activeLink, classes.childLink)}
      >
        {t('featured_module_page.heading.overview')}
      </BrowseLink>
      {repoVisible &&
        <BrowseLink
          branch='code'
          path='/'
          className={combine(
            selectedView === 'code' && classes.activeLink, classes.childLink
          )}
        >
          {t('featured_module_page.heading.code')}
        </BrowseLink>
      }
      {hasVersions &&
        <BrowseLink
          branch='release-notes'
          path='/'
          className={combine(
            selectedView === 'release-notes' && classes.activeLink, classes.childLink
          )}
        >
          {t('featured_module_page.heading.release_notes')}
        </BrowseLink>
      }
    </div>
  )

  return (
    <div className='section centered'>
      <FileBrowseContext.Provider
        value={{
          appOrModuleUuid: module.uuid,
          rootName: module.name,
          commitHash: latestVersion.commitId,
          path: `/${repoPath}`,
          branch: DEFAULT_FILE_BROWSE_BRANCH,
          pathSegment: PATH_SEGMENT,
          routePrefix: getPublicPathForModule(account, module.name),
          isModule: true,
        }}
      >
        <div className={classes.moduleInfo}>
          {module.archived &&
            <StaticBanner
              type='warning'
              message={t('featured_module_page.warning.archived')}
            />}
          <ProjectLibraryLink tab='modules' />
          <div className={classes.moduleContent}>
            <div className={classes.moduleBrowse}>
              <div className={classes.coverImage}>
                <ModuleFeaturedImageCarousel
                  coverImageSrc={deriveModuleCoverImageUrl(module)}
                  featuredImages={module.FeaturedImages}
                />
              </div>
              <div>
                {browseLinks}
              </div>
              {!selectedView &&
                <div>
                  {featuredDescriptionText &&
                    <div className={classes.overview}>
                      {module.featuredVideoUrl && isValidVideoUrl(module.featuredVideoUrl) &&
                        <FeaturedVideoDisplay featuredVideoUrl={module.featuredVideoUrl} />
                      }
                      {useReadme
                        ? (
                          <FreeformMarkdownPreview>
                            {featuredDescriptionText}
                          </FreeformMarkdownPreview>
                        )
                        : (
                          <FeaturedDescriptionDisplay
                            featuredDescriptionText={featuredDescriptionText}
                            isModuleOverview
                          />
                        )
                      }
                    </div>
                  }
                </div>
              }
              {selectedView === 'code' &&
                <div>
                  <FileBrowseView />
                </div>
              }
              {selectedView === 'release-notes' &&
                <div>
                  {hasVersions &&
                    <ModuleReleaseNotes
                      versions={versions}
                    />
                  }
                </div>
             }
              {!is8thWallAccountUuid(account?.uuid) &&
                <ReportPageCta
                  left='calc(max(4rem, (100% - 70em)/2))'
                  pageName='project'
                />
              }
            </div>
            <ModuleInfoCard
              module={module}
              account={account}
              latestVersion={latestVersion}
            />
          </div>
        </div>
      </FileBrowseContext.Provider>
    </div>
  )
}

export default ModulePublicBrowseView
