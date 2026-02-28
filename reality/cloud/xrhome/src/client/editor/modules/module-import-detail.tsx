import React from 'react'

import {LoadingImage} from '../../uiWidgets/loading-image'
import type {ModuleTarget, ModuleVersionTarget} from '../../../shared/module/module-target'
import {mobileViewOverride, tinyViewOverride, bodySanSerif} from '../../static/styles/settings'
import icons from '../../apps/icons'
import {combine} from '../../common/styles'
import {createThemedStyles} from '../../ui/theme'
import {deriveModuleCoverImageUrl} from '../../../shared/module-cover-image'
import {sanitizeAlias} from './sanitize-alias'
import {useSelector} from '../../hooks'
import AutoHeading from '../../widgets/auto-heading'
import AutoHeadingScope from '../../widgets/auto-heading-scope'
import ProfileAvatarBlock from '../../browse/widgets/profile-avatar-block'
import moduleActions from '../../modules/actions'
import useActions from '../../common/use-actions'
import type {ModulePublicDetail} from '../../modules/module-public-detail'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'
import {WhatsNew} from './whats-new-display'
import FeaturedDescriptionRenderer from '../../apps/widgets/featured-description-renderer'
import {updateVersionTarget} from '../../../shared/module/update-version-target'
import {ModuleActionsContext} from './module-actions-context'
import FeaturedVideoDisplay from '../../browse/featured-video-display'
import {useDependencyContext} from '../dependency-context'
import ModuleFeaturedImageCarousel from '../../browse/module-featured-image-carousel'
import {Loader} from '../../ui/components/loader'

const mediumViewOverride = '@media (max-width: 991px)'

const useStyles = createThemedStyles(theme => ({
  breadcrumb: {
    'padding': '2rem 3rem 0 3rem',
    'display': 'flex',
    'width': '100%',
    'gap': '0.5em',
    'font-family': bodySanSerif,
    'align-items': 'center',
    [mobileViewOverride]: {
      'padding-right': '4rem',
    },
    [tinyViewOverride]: {
      'padding-right': '3rem',
    },
  },
  separator: {
    'transform': 'rotate(270deg)',
    'align-self': 'center',
    'height': '10px',
  },
  previousCrumb: {
    'font-family': bodySanSerif,
    'background': 'none !important',
    'border': 'none',
    'padding': '0 !important',
    'color': theme.fgMuted,
    'text-decoration': 'none',
    'cursor': 'pointer',
  },
  activeCrumb: {
    'color': theme.fgMain,
    'white-space': 'nowrap',
    'overflow': 'hidden',
    'text-overflow': 'ellipsis',
  },
  metaDataContainer: {
    'display': 'flex',
    'flex-direction': 'row',
    'align-items': 'center',
    'margin': '2.2em 0',
    'gap': '1em',
    [mediumViewOverride]: {
      'flex-direction': 'column',
      'align-items': 'flex-start',
    },
    [mobileViewOverride]: {
      'padding-right': '54px',
    },
    [tinyViewOverride]: {
      'padding-right': '38px',
    },
  },
  actions: {
    'display': 'flex',
    'gap': '2rem',
  },
  moduleImportDetail: {
    'display': 'flex',
    'flex-direction': 'column',
    'padding': '0 3rem 2rem 3rem',
    'column-gap': '2rem',
    'row-gap': '2rem',
    'height': 'calc(100% - 4rem)',
    'overflow-y': 'auto',
    '&::-webkit-scrollbar': {
      'width': '6px',
      'border-radius': '4px',
    },
    '&::-webkit-scrollbar-track': {
      'background': theme.scrollbarTrackBackground,
      'border-radius': '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      'background-color': theme.scrollbarThumbColor,
      'border-radius': '20px',
      'border': `1px solid ${theme.scrollbarThumbColor}`,
    },
  },
  image: {
    'height': '100%',
    'max-width': '400px',
    'border-radius': '0.5rem',
    [mediumViewOverride]: {
      'width': '100%',
      'max-width': '551px',
    },
  },
  info: {
    'display': 'grid',
    'gap': '1rem',
    'justify-content': 'flex-start',
  },
  button: {
    'background-color': 'transparent',
    'color': theme.secondaryBtnColor,
    'font-weight': '600',
    'padding': '.6rem 4rem',
    'border': theme.secondaryBtnBorder,
    'border-radius': '.5rem',
    'font-family': 'inherit',
    'cursor': 'pointer',

    '&:hover:enabled': {
      'background-color': theme.secondaryBtnHoverBg,
    },
  },
  primary: {
    'background-color': theme.primaryBtnBg,
    'border': 'none',
    'color': theme.primaryBtnFg,

    '&:hover:enabled': {
      'background-color': theme.primaryBtnHoverBg,
    },
    '&:disabled': {
      'opacity': '0.33',
    },
  },
  alias: {
    'color': theme.fgMuted,
    'font-style': 'italic',
  },
  content: {
    'display': 'flex',
    'flex-direction': 'column',
    'gap': '2rem',
  },
}))

