import React from 'react'
import {Form} from 'semantic-ui-react'

import {
  CurvedGeometryUpdate, getCircumferenceRatio, getTargetCircumferenceBottom, toHundredths,
} from './curved-geometry'

interface INumberOnlyInput {
  label: string
  value: number
  disabled?: boolean
  onChange?: (newValue: number) => void
  onFocus?: () => void
  onBlur?: () => void
}

// Input that can accept number inputs and only calls the onChange callback when
//  the new value is a valid number
const NumberInput: React.FunctionComponent<INumberOnlyInput> = (props) => {
  const [valueString, setValueString] = React.useState(String(props.value))

  const changedValue = React.useRef<number>()

  React.useEffect(() => {
    if (props.value !== changedValue.current) {
      changedValue.current = props.value
      setValueString(String(props.value))
    }
  }, [props.value])

  const handleChange = (_, {value}) => {
    setValueString(value)
    const num = Number(value)
    if (!Number.isNaN(num)) {
      changedValue.current = num
      props.onChange?.(num)
    }
  }

  return (
    <Form.Input
      label={props.label}
      value={valueString}
      onChange={handleChange}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      error={Number.isNaN(Number(valueString))}
      disabled={props.disabled}
    />
  )
}

interface ICurvedGeometryMeasurementsPane {
  type: string
  unit: string
  cylinderCircumferenceTop: number
  cylinderCircumferenceBottom: number
  cylinderSideLength: number
  targetCircumferenceTop: number
  isRotated: boolean
  originalWidth: number
  originalHeight: number
  topRadius: number
  bottomRadius: number
  currentCylinderCircumferenceTop: number
  currentCylinderCircumferenceBottom: number
  onHighlightTopChange(highlighted: boolean): void
  onHighlightTargetChange(highlighted: boolean): void
  onChange(newValues: CurvedGeometryUpdate): void
}

const CurvedGeometryMeasurementsPane: React.FC<ICurvedGeometryMeasurementsPane> = ({
  type,
  unit,
  cylinderCircumferenceTop,
  cylinderCircumferenceBottom,
  cylinderSideLength,
  targetCircumferenceTop,
  isRotated,
  originalWidth,
  originalHeight,
  topRadius,
  bottomRadius,
  currentCylinderCircumferenceTop,
  currentCylinderCircumferenceBottom,
  onHighlightTopChange,
  onHighlightTargetChange,
  onChange,
}) => {
  React.useEffect(() => () => {
    onHighlightTopChange(false)
    onHighlightTargetChange(false)
  }, [])

  const handleConeTopChange = (newTopNum: number) => {
    onChange({
      cylinderCircumferenceTop: newTopNum,
      cylinderCircumferenceBottom: toHundredths(newTopNum / getCircumferenceRatio(
        currentCylinderCircumferenceTop,
        currentCylinderCircumferenceBottom,
        topRadius,
        bottomRadius
      )),
    })
  }

  const handleCylinderChange = (newCircumference: number) => {
    onChange({
      cylinderCircumferenceTop: newCircumference,
      cylinderCircumferenceBottom: newCircumference,
    })
  }

  const handleTargetChange = (newTargetCircumferenceTop: number) => {
    const maxTargetCircumference = Math.max(
      newTargetCircumferenceTop,
      getTargetCircumferenceBottom(
        newTargetCircumferenceTop, cylinderCircumferenceTop, cylinderCircumferenceBottom
      )
    )

    const newCylinderSideLength = isRotated
      ? maxTargetCircumference * (originalWidth / originalHeight)
      : maxTargetCircumference * (originalHeight / originalWidth)

    onChange({
      targetCircumferenceTop: newTargetCircumferenceTop,
      cylinderSideLength: toHundredths(newCylinderSideLength),
    })
  }

  return (
    <>
      <Form.Group widths='equal'>
        {type === 'CONICAL'
          ? (
            <NumberInput
              label={`Top Circumference (${unit})`}
              value={cylinderCircumferenceTop}
              onChange={handleConeTopChange}
              onFocus={() => onHighlightTopChange(true)}
              onBlur={() => onHighlightTopChange(false)}
            />
          )
          : (
            <NumberInput
              label={`Cylinder Circumference (${unit})`}
              value={cylinderCircumferenceTop}
              onChange={handleCylinderChange}
              onFocus={() => onHighlightTopChange(true)}
              onBlur={() => onHighlightTopChange(false)}
            />
          )}
        <NumberInput
          label={`Label${type === 'CONICAL' ? ' Top' : ''} Arc Length (${unit})`}
          value={targetCircumferenceTop}
          onChange={handleTargetChange}
          onFocus={() => onHighlightTargetChange(true)}
          onBlur={() => onHighlightTargetChange(false)}
        />
      </Form.Group>
      <Form.Group widths='equal'>
        {type === 'CONICAL'
          ? (
            <NumberInput
              disabled
              label={`Bottom Circumference (${unit})`}
              value={cylinderCircumferenceBottom}
            />
          )
          : (
            <div className='field' />
          )}
        <NumberInput
          disabled
          label={`Label Height (${unit})`}
          value={cylinderSideLength}
        />
      </Form.Group>
    </>
  )
}

export default CurvedGeometryMeasurementsPane
