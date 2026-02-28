/* eslint-disable max-len */
import type {AFrameAttribute} from '../aframe-primitives'

const TEXT_ATTRIBUTES: AFrameAttribute[] = [
  {
    name: 'align',
    detail: 'text.align',
    description: 'Multi-line text alignment (left, center, right).',
    default: 'left',
  },
  {
    name: 'alpha-test',
    detail: 'text.alphaTest',
    description: 'Discard text pixels if alpha is less than this value.',
    default: '0.5',
  },
  {
    name: 'anchor',
    detail: 'text.anchor',
    description: 'Horizontal positioning (left, center, right, align).',
    default: 'center',
  },
  {
    name: 'baseline',
    detail: 'text.baseline',
    description: 'Vertical positioning (top, center, bottom).',
    default: 'center',
  },
  {
    name: 'color',
    detail: 'text.color',
    description: 'Text color.',
    default: 'white',
  },
  {
    name: 'font',
    detail: 'text.font',
    description: 'Font to render text, either the name of one of A-Frame\'s stock fonts or a URL to a font file',
    default: 'default',
  },
  {
    name: 'font-image',
    detail: 'text.fontImage',
    description: 'Font image texture path to render text. Defaults to the font\'s name with extension replaced to .png. Don\'t need to specify if using a stock font.',
    default: '',
  },
  {
    name: 'height',
    detail: 'text.height',
    description: 'Height of text block.',
    default: '',
  },
  {
    name: 'letter-spacing',
    detail: 'text.letterSpacing',
    description: 'Letter spacing in pixels.',
    default: '0',
  },
  {
    name: 'line-height',
    detail: 'text.lineHeight',
    description: 'Line height in pixels.',
    default: '',
  },
  {
    name: 'opacity',
    detail: 'text.opacity',
    description: 'Opacity, on a scale from 0 to 1, where 0 means fully transparent and 1 means fully opaque.',
    default: '1.0',
  },
  {
    name: 'shader',
    detail: 'text.shader',
    description: 'Shader used to render text.',
    default: 'sdf',
  },
  {
    name: 'side',
    detail: 'text.side',
    description: 'Side to render. (front, back, double)',
    default: 'front',
  },
  {
    name: 'tab-size',
    detail: 'text.tabSize',
    description: 'Tab size in spaces.',
    default: '4',
  },
  {
    name: 'transparent',
    detail: 'text.transparent',
    description: 'Whether text is transparent.',
    default: 'true',
  },
  {
    name: 'value',
    detail: 'text.value',
    description: 'The actual content of the text. Line breaks and tabs are supported with \n and \t.',
    default: '"',
  },
  {
    name: 'white-space',
    detail: 'text.whiteSpace',
    description: 'How whitespace should be handled (i.e., normal, pre, nowrap). Read more about whitespace.',
    default: 'normal',
  },
  {
    name: 'width',
    detail: 'text.width',
    description: 'Width in meters.',
    default: '',
  },
  {
    name: 'wrap-count',
    detail: 'text.wrapCount',
    description: 'Number of characters before wrapping text (more or less).',
    default: '40',
  },
  {
    name: 'wrap-pixels',
    detail: 'text.wrapPixels',
    description: 'Number of pixels before wrapping text.',
    default: '',
  },
  {
    name: 'z-offset',
    detail: 'text.zOffset',
    description: 'Z-offset to apply to avoid Z-fighting if using with a geometry as a background.',
    default: '0.001',
  },
]

export {TEXT_ATTRIBUTES}
