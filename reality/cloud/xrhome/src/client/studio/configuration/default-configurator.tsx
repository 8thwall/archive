import React from 'react'
import {useTranslation} from 'react-i18next'

import {InputManagerConfigurator} from './input-manager-configurator'
import {SpaceConfigurator} from './space-configurator'
import {SubMenuHeading} from '../ui/submenu-heading'
import {ProjectSettingsConfigurator} from './project-settings-configurator'
import {RuntimeVersionConfigurator} from './runtime-version-configurator'
import {ProjectManifestConfigurator} from './project-manifest-configurator'
import {useCurrentRepoId} from '../../git/repo-id-context'

interface IDefaultConfigurator {
  sourceControlConfigurator?: React.ReactNode
  codeEditorSettings?: React.ReactNode
}

type RIGHT_PANEL_PAGES = 'home' | 'inputManager'

const DefaultConfigurator: React.FC<IDefaultConfigurator> = (
  {sourceControlConfigurator, codeEditorSettings}
) => {
  const [page, setPage] = React.useState<RIGHT_PANEL_PAGES>('home')
  const {t} = useTranslation('cloud-studio-pages')
  const hasRepo = !!useCurrentRepoId()

  return (
    <div>
      {page === 'home' &&
        <>
          <SpaceConfigurator />
          <ProjectSettingsConfigurator
            setPage={setPage}
          />
          {hasRepo &&
            <RuntimeVersionConfigurator />
          }
          {hasRepo && BuildIf.MANIFEST_EDIT_20250618 && <ProjectManifestConfigurator />}
          {sourceControlConfigurator}
          {codeEditorSettings}
        </>}

      {page === 'inputManager' &&
        <>
          <SubMenuHeading
            title={t('input_manager_configurator.title')}
            onBackClick={() => { setPage('home') }}
          />
          <InputManagerConfigurator />
        </>
      }
    </div>
  )
}

export {
  DefaultConfigurator,
  RIGHT_PANEL_PAGES,
}
