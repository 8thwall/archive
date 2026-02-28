import * as React from 'react'
import type {FunctionComponent} from 'react'
import * as d3 from 'd3'

import {Icon} from '../ui/components/icon'

interface ICommitChart {
  solidPointers: number[]
  rowHeight: number
  numLines: number
  skipIdx?: number[]
  width?: number
  showLanding?: boolean
  className?: string
}
class CommitChart extends React.Component<ICommitChart> {
  private myRef = React.createRef<HTMLDivElement>()

  private dotSize = 10

  private arrowSectionWidth = 90

  private arrowStepX = 10

  private inflectionCurveR = 9

  private numLabels = 3

  // dev, staging, prod
  private arrowHeadSize = 10

  private arrowLeftPad = this.arrowSectionWidth - this.numLabels * this.arrowStepX - this.arrowHeadSize

  componentDidMount() { this.renderChart() }

  componentDidUpdate() { this.renderChart() }

  drawDeploymentArrow = (startIdx, endIdxStr, inflectionColumn, dotPaddingX) => {
    // the chart left legends are pushed down by 1 if there is a skip element at index 0
    // this happens when our client is synced (client branch is at the top)
    const startIdxWithSkip = (this.props.skipIdx && this.props.skipIdx.includes(0))
      ? startIdx + 1
      : startIdx
    const startY = this.props.rowHeight / 2 + startIdxWithSkip * this.props.rowHeight
    const endIdx = parseInt(endIdxStr, 10)
    const endIdxWithSkip = !this.props.skipIdx
      ? endIdx
      : this.props.skipIdx.reduce((o, v) => (v <= endIdx
        ? o + 1
        : o), endIdx)

    if (startIdxWithSkip === endIdxWithSkip) {
      // no inflections in the arrow path, straight horizontal line
      return `M${dotPaddingX}, ${startY} H${this.arrowSectionWidth - dotPaddingX}`
    }

    const endY = this.props.rowHeight / 2 + endIdxWithSkip * this.props.rowHeight

    // Inflection X location changes when endIdx is above startIdxWithSkip so the lines are never crossed
    const positiveInflectionX = this.arrowLeftPad + inflectionColumn * this.arrowStepX - this.inflectionCurveR
    const inflectionX = endIdx > startIdxWithSkip
      ? positiveInflectionX
      : this.arrowSectionWidth - positiveInflectionX
    const yInflectionCurveR = endIdxWithSkip > startIdxWithSkip
      ? this.inflectionCurveR
      : -this.inflectionCurveR
    const yInflectionSweepFlag = endIdxWithSkip > startIdxWithSkip ? 1 : 0
    return `M${dotPaddingX}, ${startY} H${inflectionX} ` +
      `a ${this.inflectionCurveR} ${this.inflectionCurveR}, 0, 0, ${yInflectionSweepFlag} ${this.inflectionCurveR} ${yInflectionCurveR}` +
      `V ${endY - yInflectionCurveR} ` +
      `a ${this.inflectionCurveR} ${this.inflectionCurveR}, 0, 0, ${yInflectionSweepFlag
        ? 0
        : 1} ${this.inflectionCurveR} ${yInflectionCurveR}` +
      `H ${this.arrowSectionWidth - dotPaddingX}`
  }

  renderChart = () => {
    const dotPaddingY: number = (this.props.rowHeight - this.dotSize) / 2
    const dotPaddingX: number = 5

    const myDom = d3.select(this.myRef.current)
    const svg = myDom.select('svg').empty() ? myDom.append('svg') : myDom.select('svg')
    svg.selectAll('*').remove()
    svg.style('width', '100%')
      .style('overflow', 'visible')  // when a scrollbar is introduced, no resize event has happened
      .attr('width', this.props.width || 200)
      .attr('height', this.props.numLines * this.props.rowHeight)
    const defs = svg.append('defs')
    // We have define each color arrow head separately
    ;['#464766', '#464766', '#464766', '#464766'].forEach((color, i) => {
      defs.append('marker')
        .attr('id', `arrowHead${i}`)
        .attr('class', 'marker')
        .attr('viewBox', '0 0 10 10')
        .attr('fill', color)
        .attr('stroke-width', '0')
        .attr('orient', 'auto')
        .attr('markerWidth', '5')
        .attr('markerHeight', '5')
        .attr('refX', '5')
        .attr('refY', '5')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    })

    if (this.props.showLanding) {
      const landingG = svg.append('g')
        .attr('transform', `translate(${this.arrowSectionWidth}, 0)`)
      landingG.append('path')
        .attr('class', 'line temporary')
        .attr('d',
          `M${this.props.rowHeight / 2} ${dotPaddingY} v${this.props.rowHeight - dotPaddingY}`)
      landingG.append('circle')
        .attr('class', 'temporary')
        .attr('cx', this.props.rowHeight / 2)
        .attr('cy', this.props.rowHeight / 2)
        .attr('r', this.dotSize / 2)
    }

    const skipFirst = this.props.skipIdx && this.props.skipIdx.includes(0)
    const vertOffset = skipFirst ? this.props.rowHeight : 0
    const mainG = svg.append('g')
      .attr('transform', `translate(${this.arrowSectionWidth}, ${this.props.rowHeight})`)
    // draw the vertical line
    const numLinesWithSkip = this.props.numLines + (this.props.skipIdx
      ? this.props.skipIdx.length
      : 0)
    const verticalMainLine = mainG.append('path')
      .attr('class', 'line')
      .attr('d', `M${this.props.rowHeight / 2} ` +
        `${!this.props.showLanding ? dotPaddingY + vertOffset : 0} ` +
        `V${numLinesWithSkip * this.props.rowHeight - dotPaddingY}`)
    const circleIndices = [...Array(numLinesWithSkip).keys()]
      .filter(i => !this.props.skipIdx || !this.props.skipIdx.includes(i))
    mainG.selectAll('circle').data(circleIndices).enter()
      .append('circle')
      .attr('cx', v => this.props.rowHeight / 2)
      .attr('cy', v => this.props.rowHeight / 2 + v * this.props.rowHeight)
      .attr('r', this.dotSize / 2)

    const deploymentPointersData = [...this.props.solidPointers]

    const pointerG = svg.append('g')
      .attr('transform', `translate(0, ${this.props.rowHeight})`)
    pointerG.selectAll('path').data(deploymentPointersData).enter()
      .append('path')
      .attr('class', (targetIdx, i) => `pointer target-${i}`)
      .attr('d', (targetIdx, i) => (targetIdx >= 0
        ? this.drawDeploymentArrow(i, targetIdx, this.props.solidPointers.length - i - 1, dotPaddingX)
        : ''))
  }

  render() {
    return <div className={this.props.className} ref={this.myRef} />
  }
}

interface IClientBranch {
  name: string
  link: string
  className: string
  rowHeight: number
  content?: React.ReactNode
}
const ClientBranch: FunctionComponent<IClientBranch> = ({
  name, content, link, className, rowHeight,
}) => {
  const clientContent = content || link?.split('/')[2]
  return (
    <div className={className}>
      <div className='branch-split'>
        <svg className='pre-arrow' style={{left: '-75px'}}>
          <path
            d={`M14,${rowHeight + 11} a 45 35 0 0 1 50 -${rowHeight} h 0`}
            stroke='#464766'
            strokeWidth='2'
            fill='none'
          />
        </svg>
        <Icon stroke='codeBranch' /> {name}
      </div>
      {link
        ? <a target='_blank' href={link} rel='noreferrer'>{clientContent}</a>
        : clientContent
      }
    </div>
  )
}

export {
  CommitChart,
  ClientBranch,
}
