import React, {FC, useContext, useEffect} from 'react'
import {Checkbox} from 'semantic-ui-react'
import {useTranslation, Trans} from 'react-i18next'

import Accordion from '../../widgets/accordion'
import useStyles from '../showcase-project-jss'
import ShowcaseSettingsContext from '../settings/showcase-settings-context'
import {combine, bool} from '../../common/styles'
import useCurrentAccount from '../../common/use-current-account'
import useCurrentApp from '../../common/use-current-app'
import {isEntryWebApp} from '../../../shared/app-utils'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import {Icon} from '../../ui/components/icon'

interface Props {
  active: boolean
  onTitleClick: () => void
}

const ShowcaseSettingsSection: FC<Props> = ({active, onTitleClick}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const account = useCurrentAccount()
  const app = useCurrentApp()
  const isAppEntryWebApp = isEntryWebApp(account, app)
  const hasProdDeployment = !!app.productionCommitHash && app.hostingType !== 'SELF'
  const {isTryable, setIsTryable, isCloneable, setIsCloneable} = useContext(ShowcaseSettingsContext)

  const disableStyleIfAppLicense = () => !(isAppEntryWebApp || hasProdDeployment)

  useEffect(() => {
    // APP license projects are required to be tryable
    if (!hasProdDeployment && !isAppEntryWebApp) {
      setIsTryable(false)
    }
  }, [hasProdDeployment])

  return (
    <Accordion>
      <Accordion.Title active={active} onClick={onTitleClick}>
        {t('feature_project_page.showcase_settings.title')}
        {!hasProdDeployment && (
          <span>
            <Icon stroke='lock' color='gray3' inline />
          </span>
        )}
      </Accordion.Title>
      <Accordion.Content>
        <p>
          {t('feature_project_page.showcase_settings.blurb')}
        </p>
        <h3
          className={
            combine(classes.miniHeader, bool(disableStyleIfAppLicense(), classes.disabled))
          }
        >
          {t('feature_project_page.showcase_settings.heading.launch_button')}
          {hasProdDeployment &&
            <TooltipIcon
              position='top center'
              content={(
                <Trans
                  ns='app-pages'
                  i18nKey='feature_project_page.showcase_settings.tooltip.try_it_out'
                >
                  The &ldquo;Try it out&rdquo; button will link to your <b>8thwall.app</b> Public
                  URL.
                </Trans>
              )}
            />
          }
        </h3>
        {isAppEntryWebApp
          ? (
            <p>
              {t('feature_project_page.showcase_settings.blurb.launch_button_app')}
            </p>
          )
          : (
            <>
              <p className={bool(!hasProdDeployment, classes.disabled)}>
                {t('feature_project_page.showcase_settings.blurb.launch_button_not_app')}
              </p>
              <Checkbox
                disabled={!hasProdDeployment}
                className={
                combine(classes.isTryableToggle, bool(!hasProdDeployment, classes.disabledToggle))
              }
                toggle
                checked={hasProdDeployment && isTryable}
                label={hasProdDeployment && isTryable ? 'Public' : 'Hidden'}
                onClick={hasProdDeployment ? () => setIsTryable(!isTryable) : null}
              />
            </>
          )
        }
        <h3
          className={combine(classes.miniHeader,
            bool((!hasProdDeployment && !isAppEntryWebApp),
              classes.disabled))}
        >
          {t('feature_project_page.showcase_settings.heading.cloneable_code')}
          {hasProdDeployment &&
            <TooltipIcon
              position='top center'
              content={t('feature_project_page.showcase_settings.tooltip.cloneable_code')}
            />
          }
        </h3>
        <p className={bool(!isAppEntryWebApp && !hasProdDeployment, classes.disabled)}>
          {t('feature_project_page.showcase_settings.blurb.cloneable_code')}
        </p>
        <Checkbox
          disabled={!isAppEntryWebApp && !hasProdDeployment}
          className={
            combine(classes.isCloneableToggle, bool(!hasProdDeployment, classes.disabledToggle))
          }
          toggle
          checked={hasProdDeployment && isCloneable}
          label={hasProdDeployment && isCloneable ? 'Public' : 'Hidden'}
          onClick={hasProdDeployment ? () => setIsCloneable(!isCloneable) : null}
        />
        <p
          className={combine(classes.cloneableFooter,
            bool(disableStyleIfAppLicense(), classes.disabled))}
        >
          {isCloneable
            ? t('feature_project_page.showcase_settings.blurb.is_cloneable')
            : t('feature_project_page.showcase_settings.blurb.hidden_code')
          }
        </p>
      </Accordion.Content>
    </Accordion>
  )
}

export default ShowcaseSettingsSection
