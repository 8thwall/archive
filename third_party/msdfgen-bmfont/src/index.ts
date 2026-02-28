import pkg from 'arabic-persian-reshaper'
import {parse, loadSync} from 'opentype.js'
import * as child from 'child_process'

import mapLimit from 'map-limit'
import {MaxRectsPacker} from 'maxrects-packer'
import * as path from 'path'

import * as ProgressBar from 'cli-progress'
import * as fs from 'fs'
import Jimp from 'jimp'
import * as readline from 'readline'
import * as assert from 'assert'

import {
  roundNumber,
  valueQueue,
  bufferToArrayBuffer,
  roundAllValue,
  stringify,
  setTolerance,
  filterContours,
  stringifyContours,
} from './lib/utils'

const {ArabicShaper: reshaper} = pkg
const {exec} = child

// eslint-disable-next-line
const defaultCharset = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split('')
// eslint-disable-next-line
// const japaneseCharset = 'ーぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ゛゜'.split('')
const controlChars = ['\n', '\r', '\t']

const binaryLookup = {
  darwin: 'msdfgen.osx',
  darwin_arm64: 'msdfgen.osx',
  win32: 'msdfgen.exe',
  linux: 'msdfgen.linux',
  linux_arm64: 'msdfgen.linux',
}

function generateImage(opt, genImgCallback) {
  const {binaryPath, font, fontSize, fieldType, distanceRange, roundDecimal, debug, tolerance} = opt
  const {char} = opt
  const glyph = font.charToGlyph(char)
  const unicode = char.charCodeAt(0)
  if (!glyph.unicodes || glyph.unicodes === 'undefined') {
    console.warn('Invalid unicode found, skipping')
    return genImgCallback(null, null)
  }
  if (!glyph.unicodes.includes(unicode)) {
    console.warn('Char unicode and glyph unicode mismatch, skipping')
    return genImgCallback(null, null)
  }
  const {commands} = glyph.getPath(0, 0, fontSize)
  const contours = []
  let currentContour = []
  const bBox = glyph.getPath(0, 0, fontSize).getBoundingBox()
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

  if (tolerance !== 0) {
    setTolerance(tolerance, tolerance * 10)
    const numFiltered = filterContours(contours)
    if (numFiltered && debug) console.log(`\n${glyph.name} removed ${numFiltered} small contour(s)`)
    // let numReversed = utils.alignClockwise(contours, false);
    // if (numReversed && debug)
    //   console.log(`${char} found ${numReversed}/${contours.length} reversed contour(s)`);
  }
  const shapeDesc = stringifyContours(contours)

  if (contours.some(cont => cont.length === 1)) {
    console.log('length is 1, failed to normalize glyph')
  }
  const scale = fontSize / font.unitsPerEm
  const baseline = font.tables.os2.sTypoAscender * (fontSize / font.unitsPerEm)
  // eslint-disable-next-line
  const pad = distanceRange >> 1
  let width = Math.round(bBox.x2 - bBox.x1) + pad + pad
  let height = Math.round(bBox.y2 - bBox.y1) + pad + pad
  let xOffset = Math.round(-bBox.x1) + pad
  let yOffset = Math.round(-bBox.y1) + pad
  if (roundDecimal != null) {
    xOffset = roundNumber(xOffset, roundDecimal)
    yOffset = roundNumber(yOffset, roundDecimal)
  }
  let command = `"${binaryPath}" ${fieldType} -format text -stdout -size ${width} ${height}`
  command += ` -translate ${xOffset} ${yOffset} -pxrange ${distanceRange} -stdin`

  const subproc = exec(command, (err, stdout) => {
    if (err) {
      console.log('About to Error on Character:')
      console.log(glyph)
      return genImgCallback(null, null)
    }
    // split on every number, parse from hex
    const rawImageData = stdout.match(/([0-9a-fA-F]+)/g).map(str => parseInt(str, 16))
    const pixels = []
    const channelCount = rawImageData.length / width / height
    if (!Number.isNaN(channelCount) && channelCount % 1 !== 0) {
      console.error(command)
      console.error(stdout)
      return genImgCallback(new RangeError('msdfgen returned an image with an invalid length'))
    }
    if (fieldType === 'msdf') {
      for (let i = 0; i < rawImageData.length; i += channelCount) {
        // add 255 as alpha every 3 elements
        pixels.push(...rawImageData.slice(i, i + channelCount), 255)
      }
    } else if (fieldType === 'mtsdf') {
      for (let i = 0; i < rawImageData.length; i += channelCount) {
        pixels.push(...rawImageData.slice(i, i + channelCount))
      }
    } else {
      for (let i = 0; i < rawImageData.length; i += channelCount) {
        // make monochrome w/ alpha
        pixels.push(rawImageData[i], rawImageData[i], rawImageData[i], rawImageData[i])
      }
    }
    let imageData
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
    const container = {
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
    return genImgCallback(null, container)
  })
  subproc.stdin.write(shapeDesc)
  subproc.stdin.write('\n')
  subproc.stdin.destroy()

  return null
}

const limitCallback = async (err, results, finalCb, packer, bar, charset, glyphset, opt) => {
  if (err) finalCb(err)
  bar.stop()

  const {
    fontSize,
    fieldType,
    distanceRange,
    roundDecimal,
    debug,
    pages,
    filename,
    chars,
    fontDir,
    font,
    fontface,
    fontPadding,
    baseline,
    fontSpacing,
    os2,
    outputType,
    settings,
    allGlyphs,
  } = opt

  const filteredResults = results.filter(x => !!x)

  packer.addArray(filteredResults)
  const textures = packer.bins.map(async (bin, index) => {
    let svg = ''
    let texname = ''
    let fillColor = 0x00000000
    if (fieldType === 'msdf' || fieldType === 'mtsdf') {
      fillColor = 0x000000ff
    }
    console.log(fillColor)
    const img = new Jimp(bin.width, bin.height, fillColor)
    if (index > pages.length - 1) {
      if (packer.bins.length > 1) texname = `${filename}.${index}`
      else texname = filename
      pages.push(`${texname}.png`)
    } else {
      texname = path.basename(pages[index], path.extname(pages[index]))
      const imgPath = path.join(fontDir, `${texname}.png`)
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
        if (debug) {
          // eslint-disable-next-line
          const x_woffset = rect.x - rect.data.fontData.xoffset + (distanceRange >> 1)
          // eslint-disable-next-line
          const y_woffset = rect.y - rect.data.fontData.yoffset + baseline + (distanceRange >> 1)
          svg += `${font.charToGlyph(rect.data.fontData.char)
            .getPath(x_woffset, y_woffset, fontSize).toSVG()}\n`
        }
      }
      const charData = rect.data.fontData
      charData.x = rect.x
      charData.y = rect.y
      charData.page = index
      chars.push(charData)
    })
    const buffer = await img.getBufferAsync(Jimp.MIME_PNG)
    const tex = {
      filename: path.join(fontDir, texname),
      texture: buffer,
      svg: undefined,
    }
    if (debug) tex.svg = svg
    return tex
  })
  const asyncTextures = await Promise.all(textures)

  const kernings = []
  if (!allGlyphs && charset && charset.length > 0) {
    console.log('charset is not empty')
    charset.forEach((first) => {
      charset.forEach((second) => {
        const firstGlyph = font.charToGlyph(first)
        const secondGlyph = font.charToGlyph(second)
        const amount = font.getKerningValue(firstGlyph, secondGlyph)
        if (amount !== 0) {
          kernings.push({
            first: first.charCodeAt(0),
            second: second.charCodeAt(0),
            amount: amount * (fontSize / font.unitsPerEm),
          })
        }
      })
    })
  } else if (allGlyphs && glyphset && glyphset.length > 0) {
    console.log('glyphset is not empty')
    glyphset.forEach((first) => {
      glyphset.forEach((second) => {
        const amount = font.getKerningValue(first, second)
        if (amount !== 0) {
          first.unicodes.forEach((firstUnicode) => {
            second.unicodes.forEach((secondUnicode) => {
              kernings.push({
                first: firstUnicode,
                second: secondUnicode,
                amount: amount * (fontSize / font.unitsPerEm),
              })
            })
          })
        }
      })
    })
  }

  const scale = fontSize / font.unitsPerEm
  const fontData = {
    pages,
    chars,
    info: {
      face: fontface,
      size: fontSize,
      bold: 0,
      italic: 0,
      charset,
      unicode: 1,
      stretchH: 100,
      smooth: 1,
      aa: 1,
      padding: fontPadding,
      spacing: fontSpacing,
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
      fieldType,
      distanceRange,
    },
    kernings,
  }
  if (roundDecimal !== null) roundAllValue(fontData, roundDecimal, true)
  const fontFile = {filename: undefined, data: undefined, settings: undefined}
  const ext = outputType === 'json' ? '.json' : '.fnt'
  fontFile.filename = path.join(fontDir, fontface + ext)
  // NOTE(johnny): We only want to support JSON.
  fontFile.data = stringify(fontData, 'json' || outputType)

  // Store pages name and available packer freeRects in settings
  settings.pages = pages
  settings.packer = {}
  settings.packer.bins = packer.save()
  fontFile.settings = settings

  console.log('\nGeneration complete!\n')
  finalCb(null, asyncTextures, fontFile)
}

