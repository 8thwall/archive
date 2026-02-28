// @sublibrary(:audio-lib)
type AudioParamType = 'a-rate' | 'k-rate'

class AudioParam {
  private _value: number

  private _defaultValue: number

  private _minValue: number

  private _maxValue: number

  constructor(defaultValue: number, type: AudioParamType = 'a-rate', minValue: number = -Infinity,
    maxValue: number = Infinity) {
    this._defaultValue = defaultValue
    this._value = defaultValue
    this._minValue = minValue
    this._maxValue = maxValue
  }

  get defaultValue() {
    return this._defaultValue
  }

  get maxValue() {
    return this._maxValue
  }

  get minValue() {
    return this._minValue
  }

  get value() {
    return this._value
  }

  set value(value: number) {
    this._value = value
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number) {
    this._value = target
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValueAtTime(value: number, startTime: number) {
    // TODO(divya): Use startTime to schedule the change in value
    this._value = value
  }
}

export {AudioParam}
