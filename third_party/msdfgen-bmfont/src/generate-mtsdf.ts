import {parse, Font, PathCommand} from 'opentype.js'
import mapLimit from 'map-limit'
import {MaxRectsPacker, Rectangle} from 'maxrects-packer'
import * as path from 'path'
import * as fs from 'fs'
import Jimp from 'jimp'
import * as readline from 'readline'
import {promisify} from 'util'
import {exec as execWithCallback} from 'child_process'

import {
  bufferToArrayBuffer,
  roundAllValue,
  roundNumber,
  stringifyContours,
} from './lib/utils'

const exec = promisify(execWithCallback)

// eslint-disable-next-line
const DEFAULT_CHARSET = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split('')
const FILL_COLOR = 0x00000000
const FONT_SIZE = 64
const DISTANCE_RANGE = 4
const ROUND_DECIMAL = 4
const PACKER_DEFAULTS = {
  width: 512,
  height: 512,
  padding: 1,
  opts: {
    smart: true,
    pot: false,
    square: false,
    allowRotation: false,
    tag: false,
    border: 0,
  },
}

const createMaxRectsPacker = () => new MaxRectsPacker(PACKER_DEFAULTS.width, PACKER_DEFAULTS.height,
  PACKER_DEFAULTS.padding, PACKER_DEFAULTS.opts)

type FontData = {
  id: number
  index: number
  char: string
  width: number
  height: number
  xoffset: number
  yoffset: number
  xadvance: number
}

type CharData = {
  x: number
  y: number
  page: number
} & FontData

type GlyphData = {
  data: {
    imageData: Jimp
    fontData: FontData
  }
  width: number
  height: number
}

type ImageOutput = {
  err: Error
  res: GlyphData
}

type Kerning = {
  first: number
  second: number
  amount: number
}

const generateImage = async (
  binaryPath: string, font: Font, char: string
): Promise<ImageOutput> => {
  const glyph = font.charToGlyph(char)
  const unicode = char.charCodeAt(0)

  if (!glyph.unicodes || glyph.unicodes === undefined) {
    console.warn('Invalid unicode found, skipping')
    return {err: null, res: null}
  }
  if (!glyph.unicodes.includes(unicode)) {
    console.warn('Char unicode and glyph unicode mismatch, skipping')
    return {err: null, res: null}
  }

  const {commands} = glyph.getPath(0, 0, FONT_SIZE)
  const contours: PathCommand[][] = []
  let currentContour: PathCommand[] = []
  commands.forEach((command) => {
    if (command.type === 'M') {  // new contour
      if (currentContour.length > 0) {
        contours.push(currentContour)
        currentContour = []
      }
    }
    currentContour.push(command)
  })
  contours.push(currentContour)

  if (contours.some(cont => cont.length === 1)) {
    console.log('length is 1, failed to normalize glyph')
  }

  const shapeDesc = stringifyContours(contours)
  // eslint-disable-next-line
  const pad = DISTANCE_RANGE >> 1
  const bBox = glyph.getPath(0, 0, FONT_SIZE).getBoundingBox()
  let width = Math.round(bBox.x2 - bBox.x1) + pad + pad
  let height = Math.round(bBox.y2 - bBox.y1) + pad + pad
  const xOffset = roundNumber(Math.round(-bBox.x1) + pad, ROUND_DECIMAL)
  const yOffset = roundNumber(Math.round(-bBox.y1) + pad, ROUND_DECIMAL)

  let cmd = `${binaryPath} mtsdf -format text -stdout -size ${width} ${height} `
  cmd += `-translate ${xOffset} ${yOffset} -pxrange ${DISTANCE_RANGE} -defineshape "${shapeDesc}"`

  const {stdout, stderr} = await exec(cmd)

  if (stderr) {
    console.log('About to Error on Character:')
    console.log(glyph)
    return {err: null, res: null}
  }

  const rawImageData = stdout.match(/([0-9a-fA-F]+)/g).map(str => parseInt(str, 16))
  const pixels: number[] = []
  const channelCount = rawImageData.length / width / height
  if (!Number.isNaN(channelCount) && channelCount % 1 !== 0) {
    console.error(cmd)
    console.error(stdout)
    return {
      err: new RangeError('msdfgen returned an image with an invalid length'),
      res: null,
    }
  }
  for (let i = 0; i < rawImageData.length; i += channelCount) {
    pixels.push(...rawImageData.slice(i, i + channelCount))
  }
  let imageData: Jimp
  if (Number.isNaN(channelCount) || !rawImageData.some(x => x !== 0)) {  // if character is blank
    readline.clearLine(process.stdout as any, 0)
    readline.cursorTo(process.stdout as any, 0)
    console.log(
      `Warning: no bitmap for character '${glyph.name}' (${glyph.unicode}),
      adding to font as empty`
    )
    width = 0
    height = 0
  } else {
    const buffer = new Uint8ClampedArray(pixels)
    imageData = new Jimp({data: buffer, width, height})
  }

  const baseline = font.tables.os2.sTypoAscender * (FONT_SIZE / font.unitsPerEm)
  const scale = FONT_SIZE / font.unitsPerEm

  const container: GlyphData = {
    data: {
      imageData,
      fontData: {
        id: unicode,
        index: glyph.index,
        char,
        width,
        height,
        xoffset: Math.round(bBox.x1) - pad,
        yoffset: Math.round(bBox.y1) + pad + baseline,
        xadvance: glyph.advanceWidth * scale,
      },
    },
    width,
    height,
  }
  return {err: null, res: container}
}

