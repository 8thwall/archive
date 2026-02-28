import React from 'react'
import {useTranslation} from 'react-i18next'

import {FloatingPanelButton} from '../../ui/components/floating-panel-button'
import {LinkButton} from '../../ui/components/link-button'
import {FloatingTrayModal} from '../../ui/components/floating-tray-modal'
import {ProjectHistoryView} from '../../editor/project-history-view'
import {createThemedStyles} from '../../ui/theme'
import {gray4} from '../../static/styles/settings'
import {StudioCommitSummaryMenu} from '../studio-commit-summary-menu'
import {StaticBanner} from '../../ui/components/banner'

const useStyles = createThemedStyles(theme => ({
  buttonTrigger: {
    display: 'flex',
    gap: '1em',
    justifyContent: 'center',
    padding: '0.35em',
  },
  buttonTray: {
    textAlign: 'center',
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '2em 1em',
    minHeight: '50vh',
  },
  header: {
    textAlign: 'center',
    fontSize: '1.5em',
    fontWeight: 700,
  },
  repoView: {
    'margin': '1em 0',
    'flexGrow': 1,
    'color': theme.fgMain,
    'overflow': 'auto',
    'maxHeight': 'calc(100vh - 200px)',
    '& .deployment-repo': {
      'display': 'grid',
      'gridTemplateColumns': '60px 120px auto',
      '& a': {
        color: theme.linkBtnFg,
      },
      '& .target': {
        'gridColumn': '1 / 2',
        'justifySelf': 'center',
        'whiteSpace': 'nowrap',
        'alignSelf': 'center',
        '& .staging-link': {
          color: theme.badgeMangoColor,
        },
        '& .prod-link': {
          color: theme.badgeMintColor,
        },
      },
      '& .chart': {
        'gridColumn': '2 / 3',
        'gridRow': '1 / -1',
        '& circle.temporary': {
          fill: `${gray4} !important`,
          strokeWidth: '2px',
          stroke: gray4,
        },
      },
      '& .commit': {
        'gridColumn': '3 / 4',
        'alignSelf': 'center',
        'minWidth': '24em',
        'zIndex': 2,
        '& .with-content': {
          borderRadius: '4px',
          padding: '3px 0',
          backgroundColor: theme.mainEditorPane,
        },
        '& .temporary': {
          color: theme.fgMain,
        },
        '& .commit-box': {
          'padding': '0 0.5em',
          '& .header, & .header strong': {
            fontSize: '1.1em',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
          },
          '& .summary': {
            background: theme.mainEditorPane,
            padding: '0.25em 0 0.25em 0.5em',
            border: theme.studioBgBorder,
            borderWidth: '1px 0 1px 1px',
            borderRadius: '4px 0 0 4px',
            minWidth: '6em',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            paddingRight: '0.5em',
            flexGrow: 1,
          },
          '& .commit-hash': {
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
            paddingRight: '1em',
          },
          '& .commit-summary': {
            whiteSpace: 'nowrap',
          },
          '& .description, .description strong': {
            'whiteSpace': 'nowrap',
            'fontSize': '0.95em',
            '& span': {
              'display': 'inline-block',
              'height': '100%',
              '& .view-button': {
                height: '100%',
                verticalAlign: 'middle',
                backgroundColor: theme.studioPanelBtnBg,
                borderRadius: '4px',
                margin: 0,
                padding: '0.15em 0.6em',
                fontSize: '0.85em',
                color: theme.fgMain,
              },
            },
            '& span:first-child': {
              background: theme.mainEditorPane,
              padding: '0.25em 0.5em 0.25em 1em',
              borderRadius: '0 4px 4px 0',
              border: theme.studioBgBorder,
              borderWidth: '1px 1px 1px 0',
            },
          },
          '& .description strong': {
            color: gray4,
          },
        },
      },
      '& .client-branch': {
        gridColumn: '3 / 4',
        alignSelf: 'center',
      },
      '& .row1': {
        gridRow: '2 / 3',
      },
      '& .row2': {
        gridRow: '3 / 4',
      },
      '& .row3': {
        gridRow: '4 / 5',
      },
      '& .row4': {
        gridRow: '5 / 6',
      },
    },
    '& svg': {
      '& path': {
        'stroke': gray4,
        '&.line': {
          strokeWidth: '2px',
        },
        '&.pointer': {
          'strokeWidth': '2px',
          'fill': 'none',

          // NOTE(christoph): Used by commit-chart
          '&.target-1': {
            stroke: gray4,
          },
          '&.target-2': {
            stroke: gray4,
          },
          // END NOTE

          '&.preview': {
            strokeDasharray: 7,
            strokeDashoffset: 96,
          },
        },
      },
      '& .marker': {
        stroke: 'none',
      },
      '& circle': {
        fill: gray4,
      },
    },
    '& .client-branch': {
      'zIndex': 1,
      'display': 'flex',
      'flexWrap': 'wrap',
      'gap': '1rem',
      '& .branch-split': {
        'display': 'inlineBlock',
        'position': 'relative',
        'marginLeft': '50px',
        '& .pre-arrow': {
          pointerEvents: 'none',
          position: 'absolute',
        },
      },
    },
  },
  errorBanner: {
    width: '100%',
  },
}))

interface IProjectHistoryModal {
}

const ProjectHistoryModal: React.FC<IProjectHistoryModal> = () => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages', 'common'])
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  return (
    <div className={classes.buttonTrigger}>
      <FloatingTrayModal
        trigger={(
          <FloatingPanelButton>
            {t('project_history_page.heading')}
          </FloatingPanelButton>
        )}
      >
        {collapse => (
          <div className={classes.modalContainer}>
            <div className={classes.header}>{t('project_history_page.heading')}</div>
            {errorMsg && (
              <div className={classes.errorBanner}>
                <StaticBanner type='danger' onClose={() => setErrorMsg(null)} hasMarginTop>
                  {errorMsg}
                </StaticBanner>
              </div>
            )}
            <div className={classes.repoView}>
              <ProjectHistoryView
                renderCommitSummaryMenu={commitId => (
                  <StudioCommitSummaryMenu
                    commitId={commitId}
                    onClose={collapse}
                    onError={setErrorMsg}
                  />
                )}
              />
            </div>
            <div className={classes.buttonTray}>
              <LinkButton onClick={collapse}>
                {t('button.close', {ns: 'common'})}
              </LinkButton>
            </div>
          </div>
        )}
      </FloatingTrayModal>
    </div>
  )
}

export {
  ProjectHistoryModal,
}
