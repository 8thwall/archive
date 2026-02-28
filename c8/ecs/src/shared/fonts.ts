// @attr[](visibility = "//reality/app/nae/packager:__subpackages__")
// @attr[](visibility = "//c8/ecs:__subpackages__")
// @attr[](visibility = "//reality/cloud:shared")

// Hardcoded these fonts for now. Will need to change to dynamically generate
// fonts base on the font file uploaded by users in the future
// TODO (tri) change static fonts to dynamic ones

type Font = {
  json: string
  png: string
  ttf: string
}

const FONTS: Map<string, Font> = new Map([
  [
    'Nunito', {
      json: 'https://cdn.8thwall.com/web/font-atlases/nunito/nunito.json',
      png: 'https://cdn.8thwall.com/web/font-atlases/nunito/nunito.png',
      ttf: 'https://cdn.8thwall.com/web/fonts/Nunito-Regular.ttf',
    },
  ],
  [
    'Baskerville', {
      json: 'https://cdn.8thwall.com/web/font-atlases/baskerville/baskerville.json',
      png: 'https://cdn.8thwall.com/web/font-atlases/baskerville/baskerville.png',
      ttf: 'https://cdn.8thwall.com/web/fonts/libre-baskerville-regular.ttf',
    },
  ],
  [
    'Futura', {
      json: 'https://cdn.8thwall.com/web/font-atlases/futura/futura.json',
      png: 'https://cdn.8thwall.com/web/font-atlases/futura/futura.png',
      ttf: 'https://cdn.8thwall.com/web/fonts/futura-regular.ttf',
    },
  ],
  [
    'Nanum Pen Script', {
      json: 'https://cdn.8thwall.com/web/font-atlases/nanum_pen_script/nanum_pen_script.json',
      png: 'https://cdn.8thwall.com/web/font-atlases/nanum_pen_script/nanum_pen_script.png',
      ttf: 'https://cdn.8thwall.com/web/fonts/nanum-pen-script-regular.ttf',
    },
  ],
  [
    'Press Start 2p', {
      json: 'https://cdn.8thwall.com/web/font-atlases/press_start_2p/press_start_2p.json',
      png: 'https://cdn.8thwall.com/web/font-atlases/press_start_2p/press_start_2p.png',
      ttf: 'https://cdn.8thwall.com/web/fonts/press-start-2p-regular.ttf',
    },
  ],
  [
    'Inconsolata', {
      json: 'https://cdn.8thwall.com/web/font-atlases/inconsolata/inconsolata.json',
      png: 'https://cdn.8thwall.com/web/font-atlases/inconsolata/inconsolata.png',
      ttf: 'https://cdn.8thwall.com/web/fonts/inconsolata-regular.ttf',
    },
  ],
  [
    'Roboto', {
      json: 'https://cdn.8thwall.com/web/font-atlases/roboto/roboto.json',
      png: 'https://cdn.8thwall.com/web/font-atlases/roboto/roboto.png',
      ttf: 'https://cdn.8thwall.com/web/fonts/roboto-regular.ttf',
    },
  ],
])

const DEFAULT_FONT_NAME = 'Nunito'
const DEFAULT_FONT = FONTS.get(DEFAULT_FONT_NAME)!

export type {
  Font,
}

export {
  FONTS,
  DEFAULT_FONT_NAME,
  DEFAULT_FONT,
}
