import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {OptionsDropdown} from '../../editor/files/options-dropdown'
import icons from '../icons'
import {tinyViewOverride} from '../../static/styles/settings'

const useStyles = createUseStyles({
  downloadDropdown: {
    cursor: 'pointer',
    alignSelf: 'end',
    marginBottom: '0.3em',

    [tinyViewOverride]: {
      alignSelf: 'center',
    },
  },
  downloadIcon: {
    height: '16px',
  },
})

const DownloadAnalyticsDropdown = ({options}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()

  return (
    <div className={classes.downloadDropdown}>
      <OptionsDropdown
        options={options}
        icon={(
          <img
            src={icons.download}
            alt={t('project_dashboard_page.recent_trends.csv_exporter.download')}
            className={classes.downloadIcon}
          />
        )}
      />
    </div>
  )
}

export {
  DownloadAnalyticsDropdown,
}