const getImportTarget = (isPrivate: boolean, recentPatch: ModuleVersionTarget): ModuleTarget => {
  if (isPrivate) {
    return {type: 'branch', branch: 'master'}
  }

  // Since we want the initial pinning to be "Allow minor updates", we unfreeze from a patch-level
  // target to a major-level target, allowing minor updates.
  return recentPatch && updateVersionTarget(recentPatch, 'major')
}

interface IModuleImportDetail {
  moduleUuid: string
  currentTab: string
  onClose: () => void
  onCancel: () => void
  isPrivate?: boolean
}

const ModuleImportDetail: React.FC<IModuleImportDetail> = ({
  moduleUuid, onClose, onCancel, currentTab, isPrivate,
}) => {
  const classes = useStyles()
  const {addDependency} = React.useContext(ModuleActionsContext)
  const privateModule = useSelector(s => s.modules.entities?.[moduleUuid])
  const [publicDetail, setPublicDetail] = React.useState<ModulePublicDetail>()
  const module = isPrivate ? privateModule : publicDetail?.module
  const account = useSelector(
    state => state.accounts.allAccounts.find(a => a.uuid === module?.AccountUuid)
  ) || publicDetail?.account
  const thumbnailSrc = deriveModuleCoverImageUrl(module)
  const sanitizedAlias = module && sanitizeAlias(module?.name)
  const {fetchPublicModuleDetail, loadModuleFeaturedDescription} = useActions(moduleActions)
  const [featuredDescriptionText, setFeaturedDescriptionText] = React.useState('')
  const whatsNew = publicDetail?.recentVersion

  const dependencyContext = useDependencyContext()
  const isAlreadyImported = !!dependencyContext.aliasToPath[sanitizedAlias] ||
    !!dependencyContext.moduleIdToAlias[moduleUuid]

  const importTarget = getImportTarget(isPrivate, publicDetail?.recentVersion?.patchTarget)

  const onModuleImportSubmit = (e) => {
    e.preventDefault()
    addDependency(
      module.uuid,
      importTarget,
      sanitizedAlias
    )
    onClose()
  }

  useAbandonableEffect(async (abandonable) => {
    if (!isPrivate) {
      setPublicDetail(await abandonable(fetchPublicModuleDetail(moduleUuid)))
    }
  }, [moduleUuid, isPrivate])

  useAbandonableEffect(async (abandonable) => {
    if (!isPrivate) {
      setFeaturedDescriptionText(await abandonable(loadModuleFeaturedDescription(module)))
    }
  }, [module, isPrivate])

  if (!module) {
    return <Loader />
  }

  return (
    <AutoHeadingScope>
      <div className={classes.breadcrumb}>
        <button type='button' className={classes.previousCrumb} onClick={onCancel}>
          {currentTab}
        </button>
        <img
          className={classes.separator}
          src={icons.chevron}
          alt=''
        />
        <span className={classes.activeCrumb}>{module.title || module.name}</span>
      </div>
      <form className={classes.moduleImportDetail} onSubmit={onModuleImportSubmit}>
        <section className={classes.metaDataContainer}>
          <LoadingImage src={thumbnailSrc} alt={`${module.name}`} className={classes.image} />
          <div className={classes.info}>
            <AutoHeading>
              {module.title}
            </AutoHeading>
            {account && <ProfileAvatarBlock hideImage={false} account={account} />}
            <div className={classes.actions}>
              <button
                type='submit'
                className={combine(classes.button, classes.primary)}
                disabled={!importTarget || isAlreadyImported}
              >
                Import
              </button>
            </div>
            <div className={classes.alias}>
              Alias: {sanitizedAlias}
            </div>
          </div>
        </section>
        <section className={classes.content}>
          {(isPrivate || !featuredDescriptionText) &&
            <div>
              {module.description}
            </div>
          }
          {!isPrivate &&
            <>
              {featuredDescriptionText &&
                <FeaturedDescriptionRenderer source={featuredDescriptionText} isModuleOverview />
              }
              <FeaturedVideoDisplay featuredVideoUrl={module.featuredVideoUrl} />
              {publicDetail?.featuredImages.length > 0 &&
                <ModuleFeaturedImageCarousel featuredImages={publicDetail.featuredImages} />
              }
              {whatsNew
                ? <WhatsNew recentVersion={whatsNew} />
                : 'No published version for this module.'
              }
            </>
          }
        </section>
      </form>
    </AutoHeadingScope>
  )
}

export {ModuleImportDetail}
