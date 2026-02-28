import React from 'react'

import type {FontResource} from '@ecs/shared/scene-graph'
import {DEFAULT_FONT, DEFAULT_FONT_NAME, FONTS} from '@ecs/shared/fonts'
import {extractFontResourceUrl} from '@ecs/shared/resource'
import type {RawFontSetData} from '@ecs/shared/msdf-font-type'

import {useFileContent} from '../../git/hooks/use-file-content'
import {useJsonFetch} from './use-fetch'
import {getAssetUrl} from '../../common/hosting-urls'
import {getMainPath, parse} from '@nia/reality/shared/asset-pointer'

type Font = {
  json: RawFontSetData | string
  png: string
  ttf: string
}

// TODO (tri) this thing will load anything again and again, we should cache it somehow
const useUiFont = (fontId: undefined | FontResource): Font => {
  const fontName = fontId ? extractFontResourceUrl(fontId) : DEFAULT_FONT_NAME
  const fontAssetBundle = useFileContent(fontName)
  const pointer = parse(fontAssetBundle)
  const pointerPath = pointer?.path
  const font8Url = getAssetUrl(getMainPath(pointer))
  const font8Content = useJsonFetch(font8Url)

  return React.useMemo(() => {
    if (FONTS.has(fontName)) {
      return {
        json: FONTS.get(fontName)?.json || DEFAULT_FONT.json,
        png: FONTS.get(fontName)?.png || DEFAULT_FONT.png,
        ttf: FONTS.get(fontName)?.ttf || DEFAULT_FONT.ttf,
      }
    }

    const font8Data = font8Content?.data as RawFontSetData
    if (!font8Data) {
      return {
        json: null,
        png: null,
        ttf: null,
      }
    }

    return {
      json: font8Url,
      png: font8Data.pages.map(page => `${getAssetUrl(pointerPath + page)}`)[0],
      ttf: getAssetUrl(pointerPath + font8Data.fontFile),
    }
  }, [fontName, font8Url, font8Content, pointerPath])
}

export {
  useUiFont,
}
