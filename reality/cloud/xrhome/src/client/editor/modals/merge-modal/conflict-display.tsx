import React from 'react'
import {createUseStyles} from 'react-jss'

import {combine} from '../../../common/styles'
import {StandardRadioButton} from '../../../ui/components/standard-radio-group'

import {
  almostBlack, brandBlack, darkBlue, gray3, mango,
} from '../../../static/styles/settings'

const gutterWidth = '4em'

const useDetailStyles = createUseStyles({
  quadSpacing: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: `${gutterWidth} 1fr ${gutterWidth} 1fr`,
  },
  choiceRow: {
    'background': brandBlack,
    'height': '2.5em',
    'alignItems': 'center',
  },
  valueRow: {
    minHeight: '10em',
    backgroundColor: darkBlue,
  },
  sidebar: {
    backgroundColor: almostBlack,
    height: '100%',
    width: gutterWidth,
  },
  detailBody: {
    marginTop: '1em',
  },
  configName: {
    color: gray3,
    marginLeft: '1em',
  },
  configValueBackground: {
    backgroundColor: `${mango}40`,
  },
  spaceLeft: {
    marginLeft: '1em',
  },
})

const ConflictDisplay: React.FunctionComponent<{
  title: string
  left: React.ReactNode
  right: React.ReactNode
  baseButtonId: string
  leftChecked: boolean
  rightChecked: boolean
  onSelectLeft: () => void
  onSelectRight: () => void
}> = ({
  title, left, right, leftChecked, rightChecked,
  onSelectLeft, onSelectRight, baseButtonId,
}) => {
  const styles = useDetailStyles()

  return (
    <div>
      <div className={combine(styles.choiceRow, styles.quadSpacing)}>
        <div />
        <StandardRadioButton
          id={`${baseButtonId}-left`}
          label='Keep mine'
          checked={leftChecked}
          onChange={onSelectLeft}
        />
        <div />
        <StandardRadioButton
          id={`${baseButtonId}-right`}
          label='Accept theirs'
          checked={rightChecked}
          onChange={onSelectRight}
        />
      </div>

      <div className={combine(styles.valueRow, styles.quadSpacing)}>
        <div className={styles.sidebar} />

        <div className={styles.detailBody}>
          <h4 className={styles.configName}>{title}</h4>
          <div className={styles.configValueBackground}>
            <div className={styles.spaceLeft}>{left}</div>
          </div>
        </div>

        <div className={styles.sidebar} />

        <div className={styles.detailBody}>
          <h4 className={styles.configName}>{title}</h4>
          <div className={styles.configValueBackground}>
            <div className={styles.spaceLeft}>{right}</div>
          </div>
        </div>
      </div>

    </div>
  )
}

export {
  ConflictDisplay,
}
