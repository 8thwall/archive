import React, {useState} from 'react'

import {createThemedStyles} from '../ui/theme'
import {combine} from '../common/styles'
import CloseIcon from '../apps/widgets/close-icon'
import {Icon} from '../ui/components/icon'

const useStyles = createThemedStyles(theme => ({
  container: {
    display: 'inline-block',
    width: '100%',
    minWidth: '0',
    position: 'relative',
    fontFamily: theme.bodyFontFamily,
    fontWeight: '400',
    flexGrow: '1',
  },
  inputSelect: {
    'height': '100%',
    'display': 'flex',
    'minWidth': '0',
    'padding': '0 0.5em',
    'cursor': 'pointer',
    'borderRadius': theme.sfcBorderRadius,
    'backgroundColor': theme.sfcBackgroundDefault,
    '&:hover': {
      background: theme.tagHoverBg,
    },
  },
  clickable: {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    grow: '1',
    flexGrow: '1',
    minWidth: '0',
    padding: '0.3em 0',
  },
  unfocused: {
    'border': `1px solid ${theme.sfcBorderDefault}`,
  },
  focused: {
    border: `1px solid ${theme.sfcBorderFocus}`,
  },
  selectedText: {
    color: theme.fgMain,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: '0.5em',
  },
  dropdownContent: {
    minWidth: '100%',
    position: 'absolute',
    marginTop: '0.5em',
    padding: '0.5em 0',
    borderRadius: '4px',
    zIndex: '5',
    backgroundColor: theme.studioBgMain,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.sfcBorderDefault}`,
  },
  dropdownOption: {
    'cursor': 'pointer',
    'display': 'flex',
    'alignItems': 'center',
    'height': '32px',
    'padding': '0 1em',
    'color': theme.fgMain,
    '&:hover': {
      backgroundColor: theme.tagHoverBg,
    },
  },
  dropdownText: {
    flex: '1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  selectedSingle: {
    fontWeight: '700',
    color: theme.fgMain,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    border: `1px solid ${theme.fgMuted}`,
    borderRadius: '4px',
    height: '19px',
    width: '19px',
    marginRight: '0.5em',
    display: 'flex',
    alignItems: 'center',
    padding: '0.02em 0 0 0.02em',
  },
  selectCheckbox: {
    border: `1px solid ${theme.fgMuted}`,
    background: theme.sfcBackgroundDefault,
  },
  chevron: {
    marginLeft: 'auto',
    padding: '0 0.5em',
  },
  multiButton: {
    'fontFamily': theme.bodyFontFamily,
    'padding': '0.2em 0.5em',
    'margin': 'auto 0',
    'borderRadius': '4px',
    'border': `1px solid ${theme.sfcBorderDefault}`,
    'backgroundColor': theme.sfcBackgroundDefault,
    'color': theme.fgMain,
    'cursor': 'pointer',
    'display': 'flex',
    'alignItems': 'center',
    'minWidth': '0',
    '&:hover': {
      color: theme.fgMain,
      backgroundColor: theme.textBtnHoverBg,
      border: `1px solid ${theme.sfcBorderDefault}`,
    },
  },
  multiButtonText: {
    'whiteSpace': 'nowrap',
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
  },
  multiButtonCloseIcon: {
    height: '0.5em',
    margin: 'auto',
    marginLeft: '0.5em',
  },
}))

interface ISelectDropDown {
  className?: string
  type: string
  options: string[]
  selected: string[]
  isMultiSelect?: string

  // Callbacks
  onSelectDelete?: () => void
  onClickOption: (type: string, option: string, remove?: boolean) => void
}

const SelectDropDown: React.FC<ISelectDropDown> = (
  {
    className, type, options = [], selected = [], onClickOption = null, isMultiSelect,
  }
) => {
  const classes = useStyles()
  const dropdownRef = React.useRef(null)
  const [showOptions, setShowOptions] = useState(false)
  const expectedBlur = React.useRef(false)

  const onChooseOption = (option: string) => {
    if (!showOptions) {
      return
    }
    // Enable option.
    if (selected.includes(option)) {
      onClickOption(type, option, true)
    // Disable option.
    } else {
      onClickOption(type, option, false)
    }
    setShowOptions(false)
  }

  const onClearTag = () => {
    onClickOption(type, options[0])
  }

  const isAll = index => index === 0 && selected.length < 1

  // This fixes an expected blur on the field when a menu item is clicked.
  const handlePreOptionClick = () => {
    expectedBlur.current = true
  }

  const handleTargetBlur = () => {
    if (expectedBlur.current) {
      expectedBlur.current = false
    } else {
      setShowOptions(false)
    }
  }

  return (
    <div className={combine(className, classes.container)}>
      <div
        className={combine(classes.inputSelect,
          showOptions ? classes.focused : classes.unfocused)}
        onBlur={handleTargetBlur}
      >
        {!!isMultiSelect && selected.length > 1 &&
          <button
            className={classes.multiButton}
            type='button'
            onClick={onClearTag}
            onKeyPress={onClearTag}
          >
            <span className={classes.multiButtonText}>
              {`${selected.length} ${isMultiSelect} selected`}
            </span>
            <CloseIcon className={classes.multiButtonCloseIcon} />
          </button>
        }
        <div
          role='listbox'
          className={classes.clickable}
          onClick={() => setShowOptions(!showOptions)}
          onKeyDown={() => setShowOptions(!showOptions)}
          tabIndex={0}
        >
          {(!isMultiSelect || selected.length < 2) &&
            <span className={classes.selectedText}>
              {selected.length > 0 ? selected[0] : options[0]}
            </span>
        }
          <div className={classes.chevron}>
            <Icon stroke='chevronDown' size={0.5} />
          </div>
        </div>
      </div>
      {showOptions &&
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          ref={dropdownRef}
          className={classes.dropdownContent}
          onMouseDown={handlePreOptionClick}
        >
          {options.map((option, index) => (
            <div
              key={option}
              role='button'
              tabIndex={0}
              onClick={() => onChooseOption(option)}
              onKeyDown={() => onChooseOption(option)}
              className={classes.dropdownOption}
            >
              {!!isMultiSelect &&
                <div className={combine(classes.checkbox,
                  (isAll(index) || selected.includes(option)) && classes.selectCheckbox)}
                >
                  {(isAll(index) || selected.includes(option)) &&
                    <div className={classes.iconContainer}>
                      <Icon
                        stroke='checkmark'
                        size={1.2}
                      />
                    </div>}
                </div>
              }
              <div className={combine(classes.dropdownText,
                !isMultiSelect && (isAll(index) || selected.includes(option)) &&
                classes.selectedSingle)}
              >
                {option}
              </div>
              {!isMultiSelect && (isAll(index) || selected.includes(option)) &&
                <div className={classes.iconContainer}>
                  <Icon
                    stroke='checkmark'
                    size={1.2}
                  />
                </div>}
            </div>
          ))}
        </div>}
    </div>
  )
}

export default SelectDropDown
