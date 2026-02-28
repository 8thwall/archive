import * as React from 'react'
// @ts-expect-error LEGACY_TS_ERRORS
import type {SFC} from 'react'
import {Checkbox, Label, Input} from 'semantic-ui-react'

import defaultImage from '../../static/defaultImage.png'
import {StateChangeComponent} from '../../common'

interface ILogRangeInput {
  min?: number
  max?: number
  value?: number
  onChange?: Function
}
const LogRangeInput: SFC<ILogRangeInput> = ({min, max, value, onChange}) => {
  const logMin = Math.log10(min || 1)
  const logMax = Math.log10(max || 10)
  const logValue = Math.log10(value || 5)
  const roundToDigits = (number, numDigits) => Number(number.toPrecision(numDigits))
  // @ts-expect-error LEGACY_TS_ERRORS
  return <Input fluid className='thumb-slider' type='range' min={logMin} max={logMax} value={logValue} step={0.1} onChange={e => onChange(roundToDigits(Math.pow(10, e.target.value), 3))} />
}

interface IParameterGroup {
  label?: string
  children?: any
}
export class ParameterGroup extends React.Component<IParameterGroup> {
  render = () => (
    <div className='parameter group'>
      {this.props.label && <label>{this.props.label}</label>}
      {this.props.children}
    </div>
  )
}

interface IParameterSlider {
  displayName: string
  sliderScale?: string
  onChange?: Function
  value: any
  step?: number
  min?: number
  max?: number
  className?: string
}
export class ParameterSlider extends React.Component<IParameterSlider> {
  render() {
    const rangeInput = this.props.sliderScale == 'log'
      ? <LogRangeInput min={this.props.min} max={this.props.max} onChange={this.props.onChange} value={this.props.value} />
      : <Input fluid className='thumb-slider' type='range' min={this.props.min} max={this.props.max} step={this.props.step} onChange={e => this.props.onChange(e.target.value)} value={this.props.value} />
    return (
      <div className={`parameter slider ${this.props.className}`}>
        <div className='name'>{this.props.displayName}</div>
        <div className='slider'>{rangeInput}</div>
        <div className='text-input'><Input fluid type='number' onChange={e => this.props.onChange(e.target.value)} value={this.props.value} /></div>
      </div>
    )
  }
}

interface IParameterText {
  displayName: string
  value?: string
  onChange?: Function
  label?: string
}
export class ParameterText extends React.Component<IParameterText> {
  render() {
    return (
      <div className='parameter text'>
        <div className='name'>{this.props.displayName}</div>
        {/* @ts-expect-error LEGACY_TS_ERRORS */}
        <div className='text-input'><Input label={this.props.label} fluid type='text' onChange={this.props.onChange} value={this.props.value} /></div>
      </div>
    )
  }
}

interface IParameterImage {
  displayName: string
  src?: string
  onChange?: Function
}
export class ParameterImage extends React.Component<IParameterImage> {
  render() {
    return (
      <div className='parameter image'>
        <div className='name'>{this.props.displayName}</div>
        <div className='image-input'>
          <div className={`image-preview ${!this.props.src && 'missing'}`} style={{backgroundImage: `url('${this.props.src || defaultImage}')`}}>
            {/* @ts-expect-error LEGACY_TS_ERRORS */}
            <input className='file-input' type='file' accept='.png, .jpg' onChange={this.props.onChange} />
          </div>
        </div>
      </div>
    )
  }
}

export const ParameterAnimation = ({handleImage = null, showImage = true, url, label = null, name}) => (
  <div className='parameter animation'>
    <div className='name'>{label && <Label content={label} size='small' />}{name}</div>
    <div className='image-input'>
      {showImage !== false &&
        <div className={`image-preview ${!url && 'missing'}`} style={{backgroundImage: `url('${url || defaultImage}')`}}>
          {handleImage && <input className='file-input' type='file' accept='.png, .jpg' onChange={handleImage} />}
        </div>
      }
    </div>
  </div>
)

interface IParameterToggleSlider {
  displayName: string
  selectedDisplayName: string
  onChange: any
  value?: boolean
}
export class ParameterToggleSlider extends React.Component<IParameterToggleSlider> {
  render() {
    return (
      <div className='parameter toggle'>
        <div className={`name ${!this.props.value && 'active'}`}>{this.props.displayName}</div>
        <div className='checkbox-slider'>
          <Checkbox checked={this.props.value} toggle onChange={this.props.onChange} />
        </div>
        <div className={`selectedName ${this.props.value && 'active'}`}>{this.props.selectedDisplayName}</div>
      </div>
    )
  }
}
