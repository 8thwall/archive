import type {Monaco, IRange, languages} from '../../monaco-types'
import {
  HTML_VOID_ELEMENTS, getAreaInfo, getDefaultReplaceRange, getTextUntilPosition,
} from '../completion-tools'
import {AFrameAttribute, AFramePrimitive, A_FRAME_PRIMITIVES} from './aframe-primitives'
import {ALL_COMPONENTS} from './components/components'

const getLastOpenedTag = (text: string) => {
  let textIterator = text
  // NOTE(johnny): Fetches all tags in text
  const tags = textIterator.match(/<\/*(?=\S*)([a-zA-Z-]+)/g)
  if (!tags) {
    return undefined
  }

  const closingTags: string[] = []
  let i = tags.length - 1
  // NOTE(johnny): Using '<'.length to make the code more transparent.
  while (i >= 0) {
    if (HTML_VOID_ELEMENTS.includes(tags[i].substring('<'.length))) {
      i -= 1
    } else {
      if (tags[i].indexOf('</') !== -1) {
        closingTags.push(tags[i].substring('</'.length))
      } else {
        const tagPosition = textIterator.lastIndexOf(tags[i])
        const tag = tags[i].substring('<'.length)
        const closingBracketIdx = textIterator.indexOf('/>', tagPosition)
        if (closingBracketIdx === -1) {
          if (!closingTags.length || closingTags[closingTags.length - 1] !== tag) {
            const textAfterOpenTag = textIterator.substring(tagPosition)
            return {
              tagName: tag,
              isAttributeSearch: textAfterOpenTag.indexOf('<') > textAfterOpenTag.indexOf('>'),
            }
          }
          closingTags.pop()
        }
        textIterator = textIterator.substring(0, tagPosition)
      }
      i -= 1
    }
  }
  return undefined
}

const getAvailableAttributes = (
  monaco: Monaco,
  range: IRange,
  attributes: AFrameAttribute[]
):
languages.CompletionItem[] => {
  const allAttributes = [...attributes, ...ALL_COMPONENTS]
  return allAttributes.map(attribute => ({
    label: attribute.name,
    kind: monaco.languages.CompletionItemKind.Property,
    detail: attribute.detail,
    range,
    documentation: attribute.description,
    insertText: `${attribute.name}="${attribute.default}"`,
  }))
}

const getAvailableElements = (
  monaco: Monaco,
  range: IRange,
  elements: AFramePrimitive[],
  inTag: boolean
): languages.CompletionItem[] => elements.map(element => ({
  label: element.label,
  kind: monaco.languages.CompletionItemKind.Function,
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  detail: element.detail,
  range,
  documentation: element.documentation,
  insertText: inTag
    ? `${element.label}$0></${element.label}>`
    : `<${element.label}$0></${element.label}>`,
}))

const getAFrameCompletionProvider = (monaco: Monaco): languages.CompletionItemProvider => ({
  provideCompletionItems: (model, position) => {
    const textUntilPosition = getTextUntilPosition(model, position)
    const info = getAreaInfo(textUntilPosition)
    if (!info.isCompletionAvailable) {
      return {suggestions: []}
    }

    const lastOpenedTag = getLastOpenedTag(info.filteredText)

    const attributesForTags = A_FRAME_PRIMITIVES.find(
      element => element.label === lastOpenedTag?.tagName
    )

    const isAttributeSearch = lastOpenedTag?.isAttributeSearch && !!attributesForTags
    const replaceRange = getDefaultReplaceRange(model, position)

    if (isAttributeSearch) {
      return {
        suggestions: getAvailableAttributes(monaco, replaceRange, attributesForTags.attributes),
      }
    } else {
      const lastCharacter = textUntilPosition[textUntilPosition.length - 1]
      // NOTE(johnny): This isn't perfect because `<   a` will not count as being in a tag.
      const inTag = !!lastOpenedTag?.isAttributeSearch || lastCharacter === '<'
      return {
        suggestions: getAvailableElements(monaco, replaceRange, A_FRAME_PRIMITIVES, inTag),
      }
    }
  },
  triggerCharacters: ['<', 'a'],
})

export {
  getAFrameCompletionProvider,
}
