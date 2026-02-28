import * as React from 'react'
import Measure from 'react-measure'
import * as d3 from 'd3'

import '../static/styles/usage-progress-bar.scss'

interface ITick {
  val: number  // e.g. 1000
  location: number  // e.g. 0.2
  locationX?: number  // computed value
}

export interface IUsageProgressBarProps {
  value: number
  locked: boolean
  lockedTierStart: number  // index into ticks property, e.g. 0 for to lock onto the first element
  lockedMessage: string  // svg html on the locked part
  className?: ''
  ticks?: Array<ITick>
  parentWidth: number
}

class UsageProgressBarNR extends React.Component<IUsageProgressBarProps> {
  private myRef = React.createRef<HTMLDivElement>()

  private barHeight: number = 25;

  private defaultTicks: Array<ITick> = [
    // 0 is assumed to be the first value, you don't supply it
    {val: 1000, location: 0.2},
    {val: 2000, location: 0.3},
    {val: 10000, location: 0.45},
    {val: 100000, location: 0.75},
    {val: 1000000, location: 1},
    // the last value has to be location 1
  ]

  private ticks: Array<ITick>

  componentDidMount() { this.renderChart() }

  componentDidUpdate() { this.renderChart() }

  computePiecewiseValueLocation(val, leftOffset): number {
    const rightIndex = this.ticks.findIndex(t => t.val > val)
    if (rightIndex == -1) {
      return 1
    }
    const rightTick = this.ticks[rightIndex]
    const leftTick = rightIndex == 0 ? {val: 0, location: leftOffset} : this.ticks[rightIndex - 1]
    return leftTick.location + (val - leftTick.val) / (rightTick.val - leftTick.val) * (rightTick.location - leftTick.location)
  }