type FontFile = {
  filename: string
  data: string
}

type Texture = {
  filename: string
  texture: Buffer
}

type Output = {
  error?: string
  textures: Texture[]
  font: FontFile
}

const limitCallback = async (
  fontPath: string, fontDir: string, results: GlyphData[], font: Font, charset: string[]
): Promise<Output> => {
  const pages: string[] = []
  const chars: CharData[] = []
  const basename = path.basename(fontPath)
  const filename = basename.replace(path.extname(basename), '')

  const {os2} = font.tables

  const baseline = font.tables.os2.sTypoAscender * (FONT_SIZE / font.unitsPerEm)

  const filteredResults = results.filter(x => !!x)

  // Create the packer that will be used to pack the glyphs into image(s).
  const packer = createMaxRectsPacker()

  packer.addArray(filteredResults as Rectangle[])

  const textures = packer.bins.map(async (bin, index) => {
    let textureName = ''
    const img = new Jimp(bin.width, bin.height, FILL_COLOR)
    if (index > pages.length - 1) {
      if (packer.bins.length > 1) {
        textureName = `${filename}${index}`
      } else {
        textureName = filename
      }
      pages.push(`${textureName}.png`)
    } else {
      textureName = path.basename(pages[index], path.extname(pages[index]))
      const imgPath = path.join(fontDir, `${textureName}.png`)
      console.log('Loading previous image : ', imgPath)
      const loader = Jimp.read(imgPath)
      loader.catch((loaderErr) => {
        console.warn('File read error: ', loaderErr)
      })
      const prevImg = await loader
      img.composite(prevImg, 0, 0)
    }
    bin.rects.forEach((rect) => {
      if (rect.data.imageData) {
        if (rect.rot) {
          rect.data.imageData.rotate(90)
        }
        img.composite(rect.data.imageData, rect.x, rect.y)
      }
      const charData = rect.data.fontData
      charData.x = rect.x
      charData.y = rect.y
      charData.page = index
      chars.push(charData)
    })
    const buffer = await img.getBufferAsync(Jimp.MIME_PNG)
    const tex = {
      filename: path.join(fontDir, textureName),
      texture: buffer,
    }
    return tex
  })
  const asyncTextures = await Promise.all(textures)

  const kernings: Kerning[] = []
  if (charset && charset.length > 0) {
    console.log('Generating kernings for charset')
    charset.forEach((first) => {
      charset.forEach((second) => {
        const firstGlyph = font.charToGlyph(first)
        const secondGlyph = font.charToGlyph(second)
        const amount = font.getKerningValue(firstGlyph, secondGlyph)
        if (amount !== 0) {
          kernings.push({
            first: first.charCodeAt(0),
            second: second.charCodeAt(0),
            amount: amount * (FONT_SIZE / font.unitsPerEm),
          })
        }
      })
    })
  }

  const scale = FONT_SIZE / font.unitsPerEm
  const fontData = {
    fontFile: basename,
    pages,
    chars,
    info: {
      face: filename,
      size: FONT_SIZE,
      bold: 0,
      italic: 0,
      charset,
      unicode: 1,
      stretchH: 100,
      smooth: 1,
      aa: 1,
      padding: [0, 0, 0, 0],
      spacing: [0, 0],
      outline: 0,
    },
    common: {
      lineHeight: (os2.sTypoAscender - os2.sTypoDescender + os2.sTypoLineGap) * scale,
      base: baseline,
      scaleW: packer.bins[0].width,
      scaleH: packer.bins[0].height,
      pages: packer.bins.length,
      packed: 0,
      alphaChnl: 0,
      redChnl: 0,
      greenChnl: 0,
      blueChnl: 0,
    },
    distanceField: {
      fieldType: 'mtsdf',
      distanceRange: DISTANCE_RANGE,
    },
    kernings,
  }

  roundAllValue(fontData, ROUND_DECIMAL, true)
  const fontFile: FontFile = {filename: undefined, data: undefined}
  fontFile.filename = path.join(fontDir, `${filename}.font8`)
  fontFile.data = JSON.stringify(fontData, null, 4)

  console.log('\nGeneration complete!\n')
  return {
    textures: asyncTextures,
    font: fontFile,
  }
}

const generateMtsdf = (
  binaryPath: string, fontPath: string, outputPath: string
): Promise<Output> => {
  const fontBuffer = fs.readFileSync(fontPath)
  const font = parse(bufferToArrayBuffer(fontBuffer))

  if (font.outlinesFormat !== 'truetype' && font.outlinesFormat !== 'cff') {
    throw new TypeError('must specify a truetype font (ttf, otf, woff)')
  }

  return new Promise((resolve, reject) => {
    mapLimit(
      DEFAULT_CHARSET,
      15,
      async (char: string, cb: (err: Error, res: GlyphData) => void) => {
        const {err, res} = await generateImage(binaryPath, font, char)

        return err ? cb(err, null) : cb(null, res)
      }, async (err: Error, results: GlyphData[]) => {
        if (err) {
          return reject(err)
        }

        const output = await limitCallback(
          fontPath,
          outputPath,
          results,
          font,
          DEFAULT_CHARSET
        )
        return resolve(output)
      }
    )
  })
}

export {
  generateMtsdf,
}
