import {useState, ReactElement, FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'

import {Dropdown} from 'semantic-ui-react'
import * as React from 'react'
import {createUseStyles} from 'react-jss'

import type {ImageTargetOrderDirection, ImageTargetOrdering} from './types'

import {gray4, brandBlack, gray1} from '../static/styles/settings'
import {combine} from '../common/styles'

import imageTargetActions from './actions'
import useActions from '../common/use-actions'
import {selectTargetsGalleryFilterOptions} from './state-selectors'
import {useSelector} from '../hooks'
import {useTheme} from '../user/use-theme'
import {MultiSelectDropdownMenu, RawTrigger} from '../ui/components/multi-select-dropdown-menu'
import {Icon} from '../ui/components/icon'

const useStyles = createUseStyles({
  'targetsViewOptions': {
    'marginTop': '2em',
    'display': 'flex',
    'flexDirection': 'row',
    'flexWrap': 'wrap',
    '& .dropdown': {
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 3,
    },
    '& > div': {
      marginRight: '2em',
    },
    '& .input > label': {
      border: 'none',
    },
    '& .input > label:focus': {
      border: 'none',
    },
  },
  'searchForm': {
    'position': 'relative',
    'color': gray4,
    'marginRight': '2em',
    'transition': 'color .25s ease-in-out',
    '&:focus-within': {
      color: brandBlack,
    },
  },
  'searchInput': {
    'padding': '0.25em 2em 0.25em 2.25em',
    'font': 'inherit',
    'color': 'inherit',
    'borderRadius': '50px',
    'fontWeight': 'bold',
    'border': `2px solid ${gray4}`,
    '&::placeholder': {
      font: 'inherit',
      color: 'inherit',
    },
    '&:focus': {
      'border': `2px solid ${brandBlack}`,
      'outline': 'none',
      '&::placeholder': {
        opacity: 0,
      },
    },
  },
  'dropdownMenuSort': {
    '& > .item': {
      textAlign: 'right !important',
    },
    '& > .item:hover': {
      background: `${gray1} !important`,
    },
  },
  '@keyframes fadein': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  'visuallyHidden': {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'no-wrap',
    width: '1px',
  },
  'searchButton': {
    position: 'absolute',
    height: '100%',
    background: 'rgba(0,0,0,0)',
    border: 'none',
    width: '2em',
    padding: 0,
    margin: 0,
    textAlign: 'center',
    cursor: 'pointer',
    color: 'inherit',
    font: 'inherit',
  },
  'submitButton': {
    left: '0.35em',
  },
  'clearButton': {
    right: 0,
    animation: '$fadein .25s ease-in-out',
  },
})

const getGeometryOptions = t => [
  {
    content: t('image_target_page.label.flat'),
    value: 'flat',
  }, {
    content: t('image_target_page.label.cylindrical'),
    value: 'cylindrical',
  }, {
    content: t('image_target_page.label.conical'),
    value: 'conical',
  },
]

const getFilterOptions = t => [
  {
    content: t('image_target_view_options.filter_options.autoload'),
    shortContent: t('image_target_view_options.filter_options.autoload_short'),
    value: 'autoload',
  }, {
    content: t('image_target_view_options.filter_options.metadata'),
    value: 'metadata',
  },
]

const getOrderOptions = (t) => {
  const ORDER_OPTIONS: {
    displayName: ReactElement
    by: ImageTargetOrdering
    dir: ImageTargetOrderDirection
  }[] =
    [
      {
        displayName: t('image_target_view_options.order_options.last_modified'),
        by: 'updated',
        dir: 'desc',
      }, {
        displayName: t('image_target_view_options.order_options.last_modified'),
        by: 'updated',
        dir: 'asc',
      }, {
        displayName: t('image_target_view_options.order_options.last_created'),
        by: 'created',
        dir: 'desc',
      }, {
        displayName: t('image_target_view_options.order_options.last_created'),
        by: 'created',
        dir: 'asc',
      }, {
        displayName: t('image_target_view_options.order_options.alphabetical'),
        by: 'name',
        dir: 'desc',
      }, {
        displayName: t('image_target_view_options.order_options.alphabetical'),
        by: 'name',
        dir: 'asc',
      },
    ]
  return ORDER_OPTIONS
}

const FILTER_ENABLED_VALUES = {
  autoload: 'true',
  metadata: 'set',
}

interface IFilterOptions {
  appUuid: string
  galleryUuid: string
}

export const FilterOptions: FunctionComponent<IFilterOptions> = ({appUuid, galleryUuid}) => {
  const {t} = useTranslation('app-pages')
  const filterOptions = useSelector(
    state => selectTargetsGalleryFilterOptions(appUuid, galleryUuid, state.imageTargets)
  )
  const {setGalleryFilterOptionsForApp} = useActions(imageTargetActions)
  const [nameLike, setNameLike] = useState('')
  const orderOptions = getOrderOptions(t)

  const enabledFilters = ['autoload', 'metadata']
    .filter(f => filterOptions[f].includes(FILTER_ENABLED_VALUES[f]))

  const handleGeometryChange = (apiName) => {
    if (filterOptions.type.includes(apiName)) {
      setGalleryFilterOptionsForApp(appUuid, galleryUuid, {
        type: filterOptions.type.filter(target => target !== apiName),
      })
    } else {
      setGalleryFilterOptionsForApp(appUuid, galleryUuid, {
        type: [...filterOptions.type, apiName],
      })
    }
  }

  const handleFilterChange = (apiName) => {
    if (filterOptions[apiName].includes(FILTER_ENABLED_VALUES[apiName])) {
      setGalleryFilterOptionsForApp(appUuid, galleryUuid, {
        [apiName]: [],
      })
    } else {
      setGalleryFilterOptionsForApp(appUuid, galleryUuid, {
        [apiName]: [FILTER_ENABLED_VALUES[apiName]],
      })
    }
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setGalleryFilterOptionsForApp(appUuid, galleryUuid, {
      nameLike: nameLike.length > 0 ? nameLike : null,
    })
    e.preventDefault()
  }

  const handleSearchClear = () => {
    setGalleryFilterOptionsForApp(appUuid, galleryUuid, {
      nameLike: null,
    })
    setNameLike('')
  }

  const handleOrderingChange = (by, dir) => {
    setGalleryFilterOptionsForApp(appUuid, galleryUuid, {
      by: [by],
      dir: [dir],
    })
  }

  const classes = useStyles()
  const themeName = useTheme()

  return (
    <div className={combine(classes.targetsViewOptions, themeName)}>
      <form className={classes.searchForm} onSubmit={handleSearchSubmit}>
        <button
          type='submit'
          className={combine(classes.searchButton, classes.submitButton)}
        >
          <span className={classes.visuallyHidden}>
            {t('image_target_view_options.button.submit')}
          </span>
          <Icon stroke='search' inline />
        </button>
        <label htmlFor='filter-options-search'>
          <span className={classes.visuallyHidden}>
            {t('image_target_view_options.input.label.search_targets')}
          </span>
          <input
            className={classes.searchInput}
            id='filter-options-search'
            placeholder={t('image_target_view_options.input.placeholder.search')}
            value={nameLike}
            onChange={e => setNameLike(e.target.value)}
          />
        </label>
        {nameLike.length > 0 &&
          <button
            type='button'
            onClick={handleSearchClear}
            className={combine(classes.searchButton, classes.clearButton)}
          >
            <span className={classes.visuallyHidden}>
              {t('image_target_view_options.button.label.clear')}
            </span>
            <Icon stroke='cancel' inline />
          </button>
        }
      </form>
      <div>
        <MultiSelectDropdownMenu
          label={t('image_target_view_options.multiselect_dropdown.label.type')}
          options={getGeometryOptions(t)}
          value={filterOptions.type}
          onChange={handleGeometryChange}
          placeholder={t('image_target_view_options.multiselect_dropdown.placeholder.type')}
          allSelectedText='All'
        />
        <MultiSelectDropdownMenu
          label={t('image_target_view_options.multiselect_dropdown.label.filter')}
          options={getFilterOptions(t)}
          value={enabledFilters}
          placeholder={t('image_target_view_options.multiselect_dropdown.placeholder.filter')}
          onChange={handleFilterChange}
        />

        <Dropdown
          trigger={(
            <RawTrigger
              label={t('image_target_view_options.dropdown.label.sort_by')}
              subtext={orderOptions.find(
                o => o.by === filterOptions.by[0] && o.dir === filterOptions.dir[0]
              )?.displayName}
            />
          )}
          icon={null}
        >
          <Dropdown.Menu className={classes.dropdownMenuSort}>
            {orderOptions.map(({displayName, by, dir}) => (
              <Dropdown.Item
                key={`${by}-${dir}`}
                text={
                  <>{displayName} <Icon stroke={dir === 'asc' ? 'chevronUp' : 'chevronDown'} /></>
                }
                onClick={() => handleOrderingChange(by, dir)}
                icon={filterOptions.by[0] === by && filterOptions.dir[0] === dir ? 'check' : ''}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