/**
 * Creates a BMFont compatible bitmap font of signed distance fields from a font file
 *
 * @param {string|Buffer} fontPath - Path or Buffer for the input ttf/otf/woff font
 * @param {Object} opt - Options object for generating bitmap font (Optional) :
 *            outputType : font file format Avaliable: xml(default), json, txt
 *            filename : filename of both font file and font textures
 *            fontSize : font size for generated textures (default 42)
 *            charset : charset in generated font, could be array or string (default is Western)
 *            textureWidth : Width of generated textures (default 512)
 *            textureHeight : Height of generated textures (default 512)
 *            distanceRange : distance range for computing signed distance field
 *            fieldType : "msdf"(default), "sdf", "psdf"
 *            roundDecimal  : rounded digits of the output font file. (Defaut is null)
 *            smartSize : shrink atlas to the smallest possible square (Default: false)
 *            pot : atlas size shall be power of 2 (Default: false)
 *            square : atlas size shall be square (Default: false)
 *            rot : allow 90-degree rotation while packing (Default: false)
 *            rtl : use RTL charators fix (Default: false)
 *            allGlyphs : generate all glyphs in charset (Default: false)
 * @param {function(string, Array.<Object>, Object)} callback
 *            Callback funtion(err, textures, font)
 *
 */