  renderChart = () => {
    this.ticks = this.props.ticks || this.defaultTicks
    // const domRect = this.myRef.current.getBoundingClientRect()
    const domRect = {
      width: this.props.parentWidth,
      height: this.barHeight * 3,
    }
    const barLength = domRect.width
    const valLocation = this.computePiecewiseValueLocation(this.props.value, this.barHeight / 2 / barLength)
    const valWidth = valLocation * barLength
    this.ticks.forEach((t) => {
      t.locationX = t.location * barLength
    })
    const lockedTierStartLocation = this.ticks[this.props.locked
      ? this.props.lockedTierStart
      : this.ticks.length - 1].location
    const lockedTierStart = lockedTierStartLocation * barLength

    // draw the chart
    // TODO(dat): Split chart defs into a separate component
    const myDom = d3.select(this.myRef.current)
    const svg = myDom.select('svg').empty() ? myDom.append('svg') : myDom.select('svg')
    svg.selectAll('*').remove()
    svg.style('width', '100%')
      .style('overflow', 'visible')  // when a scrollbar is introduced, no resize event has happened
      .attr('width', barLength + 1)
      .attr('height', domRect.height)
      .classed('locked', this.props.locked)
    const svgDefs = svg.append('defs')
    const mainGradient = svgDefs.append('linearGradient').attr('id', 'mainGradient')
    mainGradient.append('stop')
      .attr('stop-color', '#c86dd7')  // $purple1
      .attr('offset', '0')
    mainGradient.append('stop')
      .attr('stop-color', '#7611b7')  // $purple2
      .attr('offset', '1')
    const lockedPattern = svgDefs.append('pattern').attr('id', 'lockedPattern')
    lockedPattern.attr('width', 12)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', 'rotate(-35, 50 50)')
    lockedPattern.append('line')
      .attr('stroke', '#e0e0e0')
      .attr('opacity', 0.7)
      .attr('stroke-width', '12')
      .attr('y2', '10')

    const mainG = svg.append('g')
      .attr('transform', `translate(0, ${this.barHeight / 4})`)

    const freeTierExceeded = valWidth < lockedTierStart

    // draw the ticks so the bars hide them
    const allTicks = mainG.append('g')
    // draw the ticks and their numbers
    const eachTick = allTicks.selectAll('g').data(this.ticks).enter()
      .append('g')
      .attr('width', 75)
      .attr('height', this.barHeight * 2.5)
      .attr('transform', (t, i) => `translate(${t.locationX - ((i == 0 && !freeTierExceeded)
        ? 1
        : 0)}, ${this.barHeight / 4})`)
    eachTick.append('rect')
      .classed('tick-bar', true)
      .classed('tick-bar-locked-tier-start', (t, i) => this.props.locked && lockedTierStartLocation === t.location)
      .attr('width', 1)
      .attr('height', this.barHeight * 1.5)
    eachTick.append('text')
      .classed('tick-text', true)
      .attr('y', this.barHeight * 1.5 + 15)
      .attr('text-anchor', (t, i) => (i >= this.ticks.length - 1 ? 'end' : 'middle'))
      .text((t, i) => (t.val >= 1E6 ? `${t.val / 1E6}M+` : t.val.toLocaleString('en')))
    // draw your current value
    const currentTick = allTicks.append('g')
      .classed('tick-bar-current', true)
      .classed('tick-bar-overage', valWidth > lockedTierStart)
      .attr('width', 75)
      .attr('height', this.barHeight * 2.5)
      .attr('transform', `translate(${valWidth - (valLocation == 0
        ? -1
        : 0)}, ${this.barHeight / 4})`)
    currentTick.append('rect')
      .classed('tick-bar', true)
      .attr('x', -1)
      .attr('width', 1)
      .attr('height', this.barHeight * 1.25)
    currentTick.append('text')
      .classed('tick-text', true)
      .attr('y', 0)
      .attr('text-anchor', valLocation > 0.9 ? 'end' : 'middle')
      .attr('transform', 'translate(0, -5)')
      .text(this.props.value.toLocaleString('en'))

    // draw the actual bar as an unfilled bar ontop of a filled bar
    const halfCir = this.barHeight / 2
    mainG.append('path')
      .classed('filled', true)
      .attr('d', `M${halfCir},${halfCir + 0.25} l${valWidth - halfCir},0 0,${this.barHeight} -${valWidth - halfCir},0 a${halfCir},${halfCir} 0 0 1 0 -${this.barHeight}`)

    // Need to draw open twice. One for the background. One for the stripe
    mainG.append('rect')
      .classed('not-filled', true)
      .attr('fill', '#f2f3f4')
      .attr('y', this.barHeight / 2)
      .attr('x', lockedTierStart + 0.50)
      .attr('width', barLength - lockedTierStart)
      .attr('height', this.barHeight)
    mainG.append('rect')
      .classed('not-filled', true)
      .attr('fill', 'url(#lockedPattern)')
      .attr('y', this.barHeight / 2)
      .attr('x', lockedTierStart + 0.50)
      .attr('width', barLength - lockedTierStart)
      .attr('height', this.barHeight)

    // Draw underused / overcharge bar
    if (freeTierExceeded) {
      mainG.append('rect')
        .classed('filledSecondary', true)
        .classed('unlocked', !this.props.locked)
        .attr('x', valWidth)
        .attr('y', this.barHeight / 2 + 0.25)
        .attr('width', lockedTierStart - valWidth)
        .attr('height', this.barHeight)
    } else {
      mainG.append('rect')
        .classed('overage', true)
        .attr('x', lockedTierStart)
        .attr('y', this.barHeight / 2 + 0.25)
        .attr('width', valWidth - lockedTierStart)
        .attr('height', this.barHeight)
      svg.classed('overage', true)
    }

    if (this.props.locked) {
      // Draw text that the Pro version is locked
      mainG.append('text')
        .classed('text', true)
        .attr('x', (barLength + Math.max(valWidth, lockedTierStart)) / 2)
        .attr('y', this.barHeight + 5)
        .attr('text-anchor', 'middle')
        .html(this.props.lockedMessage)
    }
  }

  render() {
    const {className} = this.props
    return <div ref={this.myRef} className={`${className} usage-progress-bar`} />
  }
}

const UsageProgressBar: React.FC<Omit<IUsageProgressBarProps, 'parentWidth'>> = props => (
  <Measure bounds>
    {({measureRef, contentRect}) => (
      <div ref={measureRef}>
        {!!contentRect.bounds.width &&
          <UsageProgressBarNR {...props} parentWidth={contentRect.bounds.width} />
        }
      </div>
    )}
  </Measure>
)

export {
  UsageProgressBar,
}
