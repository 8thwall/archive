import React from 'react'
import {createUseStyles} from 'react-jss'
import {Link} from 'react-router-dom'

import {useQueryClient} from '@tanstack/react-query'

import {Trans, useTranslation} from 'react-i18next'

import type {ProjectClientSide} from '../../shared/studiohub/local-sync-types'
import type {IApp} from '../common/types/models'
import {getStudioPath} from './desktop-paths'
import {deriveAppCoverImageUrl, getDisplayNameForApp} from '../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/app-constants'
import {SpaceBetween} from '../ui/layout/space-between'
import {WHITE_10, WHITE_5, WHITE_50} from './colors'
import {combine} from '../common/styles'
import AppStatus from '../apps/widgets/app-status'
import {ProjectListItemOptions} from './project-list-item-options'
import {cherryLight} from '../static/styles/settings'
import {SecondaryButton} from '../ui/components/secondary-button'
import {deleteProject, moveProject, pickNewProjectLocation} from '../studio/local-sync-api'
import {ProjectListModal} from './project-list-modal'

const useStyles = createUseStyles({
  projectListItem: {
    'display': 'flex',
    'fontFamily': 'Geist Mono !important',
    'listStyleType': 'none',
    'padding': '0.5rem 1rem 0.5rem 0.5rem',
    'borderRadius': '0.5rem',
    'border': '1px solid transparent',
    'position': 'relative',
    '&:hover': {
      backgroundColor: WHITE_10,
      borderColor: WHITE_5,
      border: '1px solid',
    },
    '&:focus-within': {
      backgroundColor: WHITE_10,
      borderColor: WHITE_5,
      border: '1px solid',
    },
  },
  coverImage: {
    width: '10rem',
    aspectRatio: '70/43',
    borderRadius: '0.5rem',
    objectFit: 'cover',
  },
  buttonArea: {
    position: 'relative',
    zIndex: 2,
    pointerEvents: 'auto',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  link: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    zIndex: 2,
    pointerEvents: 'none',
    width: '100%',
    minWidth: 0,
  },
  textContainer: {
    minWidth: 0,
    maxWidth: '100%',
    flex: 1,
    overflow: 'hidden',
  },
  appName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
  },
  projectLocation: {
    color: WHITE_50,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    direction: 'rtl',
  },
  projectError: {
    color: cherryLight,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

interface IProjectListItem {
  app: IApp
  project: ProjectClientSide | undefined
}

const ProjectListItem: React.FC<IProjectListItem> = ({app, project}) => {
  const classes = useStyles()
  const {t} = useTranslation(['studio-desktop-pages'])
  const queryClient = useQueryClient()
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = React.useState(false)
  const [isMovingAppModalOpen, setIsMovingAppModalOpen] = React.useState(false)
  const [selectedApp, setSelectedApp] = React.useState<IApp | null>(null)
  const [targetLocation, setTargetLocation] = React.useState<string>('')

  const onClose = () => {
    setIsDeleteProjectModalOpen(false)
    setIsMovingAppModalOpen(false)
    setSelectedApp(null)
  }

  return (
    <li className={classes.projectListItem}>
      {(!project || project.validLocation) &&
        <Link to={getStudioPath(app.appKey)} className={combine('style-reset', classes.link)} />
      }
      <div className={classes.content}>
        <SpaceBetween grow centered between noWrap>
          <SpaceBetween centered>
            <img
              className={classes.coverImage}
              draggable={false}
              src={deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[600])}
              alt=''
            />
            <div className={classes.textContainer}>
              <SpaceBetween direction='vertical' narrow>
                <span className={classes.appName}>{getDisplayNameForApp(app)}</span>
                {project?.location &&
                  <span className={classes.projectLocation}>
                    {project.location}
                  </span>
                  }
                {(project?.location && !project?.validLocation) &&
                  <span className={classes.projectError}>
                    {t('project_list_item.project_missing')}
                  </span>
                }
              </SpaceBetween>
            </div>
          </SpaceBetween>
          <div className={classes.buttonArea}>
            {project && project.location && !project.validLocation &&
              <SecondaryButton onClick={async () => {
                await moveProject(app.appKey)
                queryClient.invalidateQueries({queryKey: ['listProjects']})
              }}
              >
                {t('project_list_item.button.locate')}
              </SecondaryButton>
            }
            <AppStatus app={app} />
            <ProjectListItemOptions
              app={app}
              project={project}
              onDelete={() => {
                setIsDeleteProjectModalOpen(true)
                setSelectedApp(app)
              }}
              onMove={async () => {
                setSelectedApp(app)
                const {projectPath} = await pickNewProjectLocation(app.appKey)
                setTargetLocation(projectPath)
                setIsMovingAppModalOpen(true)
              }}
            />
          </div>
        </SpaceBetween>
      </div>
      {isDeleteProjectModalOpen && (
        <ProjectListModal
          onClose={onClose}
          onSubmit={async () => {
            await deleteProject(selectedApp.appKey)
            queryClient.invalidateQueries({queryKey: ['listProjects']})
            onClose()
          }}
          header={`${t('project_list_item.modal.title.remove_project')
          }${getDisplayNameForApp(selectedApp)}`}
          content={(
            <SpaceBetween direction='vertical' centered extraNarrow>
              <span>
                {t('project_list_item.modal.text.delete_warning')}
              </span>
              <b>
                {project?.location}
              </b>
              <span>
                {t('project_list_item.modal.text.changes_warning')}
              </span>
            </SpaceBetween>
          )}
          submitContent={t('project_list_item.modal.button.delete')}
        />
      )}
      {isMovingAppModalOpen && (
        <ProjectListModal
          onClose={onClose}
          onSubmit={async () => {
            await moveProject(selectedApp.appKey, targetLocation)
            queryClient.invalidateQueries({queryKey: ['listProjects']})
            onClose()
          }}
          header={`${t('project_list_item.modal.move')} ${getDisplayNameForApp(selectedApp)}`}
          content={(
            <SpaceBetween direction='vertical' centered extraNarrow>
              <Trans
                ns='studio-desktop-pages'
                i18nKey='project_list_item.move_project_confirmation'
                values={{
                  oldPath: project?.location || '',
                  newPath: targetLocation,
                }}
                components={{
                  oldBlock: <b />,
                  newBlock: <b />,
                }}
              />
            </SpaceBetween>
          )}
          submitContent={t('project_list_item.modal.button.move')}
        />
      )}
    </li>
  )
}

export {
  ProjectListItem,
}
