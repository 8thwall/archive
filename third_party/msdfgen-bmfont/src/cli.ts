#!/usr/bin/env ts-node
import * as fs from 'fs'
import * as path from 'path'
import Handlebars from 'handlebars'
import {Command} from 'commander'

// eslint-disable-next-line
import isInvalidPath from 'is-invalid-path'
import generateBMFont from './index'
// eslint-disable-next-line
import {roundAllValue, valueQueue} from './lib/utils.js'
import pkg from '../package.json'

const program = new Command()

/**
 * Pad `str` to `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @return {String}
 * @api private
 */
function pad(str, width) {
  const len = Math.max(0, width - str.length)
  return str + Array(len + 1).join(' ')
}

/**
 * Return the largest length of string array.
 *
 * @param {Array.<String>} arr
 * @return {Number}
 * @api private
 */

function fileValidate(filePath) {
  if (isInvalidPath(filePath)) {
    console.error('File: ', filePath, ' not valid! Aborting...')
    return process.exit(1)
  } else return path.normalize(filePath)
}

function fileExistValidate(filePath) {
  try {
    if (fs.statSync(filePath).isFile()) return path.normalize(filePath)
    else {
      console.error('File: ', filePath, ' not found! Aborting...')
      return process.exit(1)
    }
  } catch (err) {
    console.error('File: ', filePath, ' not valid! Aborting...')
    return process.exit(1)
  }
}

function longestLength(arr) {
  return arr.reduce((max, element) => Math.max(max, element.length), 0)
}

let fontFile
program
  .version(`msdf-bmfont-xml v${pkg.version}`)
  .usage('[options] <font-file>')
  .arguments('<font_file>')
  .description('Creates a BMFont compatible bitmap font of signed distance fields from a font file')
  .option(
    '-f, --output-type <format>',
    'font file format: xml | json (default) | txt',
    /^(xml|json|txt)$/i, 'json'
  )
  .option('-o, --filename <atlas_path>',
    'filename of font textures (defaults: font-face) font filename always set to font-face name')
  .option('-s, --font-size <fontSize>', 'font size for generated textures', 42)
  .option('-i, --charset-file <charset>',
    'user-specified characters from text-file',
    fileExistValidate)
  .option('-m, --texture-size <w,h>', 'output texture atlas size', v => v.split(','), [512, 512])
  .option('-p, --texture-padding <n>', 'padding between glyphs', 1)
  .option('-b, --border <n>', 'space between glyphs textures & edge', 0)
  .option('-r, --distance-range <n>', 'distance range for SDF', 4)
  .option('-t, --field-type <type>',
    'msdf | sdf | psdf | mtsdf (default)',
    /^(msdf|sdf|psdf|mtsdf)$/i,
    'mtsdf')
  .option('-d, --round-decimal <digit>', 'rounded digits of the output font file.', 0)
  .option('-v, --vector', 'generate svg vector file for debugging', false)
  .option('-u, --reuse [file.cfg]', 'save/create config file for reusing settings', false)
  .option('    --smart-size', 'shrink atlas to the smallest possible square', true)
  .option('    --pot', 'atlas size shall be power of 2', false)
  .option('    --square', 'atlas size shall be square', false)
  .option('    --rot', 'allow 90-degree rotation while packing', false)
  .option('    --rtl', 'use RTL(Arabic/Persian) characters fix', false)
  .option('-a, --all-glyphs', 'generate all glyphs in charset (Default: false)', false)
  .action((file) => {
    fontFile = fileExistValidate(file)
  })
  .parse(process.argv)

//
// Initialize options
//
const opt = program.opts()
roundAllValue(opt)  // Parse all number from string
if (!fontFile) {
  console.error('Must specify font-file, use: \'msdf-bmfont -h\' for more infomation')
  process.exit(1)
}
const fontface = path.basename(fontFile, path.extname(fontFile))
const fontDir = path.dirname(fontFile)

//
// Set default value
//
// Note: somehow commander.js didn't parse boolean default value
// need to feed manually
//
opt.fontFile = fontFile
if (typeof opt.reuse === 'boolean') {
  opt.filename = valueQueue([opt.filename, path.join(fontDir, fontface)])
  opt.vector = valueQueue([opt.vector, false])
  opt.reuse = valueQueue([opt.reuse, false])
  opt.smartSize = valueQueue([opt.smartSize, false])
  opt.pot = valueQueue([opt.pot, false])
  opt.square = valueQueue([opt.square, false])
  opt.rot = valueQueue([opt.rot, false])
  opt.rtl = valueQueue([opt.rtl, false])
} else {
  opt.filename = valueQueue([opt.filename, path.join('./', fontface)])
}

//
// Display options
//
const keys = Object.keys(opt)
const padding = longestLength(keys) + 2
console.log('\nUsing following settings')
console.log('========================================')
keys.forEach((key) => {
  if (typeof opt.reuse === 'string' && typeof opt[key] === 'undefined') {
    console.log(`${pad(key, padding)}: Defined in [${opt.reuse}]`)
  } else if (key === 'charsetFile' && typeof opt[key] === 'undefined') {
    console.log(`${pad(key, padding)}: Unspecified, fallback to ASC-II`)
  } else console.log(`${pad(key, padding)}: ${opt[key]}`)
})
console.log('========================================')

//
// Validate
//
if (typeof opt.fontFile === 'undefined') {
  console.error('No font file specified, aborting.... use -h for help')
  process.exit(1)
}
if (typeof opt.reuse !== 'boolean') opt.reuse = fileValidate(opt.reuse)

fs.readFile(opt.charsetFile || '', 'utf8', (error, data) => {
  if (error) {
    console.warn('No valid charset file loaded, fallback to ASC-II')
  }
  if (data) opt.charset = data

  generateBMFont(opt.fontFile, opt, (genBMError, textures, font) => {
    if (genBMError) throw genBMError
    textures.forEach((texture, index) => {
      if (opt.vector) {
        const svgTemplate =
        `<?xml version="1.0"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="{{width}}" height="{{height}}">
{{{svgPath}}}
</svg>`
        const template = Handlebars.compile(svgTemplate)
        const content = template({
          width: opt.textureWidth,
          height: opt.textureHeight,
          svgPath: texture.svg,
        })
        fs.writeFile(`${texture.filename}.svg`, content, (err) => {
          if (err) throw err
          console.log('wrote svg[', index, ']         : ', `${texture.filename}.svg`)
        })
      }
      fs.writeFile(`${texture.filename}.png`, texture.texture, (err) => {
        if (err) throw err
        console.log('wrote spritesheet[', index, '] : ', `${texture.filename}.png`)
      })
    })
    fs.writeFile(font.filename, font.data, (err) => {
      if (err) throw err
      console.log('wrote font file        : ', font.filename)
    })
    if (opt.reuse !== false) {
      const cfgFileName = typeof opt.reuse === 'boolean' ? `${textures[0].filename}.cfg` : opt.reuse
      fs.writeFile(cfgFileName, JSON.stringify(font.settings, null, '\t'), (err) => {
        if (err) throw err
        console.log('wrote cfg file         : ', cfgFileName)
      })
    }
  })
})
