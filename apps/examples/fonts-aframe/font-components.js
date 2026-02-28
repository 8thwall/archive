// See https://aframe.io/docs/1.0.0/components/text.html#custom-fonts
const textFontComponent = () => ({
  schema: {
    'color': {default: ''},
  },
  init() {
    const font = require('./assets/fonts/Monoid.fnt')
    const fontImage = require('./assets/fonts/Monoid.png')
    const attr =
    `value: text-component, custom font (local); 
    width: 1.3; 
    color: ${this.data.color}; 
    font: ${font}; 
    fontImage: ${fontImage}; 
    align: center;`
    this.el.setAttribute('text', attr)
  },
})

// See https://github.com/lojjic/aframe-troika-text
const troikaTextComponent = () => ({
  schema: {
    'color': {default: ''},
  },
  init() {
    const font = require('./assets/fonts/flexo.otf')
    const value = 'troika text custom font'
    this.el.setAttribute('troika-text', `value: ${value}; font: ${font}; color: ${this.data.color}; align: center`)
  },
})

const msdfTextComponent = () => ({
  schema: {
    'color': {default: ''},
  },
  init() {
    const value = 'msdf custom font'

    const fontBundle = require('./assets/fonts/custom-msdf.zip')
    const fontJson = fontBundle + 'custom-msdf.json'
    const fontPng = fontBundle + 'custom.png'

    this.el.setAttribute('text', `value: ${value}; font: ${fontJson}; font-image: ${fontPng}; color: ${this.data.color}; negate: false; align: center`)
  },
})

export {
  textFontComponent,
  troikaTextComponent,
  msdfTextComponent,
}
