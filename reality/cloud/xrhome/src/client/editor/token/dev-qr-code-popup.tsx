import React from 'react'
import {Icon} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useEffect} from 'react'
import {
  FloatingPortal, useFloating, offset, shift,
  useClick, useDismiss, useRole, useInteractions,
  Placement,
} from '@floating-ui/react'

import {Trans, useTranslation} from 'react-i18next'

import type {IApp} from '../../common/types/models'
import editorActions from '../editor-actions'
import '../../static/styles/code-editor.scss'
import useActions from '../../common/use-actions'
import {
  almostBlack, brandBlack, brandWhite, gray1, gray4, gray5, moonlight,
} from '../../static/styles/settings'
import {BasicQrCode} from '../../widgets/basic-qr-code'
import {useSelector} from '../../hooks'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {UiThemeProvider} from '../../ui/theme'
import hmdIcon from '../../static/icons/hmd-icon.svg'
import {useUserEditorSettings} from '../../user/use-user-editor-settings'
import {StandardInlineToggleField} from '../../ui/components/standard-inline-toggle-field'
import userActions from '../../user/user-actions'
import {useLinkSharing} from './use-link-sharing'
import {useDevToken} from './use-dev-token'
import {useAppPathsContext} from '../../common/app-container-context'
import {AppPathEnum} from '../../common/paths'
import {hexColorWithAlpha} from '../../../shared/colors'
import {getPathWithSession, openPreviewTab, openSimulatorWindow} from '../app-preview/open-window'
import {useSimulator, useSimulatorVisible} from '../app-preview/use-simulator-state'
import {actions as gitActions} from '../../git/git-actions'
import {useAppPreviewWindow} from '../../common/app-preview-window-context'
import {combine} from '../../common/styles'
import {useProjectPreviewUrl} from '../app-preview/use-project-preview-url'
import {Loader} from '../../ui/components/loader'

interface IProps {
  app: IApp
  trigger: React.ReactNode | ((isOpen: boolean) => React.ReactNode)
  placement?: Placement
  shrink?: boolean
}