function generateBMFont(fontPath, opt, callback) {
  const lookupKey = process.arch === 'arm64'
    ? `${process.platform}_${process.arch}` : process.platform

  const binName = binaryLookup[lookupKey]

  assert.ok(binName, `No msdfgen binary for platform ${lookupKey}.`)
  assert.ok(fontPath, 'must specify a font path')
  assert.ok(
    typeof fontPath === 'string' || fontPath instanceof Buffer,
    'font must be string path or Buffer'
  )
  assert.ok(
    opt.filename || !(fontPath instanceof Buffer),
    'must specify filename if font is a Buffer'
  )
  assert.ok(callback, 'missing callback')
  assert.ok(typeof callback === 'function', 'expected callback to be a function')
  assert.ok(
    !opt.textureSize || opt.textureSize.length === 2,
    'textureSize format shall be: width,height'
  )

  // Set fallback output path to font path
  let fontDir = typeof fontPath === 'string' ? path.dirname(fontPath) : ''
  const binaryPath = path.join(__dirname, '..', 'bin', process.platform, binName)

  let reuse,
    cfg = {opt: undefined, packer: undefined, pages: undefined}
  if (typeof opt.reuse !== 'undefined' && typeof opt.reuse !== 'boolean') {
    if (!fs.existsSync(opt.reuse)) {
      console.log(`Creating cfg file : ${opt.reuse}`)
      reuse = {}
    } else {
      console.log(`Loading cfg file : ${opt.reuse}`)
      cfg = JSON.parse(fs.readFileSync(opt.reuse, 'utf8'))
      reuse = cfg.opt
    }
  } else reuse = {}
  const outputType = valueQueue([opt.outputType, reuse.outputType, 'xml'])
  opt.outputType = outputType
  let filename = valueQueue([opt.filename, reuse.filename])
  const distanceRange = valueQueue([opt.distanceRange, reuse.distanceRange, 4])
  opt.distanceRange = distanceRange
  const fontSize = valueQueue([opt.fontSize, reuse.fontSize, 42])
  opt.fontSize = fontSize
  const fontSpacing = valueQueue([opt.fontSpacing, reuse.fontSpacing, [0, 0]])
  opt.fontSpacing = fontSpacing
  // eslint-disable-next-line
  const pad = distanceRange >> 1
  const fontPadding = valueQueue(
    [opt.fontPadding, reuse.fontPadding, [pad, pad, pad, pad]]
  )
  opt.fontPadding = fontPadding
  const [textureWidth, textureHeight] = valueQueue(
    [opt.textureSize || reuse.textureSize, [512, 512]]
  )
  opt.textureWidth = textureWidth
  opt.textureHeight = textureHeight
  const texturePadding = valueQueue(
    [opt.texturePadding, reuse.texturePadding, 1]
  )
  opt.texturePadding = texturePadding
  const border = valueQueue([opt.border, reuse.border, 0])
  opt.border = border
  const fieldType = valueQueue([opt.fieldType, reuse.fieldType, 'msdf'])
  opt.fieldType = fieldType
  // if no roudDecimal option, left null as-is
  const roundDecimal = valueQueue([opt.roundDecimal, reuse.roundDecimal])
  opt.roundDecimal = roundDecimal
  const smartSize = valueQueue([opt.smartSize, reuse.smartSize, false])
  opt.smartSize = smartSize
  const pot = valueQueue([opt.pot, reuse.pot, false])
  opt.pot = pot
  const square = valueQueue([opt.square, reuse.square, false])
  opt.square = square
  const debug = opt.vector || false
  const tolerance = valueQueue([opt.tolerance, reuse.tolerance, 0])
  opt.tolerance = tolerance
  const isRTL = valueQueue([opt.rtl, reuse.rtl, false])
  opt.rtl = isRTL
  const allowRotation = valueQueue([opt.rot, reuse.rot, false])
  opt.rot = allowRotation
  if (opt.charset && isRTL) opt.charset = reshaper.convertArabic(opt.charset)
  // eslint-disable-next-line
  let charset = (typeof opt.charset === 'string' ? Array.from(opt.charset) : opt.charset) || reuse.charset || defaultCharset
  opt.charset = charset

  // TODO: Validate options
  if (fieldType !== 'msdf' &&
    fieldType !== 'sdf' &&
    fieldType !== 'psdf' &&
    fieldType !== 'mtsdf'
  ) {
    throw new TypeError('fieldType must be one of msdf, sdf, or psdf')
  }

  const font = typeof fontPath === 'string'
    ? loadSync(fontPath)
    : parse(bufferToArrayBuffer(fontPath))

  if (font.outlinesFormat !== 'truetype' && font.outlinesFormat !== 'cff') {
    throw new TypeError('must specify a truetype font (ttf, otf, woff)')
  }
  const packer = new MaxRectsPacker(textureWidth, textureHeight, texturePadding, {
    smart: smartSize,
    pot,
    square,
    allowRotation,
    tag: false,
    border,
  })
  const chars = []

  // Remove duplicate & control chars
  charset = charset.filter((e, i, self) => (i === self.indexOf(e)) && (!controlChars.includes(e)))

  const {os2} = font.tables
  // eslint-disable-next-line
  const baseline = os2.sTypoAscender * (fontSize / font.unitsPerEm) + (distanceRange >> 1)

  const fontface = typeof fontPath === 'string'
    ? path.basename(fontPath, path.extname(fontPath))
    : filename

  if (!filename) {
    filename = fontface
    console.log(`Use font-face as filename : ${filename}`)
  } else {
    if (opt.filename) fontDir = path.dirname(opt.filename)
    // eslint-disable-next-line
    filename = opt.filename = path.basename(filename, path.extname(filename))
  }

  // Initialize settings
  const settings = {opt: undefined}
  settings.opt = JSON.parse(JSON.stringify(opt))
  delete settings.opt.reuse  // prune previous settings
  let pages = []
  if (cfg.packer !== undefined) {
    pages = cfg.pages
    packer.load(cfg.packer.bins)
  }

  const bar = new ProgressBar.Bar({
    format: 'Generating {percentage}%|{bar}| ({value}/{total}) {duration}s',
    clearOnComplete: true,
  }, ProgressBar.Presets.shades_classic)

  const allGlyphsList = []
  if (opt.allGlyphs) {
    charset = []
    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i)
      if (glyph.unicodes) {
        allGlyphsList.push(glyph)
        for (const unicode of glyph.unicodes) {
          charset.push(String.fromCharCode(unicode))
        }
      }
    }
    // For now, don't use isRTL for allGlyphs, as it's behavior causes issues for some glyphs/codes
    // if (isRTL) charset = reshaper.convertArabic(charset.join('')).split('')
  }
  bar.start(charset.length, 0)
  mapLimit(charset, 15, (char, cb) => {
    generateImage({
      binaryPath,
      font,
      char,
      fontSize,
      fieldType,
      distanceRange,
      roundDecimal,
      debug,
      tolerance,
      fontPath,
    }, (err, res) => {
      if (err) return cb(err)
      bar.increment()
      return cb(null, res)
    })
  }, async (err, results) => {
    limitCallback(
      err,
      results,
      callback,
      packer,
      bar,
      charset,
      allGlyphsList,
      {
        fontSize,
        fieldType,
        distanceRange,
        roundDecimal,
        debug,
        pages,
        filename,
        chars,
        fontDir,
        font,
        fontface,
        fontPadding,
        fontSpacing,
        baseline,
        os2,
        outputType,
        settings,
        allGlyphs: opt.allGlyphs,
      }
    )
  })
}

export default generateBMFont
