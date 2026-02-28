import React from 'react'

import {Trans, useTranslation} from 'react-i18next'

import type {IModule} from '../common/types/models'
import useActions from '../common/use-actions'
import Accordion from '../widgets/accordion'
import {StandardCheckboxField} from '../ui/components/standard-checkbox-field'
import moduleActions from './actions'
import {StandardLink} from '../ui/components/standard-link'
import {
  isValidCompatibility, packCompatibility, unpackCompatibility, UnpackedCompatibility,
} from '../../shared/module-compatibility'
import {StaticBanner} from '../ui/components/banner'
import {SpaceBetween} from '../ui/layout/space-between'
import {useRunQueue} from '../hooks/use-run-queue'

interface IModuleCompatibilityContents {
  module: IModule
}

const ModuleCompatibilityContents: React.FC<IModuleCompatibilityContents> = ({module}) => {
  const {t} = useTranslation(['module-pages'])
  const {patchModule} = useActions(moduleActions)

  const [temporaryState, setTemporaryState] = React.useState< null | UnpackedCompatibility>(null)
  const saveCount = React.useRef(0)
  const lastSaveId = React.useRef(0)
  const runQueue = useRunQueue()

  const value = temporaryState || unpackCompatibility(module.compatibility)

  const saveCompatibility = (compatibilities: UnpackedCompatibility) => {
    const compatibility = packCompatibility(compatibilities)
    if (!isValidCompatibility(compatibility)) {
      setTemporaryState(compatibilities)
      return
    }

    lastSaveId.current++
    const saveId = lastSaveId.current

    saveCount.current++
    setTemporaryState(compatibilities)
    runQueue.next(async () => {
      try {
        if (saveId !== lastSaveId.current) {
          // There is a newer save in the queue
          return
        }
        await patchModule(module.uuid, {compatibility})
      } finally {
        saveCount.current--
        if (saveCount.current === 0) {
          setTemporaryState(null)
        }
      }
    })
  }

  return (
    <>
      <p>
        <Trans
          ns='module-pages'
          i18nKey='module_settings_page.compatibility_settings.description'
          components={{
            documentationLink: (
              <StandardLink newTab href='https://8th.io/module-compatibility-docs' />
            ),
          }}
        />
      </p>
      <SpaceBetween direction='vertical'>
        <StandardCheckboxField
          id='module-compatibility-studio'
          label={t('module_settings_page.compatibility_settings.option.studio')}
          checked={value.studio}
          onChange={(e) => {
            saveCompatibility({...value, studio: e.currentTarget.checked})
          }}
        />
        <StandardCheckboxField
          id='module-compatibility-editor'
          label={t('module_settings_page.compatibility_settings.option.editor')}
          checked={value.editor}
          onChange={(e) => {
            saveCompatibility({...value, editor: e.currentTarget.checked})
          }}
        />
        <StandardCheckboxField
          id='module-compatibility-self'
          label={t('module_settings_page.compatibility_settings.option.self')}
          checked={value.self}
          onChange={(e) => {
            saveCompatibility({...value, self: e.currentTarget.checked})
          }}
        />
        {packCompatibility(value) === 'NONE' &&
          <StaticBanner
            type='warning'
            message={t('module_settings_page.compatibility_settings.none_selected_warning')}
          />
        }
      </SpaceBetween>
    </>
  )
}

interface IModuleCompatibilityCard extends IModuleCompatibilityContents {
  active: boolean
  onTitleClick: () => void
}

const ModuleCompatibilityCard: React.FC<IModuleCompatibilityCard> = ({
  active, onTitleClick, ...rest
}) => {
  const {t} = useTranslation('module-pages')
  return (
    <Accordion>
      <Accordion.Title
        active={active}
        onClick={onTitleClick}
      >
        {t('module_settings_page.compatibility_settings.title')}
      </Accordion.Title>
      {active &&
        <Accordion.Content>
          <ModuleCompatibilityContents {...rest} />
        </Accordion.Content>
    }
    </Accordion>
  )
}

export {
  ModuleCompatibilityCard,
}