const useStyles = createUseStyles({
  withUpwardArrow: {
    '&::before': {
      'background-color': `${gray1} !important`,
      'content': '""',
      'transform': 'rotate(45deg)',
      'width': '12px',
      'position': 'absolute',
      'display': 'block',
      'height': '12px',
      'left': 'calc(50% - 6px)',
      'top': '-6px',
      'border-left': `1px solid ${gray4}`,
      'border-top': `1px solid ${gray4}`,
    },
  },
  qrPopupContainer: {
    'z-index': '1000',
    'border': `1px solid ${gray4}`,
    'border-radius': '12px',
    'color': almostBlack,
  },
  qrPopup: {
    'fontSize': '14px',
    'font-weight': '700',
    'text-align': 'center',
    'border-radius': '12px',
    '& .ui.button': {
      'background-color': brandWhite,
      'color': almostBlack,
    },
    'background-color': brandWhite,
  },
  qr: {
    position: 'relative',
    padding: '1em',
    minWidth: '163px',
    minHeight: '163px',
  },
  qrImg: {
    display: 'block',
    width: 'calc(163px-1em)',
    height: 'calc(163px-1em)',
  },
  qrImgContainer: {
    position: 'relative',
  },
  hudToggleSection: {
    'background-color': gray1,
    'padding': '.5em',
    'border-top-right-radius': '12px',
    'border-top-left-radius': '12px',
  },
  hudControl: {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'gap': '0.5em',
    'position': 'relative',
  },
  hudCheckbox: {
    'appearance': 'none',
    'backgroundColor': moonlight,
    'border': `2px solid ${brandBlack}`,
    'border-radius': '3px',
    'display': 'inline-block',
    'position': 'relative',
    'padding': '5px',
    '&:checked': {
      'background-color': brandBlack,
    },
    '&:checked:after': {
      content: '"\u2714"',
      fontSize: '10px',
      position: 'absolute',
      top: '0',
      left: '1px',
      color: moonlight,
    },
  },
  actions: {
    display: 'inline-flex',
    gap: '4px',
    margin: '0 1em .5em 1em',
  },
  actionButton: {
    lineHeight: 'normal',
    fontFamily: 'inherit',
    fontWeight: '700',
    fontSize: '14px',
    boxSizing: 'border-box',
    background: gray5,
    color: brandWhite,
    padding: '5px 8px',
    display: 'flex',
    justifyContent: 'center',
    gap: '4px',
    alignItems: 'center',
    borderRadius: '6px',
    border: 'none',
    margin: 0,
    cursor: 'pointer',
  },
  linkOut: {
    '&:hover': {
      color: brandWhite,
      textDecoration: 'none',
    },
  },
  qrOverlayLink: {
    'position': 'absolute',
    'top': '-4px',
    'left': '-4px',
    'right': '-4px',
    'bottom': '-4px',
    'cursor': 'pointer',
    'color': brandWhite,
    'opacity': 0,
    'backgroundColor': hexColorWithAlpha(gray5, 0.7),
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'borderRadius': '6px',
    'transition': 'opacity 0.3s, backdrop-filter 0.3s',
    '&:hover, &:focus-visible': {
      'backdropFilter': 'blur(2px)',
      'color': brandWhite,
      'opacity': 1,
    },
  },
  // PreviewOverLANOverlay classes
  PreviewOverLANOverlay: {
    aspectRatio: '1 / 1',
    padding: '.2rem',
    textAlign: 'left',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    fontWeight: 'normal',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  bold: {
    fontWeight: 800,
    display: 'block',
  },
  minWidth: {
    minWidth: '0',
  },
})

const useDevTokenRedirectTo = (app: IApp, baseProjectUrl: string) => {
  const devInviteRes = useDevToken({disabled: !app})

  const previewLinkDebugMode = useSelector(state => !!state.editor.previewLinkDebugMode)

  if (!app || !baseProjectUrl || !devInviteRes) {
    return null
  }

  const projectUrl = new URL(baseProjectUrl)
  projectUrl.searchParams.set('d', String(previewLinkDebugMode))

  const redirectPart = encodeURIComponent(projectUrl.toString())
  return BuildIf.ALL_QA
    ? projectUrl.toString()
    : `${devInviteRes.url}?to=${redirectPart}`
}

const PreviewOverLANOverlay: React.FC = () => {
  const currentSettings = useUserEditorSettings()
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const {updateAttribute} = useActions(userActions)

  const {localLinkSharing} = currentSettings

  const setSharingEnabled = (enabled: boolean) => updateAttribute({
    'custom:themeSettings': JSON.stringify({
      ...currentSettings,
      localLinkSharing: enabled,
    }),
  })

  return (
    <div className={classes.PreviewOverLANOverlay}>
      <p>
        {localLinkSharing
          ? (
            <Trans
              ns='cloud-editor-pages'
              i18nKey='editor_page.dev_qr_code_popup.visit_hmd_link_page_prompt'
              components={{
                bold: <span className={classes.bold} />,
              }}
            />
          )
          : t('editor_page.dev_qr_code_popup.enable_prompt')}
      </p>
      <StandardInlineToggleField
        id='enable-lan-sharing'
        label={t('editor_page.dev_qr_code_popup.enable_toggle_label')}
        checked={currentSettings.localLinkSharing}
        onChange={setSharingEnabled}
        reverse
      />
    </div>
  )
}

const DevQRCodePopup: React.FunctionComponent<IProps> = React.memo(({
  app,
  trigger,
  shrink = false,
  placement = 'bottom',
}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  const [showPreviewOverLAN, setShowPreviewOverLAN] = React.useState(false)
  const {localLinkSharing} = useUserEditorSettings()
  const [popupOpen, setPopupOpen] = React.useState(false)
  const {
    setPreviewLinkDebugModeSelected,
    loadPreviewLinkDebugModeSelected,
    ensureSimulatorStateReady,
  } = useActions(editorActions)
  const {ensureSimulatorReady} = useActions(gitActions)
  const repo = useCurrentGit(git => git.repo)
  const classes = useStyles()
  const previewLinkDebugMode = useSelector(state => state.editor.previewLinkDebugMode)
  const inlinePreviewVisible = useSimulatorVisible(app)
  const {updateSimulatorState} = useSimulator()

  const appPaths = useAppPathsContext()

  const baseProjectUrl = useProjectPreviewUrl(app, 'remote-device')
  const urlWithTokenRedirect = useDevTokenRedirectTo(popupOpen && app, baseProjectUrl)
  const baseProjectSameDeviceUrl = useProjectPreviewUrl(app, 'same-device')
  const urlWithTokenRedirectSameDevice = useDevTokenRedirectTo(popupOpen && app,
    baseProjectSameDeviceUrl)

  const {setPreviewWindow} = useAppPreviewWindow()

  const {beforeUnload} = useLinkSharing(localLinkSharing && popupOpen, urlWithTokenRedirect)

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [])

  useEffect(() => {
    loadPreviewLinkDebugModeSelected()
    ensureSimulatorStateReady(app.appKey)
  }, [app.appKey])

  const tokenRefreshing = !urlWithTokenRedirect

  const {refs, floatingStyles, context} = useFloating({
    open: popupOpen,
    onOpenChange: setPopupOpen,
    placement,
    middleware: [
      offset(14),
      shift(),
    ],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
    role,
  ])

  const renderQrCodeOverlay = () => {
    if (showPreviewOverLAN) {
      return <PreviewOverLANOverlay />
    }

    return (
      <div
        role='presentation'
        className={classes.qrOverlayLink}
        // @ts-ignore
        a8='click;cloud-editor;preview-link'
        onClick={() => {
          const newTab = openPreviewTab(urlWithTokenRedirectSameDevice)
          setPreviewWindow(newTab)
          updateSimulatorState({inlinePreviewDebugActive: false})
        }}
      >
        <span>
          <Trans
            ns='cloud-editor-pages'
            i18nKey='editor_page.dev_qr_code_popup.open_in_new_tab_2'
            components={{
              icon: <Icon name='external' />,
            }}
          />
        </span>
      </div>
    )
  }

  const renderMainButton = () => {
    if (inlinePreviewVisible) {
      return (
        <button
          type='button'
          className={classes.actionButton}
          onClick={() => {
            setPopupOpen(false)
            openSimulatorWindow(getPathWithSession(appPaths.getPathForApp(AppPathEnum.simulator)))
            updateSimulatorState({inlinePreviewDebugActive: false})
          }}
        >
          <Trans
            ns='cloud-editor-pages'
            i18nKey='editor_page.dev_qr_code_popup.open_simulator'
            components={{
              icon: <Icon name='external' />,
            }}
          />
        </button>
      )
    }

    return (
      <button
        type='button'
        className={classes.actionButton}
        onClick={() => {
          setPopupOpen(false)
          ensureSimulatorReady(repo)
          updateSimulatorState({inlinePreviewVisible: true, inlinePreviewDebugActive: true})
        }}
      >
        <Trans
          ns='cloud-editor-pages'
          i18nKey='editor_page.dev_qr_code_popup.open_simulator'
          components={{
            icon: <Icon name='play' />,
          }}
        />
      </button>
    )
  }

  return (
    <>
      <div
        className={shrink ? classes.minWidth : undefined}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {typeof trigger === 'function' ? trigger(popupOpen) : trigger}
      </div>
      <FloatingPortal>
        {popupOpen &&
          <div
            ref={refs.setFloating}
            style={{...floatingStyles}}
            className={combine(
              classes.qrPopupContainer,
              placement === 'bottom' && classes.withUpwardArrow
            )}
            {...getFloatingProps()}
          >
            <UiThemeProvider mode='light'>
              <div className={classes.qrPopup}>
                <div className={classes.hudToggleSection}>
                  <label className={classes.hudControl} htmlFor='editor-hud-debug-checkbox'>
                    {t('editor_page.dev_qr_code_popup.debug_mode')}
                    <input
                      id='editor-hud-debug-checkbox'
                      type='checkbox'
                      checked={previewLinkDebugMode}
                      className={classes.hudCheckbox}
                      onChange={() => setPreviewLinkDebugModeSelected(!previewLinkDebugMode)}
                    />
                  </label>
                </div>
                <div className={classes.qr}>
                  {tokenRefreshing
                    ? <Loader />
                    : (
                      <div className={classes.qrImgContainer}>
                        {renderQrCodeOverlay()}
                        <BasicQrCode
                          url={urlWithTokenRedirect}
                          ecl='l'
                          margin={0}
                          className={classes.qrImg}
                        />
                      </div>
                    )
                  }
                </div>
                <div className={classes.actions}>
                  <button
                    type='button'
                    onClick={() => setShowPreviewOverLAN(!showPreviewOverLAN)}
                    className={classes.actionButton}
                  >
                    {/* eslint-disable-next-line local-rules/hardcoded-copy */}
                    <img src={hmdIcon} alt='hmd icon' />
                  </button>
                  {renderMainButton()}
                </div>
              </div>
            </UiThemeProvider>
          </div>
          }
      </FloatingPortal>
    </>
  )
})

export {
  DevQRCodePopup,
}
