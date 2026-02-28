import React from 'react'

import type {RefHead} from '@nia/reality/shared/nae/nae-types'
import type {TFunction} from 'react-i18next'

import type {RepoState} from '../../../git/git-redux-types'

const getBuildEnvOptions = (
  t: TFunction,
  git: RepoState,
  activeRef: RefHead,
  classes: any
) => [
  {
    content: t('editor_page.export_modal.build_env.dev'),
    value: activeRef,
  },
  {
    content: t('editor_page.export_modal.build_env.master'),
    value: 'master',
    disabled: !git.deployment.master,
    tooltip: !git.deployment.master && (
      <div className={classes.toggleTooltip}>
        {t('editor_page.export_modal.build_env.no_deployment', {
          buildEnv: t('editor_page.export_modal.build_env.master'),
        })}
      </div>
    ),
  },
  {
    content: t('editor_page.export_modal.build_env.staging'),
    value: 'staging',
    disabled: !git.deployment.staging,
    tooltip: !git.deployment.staging && (
      <div className={classes.toggleTooltip}>
        {t('editor_page.export_modal.build_env.no_deployment', {
          buildEnv: t('editor_page.export_modal.build_env.staging'),
        })}
      </div>
    ),
  },
  {
    content: t('editor_page.export_modal.build_env.production'),
    value: 'production',
    disabled: !git.deployment.production,
    tooltip: !git.deployment.production && (
      <div className={classes.toggleTooltip}>
        {t('editor_page.export_modal.build_env.no_deployment', {
          buildEnv: t('editor_page.export_modal.build_env.production'),
        })}
      </div>
    ),
  },
] as const

export {
  getBuildEnvOptions,
}
