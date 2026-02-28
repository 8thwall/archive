// @sublibrary(:dom-core-lib)
/* eslint-disable max-classes-per-file, import/exports-last, import/group-exports  */

import type {HTMLCollection} from './html-collection'
import {HTMLElement, createHTMLElement as createHTMLElementInternal} from './html-element'
import type {DOMString} from './strings'
import {throwIllegalConstructor} from './exception'
import {HTMLCanvasElement, createHTMLCanvasElement} from './html-canvas-element'
import {HTMLImageElement, createHTMLImageElement} from './html-image-element'
import {HTMLScriptElement, createHTMLScriptElement} from './html-script-element'
import {HTMLMetaElement, createHTMLMetaElement} from './html-meta-element'
import {HTMLAudioElement, createHTMLAudioElement} from './html-audio-element'
import {HTMLVideoElement, createHTMLVideoElement} from './html-video-element'
import {addEventHandlerContentAttributeChangeSteps} from './events-internal'
import {windowEventHandlerNames} from './window-event-handler-names'
import type {Document} from './document'

let inFactory = false

export class HTMLAnchorElement extends HTMLElement {  // 'a'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLAreaElement extends HTMLElement {  // 'area'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLBaseElement extends HTMLElement {  // 'base'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLQuoteElement extends HTMLElement {  // 'blockquote' and 'q'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLBRElement extends HTMLElement {  // 'br'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLBodyElement extends HTMLElement {  // 'body'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
    addEventHandlerContentAttributeChangeSteps(this, windowEventHandlerNames)
  }
}
export class HTMLButtonElement extends HTMLElement {  // 'button'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTableCaptionElement extends HTMLElement {  // 'caption'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTableColElement extends HTMLElement {  // 'col' and 'colgroup'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLDataElement extends HTMLElement {  // 'data'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLDataListElement extends HTMLElement {  // 'datalist'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLModElement extends HTMLElement {  // 'del' and 'ins'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLDetailsElement extends HTMLElement {  // 'details'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLDialogElement extends HTMLElement {  // 'dialog'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLDivElement extends HTMLElement {  // 'div'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLDListElement extends HTMLElement {  // 'dl'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLEmbedElement extends HTMLElement {  // 'embed'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLFieldSetElement extends HTMLElement {  // 'fieldset'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLFormElement extends HTMLElement {  // 'form'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLHeadingElement extends HTMLElement {  // 'h1' to 'h6'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLHeadElement extends HTMLElement {  // 'head'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLHRElement extends HTMLElement {  // 'hr'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLHtmlElement extends HTMLElement {  // 'html'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLIFrameElement extends HTMLElement {  // 'iframe'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLInputElement extends HTMLElement {  // 'input'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLLabelElement extends HTMLElement {  // 'label'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLLegendElement extends HTMLElement {  // 'legend'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLLIElement extends HTMLElement {  // 'li'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLLinkElement extends HTMLElement {  // 'link'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLMapElement extends HTMLElement {  // 'map'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLMenuElement extends HTMLElement {  // 'menu'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLMeterElement extends HTMLElement {  // 'meter'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLObjectElement extends HTMLElement {  // 'object'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLOListElement extends HTMLElement {  // 'ol'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLOptGroupElement extends HTMLElement {  // 'optgroup'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLOptionElement extends HTMLElement {  // 'option'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLOutputElement extends HTMLElement {  // 'output'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLParagraphElement extends HTMLElement {  // 'p'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLPictureElement extends HTMLElement {  // 'picture'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLPreElement extends HTMLElement {  // 'pre', 'xmp', 'listing' (latter 2 deprecated)
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLProgressElement extends HTMLElement {  // 'progress'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLSelectElement extends HTMLElement {
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLSlotElement extends HTMLElement {  // 'slot'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLSourceElement extends HTMLElement {  // 'source'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLSpanElement extends HTMLElement {  // 'span'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLStyleElement extends HTMLElement {  // 'style'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTableElement extends HTMLElement {  // 'table'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTableSectionElement extends HTMLElement {  // 'tbody', 'tfoot', 'thead'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTableCellElement extends HTMLElement {  // 'td' and 'th'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTemplateElement extends HTMLElement {  // 'template'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTextAreaElement extends HTMLElement {  // 'textarea'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTimeElement extends HTMLElement {  // 'time'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTitleElement extends HTMLElement {  // 'title'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTableRowElement extends HTMLElement {  // 'tr'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLTrackElement extends HTMLElement {  // 'track'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLUListElement extends HTMLElement {  // 'ul'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLUnknownElement extends HTMLElement {  // Unknown elements.
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}

// Deprecated elements:
export class HTMLDirectoryElement extends HTMLElement {  // 'dir'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLFontElement extends HTMLElement {  // 'font'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLFrameElement extends HTMLElement {  // 'frame'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLFrameSetElement extends HTMLElement {  // 'frameset'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
    addEventHandlerContentAttributeChangeSteps(this, windowEventHandlerNames)
  }
}
export class HTMLMarqueeElement extends HTMLElement {  // 'marquee'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}
export class HTMLParamElement extends HTMLElement {  // 'param'
  constructor(ownerDocument: Document, tagName: DOMString) {
    if (!inFactory) {
      throwIllegalConstructor()
    }
    super(ownerDocument, tagName)
  }
}

interface HTMLElementTagNameMap {
  'a': HTMLAnchorElement
  'abbr': HTMLElement
  'address': HTMLElement
  'area': HTMLAreaElement
  'article': HTMLElement
  'aside': HTMLElement
  'audio': HTMLAudioElement
  'b': HTMLElement
  'base': HTMLBaseElement
  'bdi': HTMLElement
  'bdo': HTMLElement
  'blockquote': HTMLQuoteElement
  'body': HTMLBodyElement
  'br': HTMLBRElement
  'button': HTMLButtonElement
  'canvas': HTMLCanvasElement
  'caption': HTMLTableCaptionElement
  'cite': HTMLElement
  'code': HTMLElement
  'col': HTMLTableColElement
  'colgroup': HTMLTableColElement
  'data': HTMLDataElement
  'datalist': HTMLDataListElement
  'dd': HTMLElement
  'del': HTMLModElement
  'details': HTMLDetailsElement
  'dfn': HTMLElement
  'dialog': HTMLDialogElement
  'div': HTMLDivElement
  'dl': HTMLDListElement
  'dt': HTMLElement
  'em': HTMLElement
  'embed': HTMLEmbedElement
  'fieldset': HTMLFieldSetElement
  'figcaption': HTMLElement
  'figure': HTMLElement
  'footer': HTMLElement
  'form': HTMLFormElement
  'h1': HTMLHeadingElement
  'h2': HTMLHeadingElement
  'h3': HTMLHeadingElement
  'h4': HTMLHeadingElement
  'h5': HTMLHeadingElement
  'h6': HTMLHeadingElement
  'head': HTMLHeadElement
  'header': HTMLElement
  'hgroup': HTMLElement
  'hr': HTMLHRElement
  'html': HTMLHtmlElement
  'i': HTMLElement
  'iframe': HTMLIFrameElement
  'img': HTMLImageElement
  'input': HTMLInputElement
  'ins': HTMLModElement
  'kbd': HTMLElement
  'label': HTMLLabelElement
  'legend': HTMLLegendElement
  'li': HTMLLIElement
  'link': HTMLLinkElement
  'main': HTMLElement
  'map': HTMLMapElement
  'mark': HTMLElement
  'menu': HTMLMenuElement
  'meta': HTMLMetaElement
  'meter': HTMLMeterElement
  'nav': HTMLElement
  'noscript': HTMLElement
  'object': HTMLObjectElement
  'ol': HTMLOListElement
  'optgroup': HTMLOptGroupElement
  'option': HTMLOptionElement
  'output': HTMLOutputElement
  'p': HTMLParagraphElement
  'picture': HTMLPictureElement
  'pre': HTMLPreElement
  'progress': HTMLProgressElement
  'q': HTMLQuoteElement
  'rp': HTMLElement
  'rt': HTMLElement
  'ruby': HTMLElement
  's': HTMLElement
  'samp': HTMLElement
  'script': HTMLScriptElement
  'search': HTMLElement
  'section': HTMLElement
  'select': HTMLSelectElement
  'slot': HTMLSlotElement
  'small': HTMLElement
  'source': HTMLSourceElement
  'span': HTMLSpanElement
  'strong': HTMLElement
  'style': HTMLStyleElement
  'sub': HTMLElement
  'summary': HTMLElement
  'sup': HTMLElement
  'table': HTMLTableElement
  'tbody': HTMLTableSectionElement
  'td': HTMLTableCellElement
  'template': HTMLTemplateElement
  'textarea': HTMLTextAreaElement
  'tfoot': HTMLTableSectionElement
  'th': HTMLTableCellElement
  'thead': HTMLTableSectionElement
  'time': HTMLTimeElement
  'title': HTMLTitleElement
  'tr': HTMLTableRowElement
  'track': HTMLTrackElement
  'u': HTMLElement
  'ul': HTMLUListElement
  'var': HTMLElement
  'video': HTMLVideoElement
  'wbr': HTMLElement
}

interface HTMLElementDeprecatedTagNameMap {
  'acronym': HTMLElement
  'applet': HTMLUnknownElement
  'basefont': HTMLElement
  'bgsound': HTMLUnknownElement
  'big': HTMLElement
  'blink': HTMLUnknownElement
  'center': HTMLElement
  'dir': HTMLDirectoryElement
  'font': HTMLFontElement
  'frame': HTMLFrameElement
  'frameset': HTMLFrameSetElement
  'isindex': HTMLUnknownElement
  'keygen': HTMLUnknownElement
  'listing': HTMLPreElement
  'marquee': HTMLMarqueeElement
  'menuitem': HTMLElement
  'multicol': HTMLUnknownElement
  'nextid': HTMLUnknownElement
  'nobr': HTMLElement
  'noembed': HTMLElement
  'noframes': HTMLElement
  'param': HTMLParamElement
  'plaintext': HTMLElement
  'rb': HTMLElement
  'rtc': HTMLElement
  'spacer': HTMLUnknownElement
  'strike': HTMLElement
  'tt': HTMLElement
  'xmp': HTMLPreElement
}

// Creates an instance of an HTMLElement subclass with the given ownerDocument,
// class type, and tagName.
const createHTMLElementForClass = <T extends HTMLElement>(
  Clazz: new (ownerDocument: Document, tagName: DOMString) => T,
  ownerDocument: Document,
  tagName: DOMString
): T => {
  inFactory = true
  try {
    return new Clazz(ownerDocument, tagName)
  } finally {
    inFactory = false
  }
}

type createHTMLFunc<T extends HTMLElement> = (ownerDocument: Document) => T

const createHTMLSubElementFactory = <T extends HTMLElement>(
  clazz: new (ownerDocument: Document, tagName: DOMString) => T,
  tagName: DOMString
): createHTMLFunc<T> => (
    ownerDocument: Document
  ): T => createHTMLElementForClass<T>(clazz, ownerDocument, tagName)

const createHTMLElementFactory = (tagName: DOMString): createHTMLFunc<HTMLElement> => (
  ownerDocument: Document
): HTMLElement => createHTMLElementInternal(ownerDocument, tagName)

// Create a map of HTMLElement tagNames to the appropriate factory function.
const HTMLElementFactoryMap = {
  'a': createHTMLSubElementFactory(HTMLAnchorElement, 'a'),
  'abbr': createHTMLElementFactory('abbr'),
  'address': createHTMLElementFactory('address'),
  'area': createHTMLSubElementFactory(HTMLAreaElement, 'area'),
  'article': createHTMLElementFactory('article'),
  'aside': createHTMLElementFactory('aside'),
  'audio': createHTMLAudioElement,
  'b': createHTMLElementFactory('b'),
  'base': createHTMLSubElementFactory(HTMLBaseElement, 'base'),
  'bdi': createHTMLElementFactory('bdi'),
  'bdo': createHTMLElementFactory('bdo'),
  'blockquote': createHTMLSubElementFactory(HTMLQuoteElement, 'blockquote'),
  'body': createHTMLSubElementFactory(HTMLBodyElement, 'body'),
  'br': createHTMLSubElementFactory(HTMLBRElement, 'br'),
  'button': createHTMLSubElementFactory(HTMLButtonElement, 'button'),
  'canvas': createHTMLCanvasElement,
  'caption': createHTMLSubElementFactory(HTMLTableCaptionElement, 'caption'),
  'cite': createHTMLElementFactory('cite'),
  'code': createHTMLElementFactory('code'),
  'col': createHTMLSubElementFactory(HTMLTableColElement, 'col'),
  'colgroup': createHTMLSubElementFactory(HTMLTableColElement, 'colgroup'),
  'data': createHTMLSubElementFactory(HTMLDataElement, 'data'),
  'datalist': createHTMLSubElementFactory(HTMLDataListElement, 'datalist'),
  'dd': createHTMLElementFactory('dd'),
  'del': createHTMLSubElementFactory(HTMLModElement, 'del'),
  'details': createHTMLSubElementFactory(HTMLDetailsElement, 'details'),
  'dfn': createHTMLElementFactory('dfn'),
  'dialog': createHTMLSubElementFactory(HTMLDialogElement, 'dialog'),
  'div': createHTMLSubElementFactory(HTMLDivElement, 'div'),
  'dl': createHTMLSubElementFactory(HTMLDListElement, 'dl'),
  'dt': createHTMLElementFactory('dt'),
  'em': createHTMLElementFactory('em'),
  'embed': createHTMLSubElementFactory(HTMLEmbedElement, 'embed'),
  'fieldset': createHTMLSubElementFactory(HTMLFieldSetElement, 'fieldset'),
  'figcaption': createHTMLElementFactory('figcaption'),
  'figure': createHTMLElementFactory('figure'),
  'footer': createHTMLElementFactory('footer'),
  'form': createHTMLSubElementFactory(HTMLFormElement, 'form'),
  'h1': createHTMLSubElementFactory(HTMLHeadingElement, 'h1'),
  'h2': createHTMLSubElementFactory(HTMLHeadingElement, 'h2'),
  'h3': createHTMLSubElementFactory(HTMLHeadingElement, 'h3'),
  'h4': createHTMLSubElementFactory(HTMLHeadingElement, 'h4'),
  'h5': createHTMLSubElementFactory(HTMLHeadingElement, 'h5'),
  'h6': createHTMLSubElementFactory(HTMLHeadingElement, 'h6'),
  'head': createHTMLSubElementFactory(HTMLHeadElement, 'head'),
  'header': createHTMLElementFactory('header'),
  'hgroup': createHTMLElementFactory('hgroup'),
  'hr': createHTMLSubElementFactory(HTMLHRElement, 'hr'),
  'html': createHTMLSubElementFactory(HTMLHtmlElement, 'html'),
  'i': createHTMLElementFactory('i'),
  'iframe': createHTMLSubElementFactory(HTMLIFrameElement, 'iframe'),
  'img': createHTMLImageElement,
  'input': createHTMLSubElementFactory(HTMLInputElement, 'input'),
  'ins': createHTMLSubElementFactory(HTMLModElement, 'ins'),
  'kbd': createHTMLElementFactory('kbd'),
  'label': createHTMLSubElementFactory(HTMLLabelElement, 'label'),
  'legend': createHTMLSubElementFactory(HTMLLegendElement, 'legend'),
  'li': createHTMLSubElementFactory(HTMLLIElement, 'li'),
  'link': createHTMLSubElementFactory(HTMLLinkElement, 'link'),
  'main': createHTMLElementFactory('main'),
  'map': createHTMLSubElementFactory(HTMLMapElement, 'map'),
  'mark': createHTMLElementFactory('mark'),
  'menu': createHTMLSubElementFactory(HTMLMenuElement, 'menu'),
  'meta': createHTMLMetaElement,
  'meter': createHTMLSubElementFactory(HTMLMeterElement, 'meter'),
  'nav': createHTMLElementFactory('nav'),
  'noscript': createHTMLElementFactory('noscript'),
  'object': createHTMLSubElementFactory(HTMLObjectElement, 'object'),
  'ol': createHTMLSubElementFactory(HTMLOListElement, 'ol'),
  'optgroup': createHTMLSubElementFactory(HTMLOptGroupElement, 'optgroup'),
  'option': createHTMLSubElementFactory(HTMLOptionElement, 'option'),
  'output': createHTMLSubElementFactory(HTMLOutputElement, 'output'),
  'p': createHTMLSubElementFactory(HTMLParagraphElement, 'p'),
  'picture': createHTMLSubElementFactory(HTMLPictureElement, 'picture'),
  'pre': createHTMLSubElementFactory(HTMLPreElement, 'pre'),
  'progress': createHTMLSubElementFactory(HTMLProgressElement, 'progress'),
  'q': createHTMLSubElementFactory(HTMLQuoteElement, 'q'),
  'rp': createHTMLElementFactory('rp'),
  'rt': createHTMLElementFactory('rt'),
  'ruby': createHTMLElementFactory('ruby'),
  's': createHTMLElementFactory('s'),
  'samp': createHTMLElementFactory('samp'),
  'script': (
    ownerDocument: Document
  ): HTMLScriptElement => createHTMLScriptElement(ownerDocument),
  'search': createHTMLElementFactory('search'),
  'section': createHTMLElementFactory('section'),
  'select': createHTMLSubElementFactory(HTMLSelectElement, 'select'),
  'slot': createHTMLSubElementFactory(HTMLSlotElement, 'slot'),
  'small': createHTMLElementFactory('small'),
  'source': createHTMLSubElementFactory(HTMLSourceElement, 'source'),
  'span': createHTMLSubElementFactory(HTMLSpanElement, 'span'),
  'strong': createHTMLElementFactory('strong'),
  'style': createHTMLSubElementFactory(HTMLStyleElement, 'style'),
  'sub': createHTMLElementFactory('sub'),
  'summary': createHTMLElementFactory('summary'),
  'sup': createHTMLElementFactory('sup'),
  'table': createHTMLSubElementFactory(HTMLTableElement, 'table'),
  'tbody': createHTMLSubElementFactory(HTMLTableSectionElement, 'tbody'),
  'td': createHTMLSubElementFactory(HTMLTableCellElement, 'td'),
  'template': createHTMLSubElementFactory(HTMLTemplateElement, 'template'),
  'textarea': createHTMLSubElementFactory(HTMLTextAreaElement, 'textarea'),
  'tfoot': createHTMLSubElementFactory(HTMLTableSectionElement, 'tfoot'),
  'th': createHTMLSubElementFactory(HTMLTableCellElement, 'th'),
  'thead': createHTMLSubElementFactory(HTMLTableSectionElement, 'thead'),
  'time': createHTMLSubElementFactory(HTMLTimeElement, 'time'),
  'title': createHTMLSubElementFactory(HTMLTitleElement, 'title'),
  'tr': createHTMLSubElementFactory(HTMLTableRowElement, 'tr'),
  'track': createHTMLSubElementFactory(HTMLTrackElement, 'track'),
  'u': createHTMLElementFactory('u'),
  'ul': createHTMLSubElementFactory(HTMLUListElement, 'ul'),
  'var': createHTMLElementFactory('var'),
  'video': createHTMLVideoElement,
  'wbr': createHTMLElementFactory('wbr'),
  // Deprecated elements:
  'acronym': createHTMLElementFactory('acronym'),
  'applet': createHTMLSubElementFactory(HTMLUnknownElement, 'applet'),
  'basefont': createHTMLElementFactory('basefont'),
  'bgsound': createHTMLSubElementFactory(HTMLUnknownElement, 'bgsound'),
  'big': createHTMLElementFactory('big'),
  'blink': createHTMLSubElementFactory(HTMLUnknownElement, 'blink'),
  'center': createHTMLElementFactory('center'),
  'dir': createHTMLSubElementFactory(HTMLDirectoryElement, 'dir'),
  'font': createHTMLSubElementFactory(HTMLFontElement, 'font'),
  'frame': createHTMLSubElementFactory(HTMLFrameElement, 'frame'),
  'frameset': createHTMLSubElementFactory(HTMLFrameSetElement, 'frameset'),
  'isindex': createHTMLSubElementFactory(HTMLUnknownElement, 'isindex'),
  'keygen': createHTMLSubElementFactory(HTMLUnknownElement, 'keygen'),
  'listing': createHTMLSubElementFactory(HTMLPreElement, 'listing'),
  'marquee': createHTMLSubElementFactory(HTMLMarqueeElement, 'marquee'),
  'menuitem': createHTMLElementFactory('menuitem'),
  'multicol': createHTMLSubElementFactory(HTMLUnknownElement, 'multicol'),
  'nextid': createHTMLSubElementFactory(HTMLUnknownElement, 'nextid'),
  'nobr': createHTMLElementFactory('nobr'),
  'noembed': createHTMLElementFactory('noembed'),
  'noframes': createHTMLElementFactory('noframes'),
  'param': createHTMLSubElementFactory(HTMLParamElement, 'param'),
  'plaintext': createHTMLElementFactory('plaintext'),
  'rb': createHTMLElementFactory('rb'),
  'rtc': createHTMLElementFactory('rtc'),
  'spacer': createHTMLSubElementFactory(HTMLUnknownElement, 'spacer'),
  'strike': createHTMLElementFactory('strike'),
  'tt': createHTMLElementFactory('tt'),
  'xmp': createHTMLSubElementFactory(HTMLPreElement, 'xmp'),
}

type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<string & K>]: T[K];
};

type CapitalizeKeys<T> = {
  [K in keyof T as Capitalize<string & K>]: T[K];
};

// Allow for lower, upper, or capitalized tagName lookups.
type HTMLElementTagNameMapLaxKeys =
  keyof HTMLElementTagNameMap |
  keyof UppercaseKeys<HTMLElementTagNameMap> |
  keyof CapitalizeKeys<HTMLElementTagNameMap>

// Allow for lower, upper, or capitalized tagName lookups.
type HTMLElementDeprecatedTagNameMapLaxKeys =
  keyof HTMLElementDeprecatedTagNameMap |
  keyof UppercaseKeys<HTMLElementDeprecatedTagNameMap> |
  keyof CapitalizeKeys<HTMLElementDeprecatedTagNameMap>

interface CreateHTMLElement {
  <K extends HTMLElementTagNameMapLaxKeys>(
    ownerDocument: Document,
    tagName: K
  ): HTMLElementTagNameMap[Lowercase<K>]
  /** @deprecated */
  <K extends HTMLElementDeprecatedTagNameMapLaxKeys>(
    ownerDocument: Document,
    tagName: K,
  ): HTMLElementDeprecatedTagNameMap[Lowercase<K>]
  (ownerDocument: Document, tagName: string): HTMLUnknownElement
}

interface CreateHTMLElementDocument {
  <K extends HTMLElementTagNameMapLaxKeys>(
    tagName: K
  ): HTMLElementTagNameMap[Lowercase<K>]
  /** @deprecated */
  <K extends HTMLElementDeprecatedTagNameMapLaxKeys>(
    tagName: K,
  ): HTMLElementDeprecatedTagNameMap[Lowercase<K>]
  (tagName: string): HTMLUnknownElement
}

interface CreateHTMLElementDocumentNS {
  <K extends HTMLElementTagNameMapLaxKeys>(
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    qualifiedName: K
  ): HTMLElementTagNameMap[Lowercase<K>]
  /** @deprecated */
  <K extends HTMLElementDeprecatedTagNameMapLaxKeys>(
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    qualifiedName: K
  ): HTMLElementDeprecatedTagNameMap[Lowercase<K>]
  (namespaceURI: 'http://www.w3.org/1999/xhtml', qualifiedName: string): HTMLUnknownElement
}

const createHTMLElement: CreateHTMLElement = (ownerDocument: Document, tagName: DOMString) => {
  // Look up the factory function for the given tagName.
  const factory = HTMLElementFactoryMap[tagName.toLowerCase() as keyof typeof HTMLElementFactoryMap]
  if (factory) {
    return factory(ownerDocument)
  } else {
    return createHTMLElementForClass(HTMLUnknownElement, ownerDocument, tagName)
  }
}

interface GetHTMLElementsByTagName {
  <K extends HTMLElementTagNameMapLaxKeys>(
    tagName: K
  ): HTMLCollection<HTMLElementTagNameMap[Lowercase<K>]>
  /** @deprecated */
  <K extends HTMLElementDeprecatedTagNameMapLaxKeys>(
    tagName: K,
  ): HTMLCollection<HTMLElementDeprecatedTagNameMap[Lowercase<K>]>
  (tagName: string): HTMLCollection<HTMLElement>
}

interface GetHTMLElementsByTagNameNS {
  <K extends HTMLElementTagNameMapLaxKeys>(
    namespaceURI: DOMString | null, localName: DOMString
  ): HTMLCollection<HTMLElementTagNameMap[Lowercase<K>]>
  /** @deprecated */
  <K extends HTMLElementDeprecatedTagNameMapLaxKeys>(
    namespaceURI: DOMString | null, localName: DOMString
  ): HTMLCollection<HTMLElementDeprecatedTagNameMap[Lowercase<K>]>
  (namespaceURI: DOMString | null, localName: DOMString): HTMLCollection<HTMLElement>
}

type AllHtmlElements = {
  readonly HTMLAnchorElement: typeof HTMLAnchorElement
  readonly HTMLAreaElement: typeof HTMLAreaElement
  readonly HTMLAudioElement: typeof HTMLAudioElement
  readonly HTMLBaseElement: typeof HTMLBaseElement
  readonly HTMLQuoteElement: typeof HTMLQuoteElement
  readonly HTMLBRElement: typeof HTMLBRElement
  readonly HTMLBodyElement: typeof HTMLBodyElement
  readonly HTMLButtonElement: typeof HTMLButtonElement
  readonly HTMLCanvasElement: typeof HTMLCanvasElement
  readonly HTMLTableCaptionElement: typeof HTMLTableCaptionElement
  readonly HTMLTableColElement: typeof HTMLTableColElement
  readonly HTMLDataElement: typeof HTMLDataElement
  readonly HTMLDataListElement: typeof HTMLDataListElement
  readonly HTMLModElement: typeof HTMLModElement
  readonly HTMLDetailsElement: typeof HTMLDetailsElement
  readonly HTMLDialogElement: typeof HTMLDialogElement
  readonly HTMLDivElement: typeof HTMLDivElement
  readonly HTMLDListElement: typeof HTMLDListElement
  readonly HTMLEmbedElement: typeof HTMLEmbedElement
  readonly HTMLFieldSetElement: typeof HTMLFieldSetElement
  readonly HTMLFormElement: typeof HTMLFormElement
  readonly HTMLHeadElement: typeof HTMLHeadElement
  readonly HTMLHRElement: typeof HTMLHRElement
  readonly HTMLHtmlElement: typeof HTMLHtmlElement
  readonly HTMLIFrameElement: typeof HTMLIFrameElement
  readonly HTMLImageElement: typeof HTMLImageElement
  readonly HTMLLabelElement: typeof HTMLLabelElement
  readonly HTMLLegendElement: typeof HTMLLegendElement
  readonly HTMLLIElement: typeof HTMLLIElement
  readonly HTMLLinkElement: typeof HTMLLinkElement
  readonly HTMLMapElement: typeof HTMLMapElement
  readonly HTMLMenuElement: typeof HTMLMenuElement
  readonly HTMLMetaElement: typeof HTMLMetaElement
  readonly HTMLMeterElement: typeof HTMLMeterElement
  readonly HTMLObjectElement: typeof HTMLObjectElement
  readonly HTMLOListElement: typeof HTMLOListElement
  readonly HTMLOptGroupElement: typeof HTMLOptGroupElement
  readonly HTMLOptionElement: typeof HTMLOptionElement
  readonly HTMLOutputElement: typeof HTMLOutputElement
  readonly HTMLParagraphElement: typeof HTMLParagraphElement
  readonly HTMLPictureElement: typeof HTMLPictureElement
  readonly HTMLPreElement: typeof HTMLPreElement
  readonly HTMLProgressElement: typeof HTMLProgressElement
  readonly HTMLScriptElement: typeof HTMLScriptElement
  readonly HTMLSelectElement: typeof HTMLSelectElement
  readonly HTMLSlotElement: typeof HTMLSlotElement
  readonly HTMLSourceElement: typeof HTMLSourceElement
  readonly HTMLSpanElement: typeof HTMLSpanElement
  readonly HTMLStyleElement: typeof HTMLStyleElement
  readonly HTMLTableElement: typeof HTMLTableElement
  readonly HTMLTableSectionElement: typeof HTMLTableSectionElement
  readonly HTMLTableCellElement: typeof HTMLTableCellElement
  readonly HTMLTemplateElement: typeof HTMLTemplateElement
  readonly HTMLTextAreaElement: typeof HTMLTextAreaElement
  readonly HTMLTimeElement: typeof HTMLTimeElement
  readonly HTMLTitleElement: typeof HTMLTitleElement
  readonly HTMLTableRowElement: typeof HTMLTableRowElement
  readonly HTMLTrackElement: typeof HTMLTrackElement
  readonly HTMLUListElement: typeof HTMLUListElement
  readonly HTMLVideoElement: typeof HTMLVideoElement
  readonly HTMLDirectoryElement: typeof HTMLDirectoryElement
  readonly HTMLFontElement: typeof HTMLFontElement
  readonly HTMLFrameElement: typeof HTMLFrameElement
  readonly HTMLFrameSetElement: typeof HTMLFrameSetElement
  readonly HTMLMarqueeElement: typeof HTMLMarqueeElement
  readonly HTMLParamElement: typeof HTMLParamElement
  readonly HTMLUnknownElement: typeof HTMLUnknownElement
}

const mixinAllHtmlElements = <T extends AllHtmlElements>(proto: T) => {
  Object.defineProperties(proto, {
    HTMLAnchorElement: {value: HTMLAnchorElement},
    HTMLAreaElement: {value: HTMLAreaElement},
    HTMLAudioElement: {value: HTMLAudioElement},
    HTMLBaseElement: {value: HTMLBaseElement},
    HTMLQuoteElement: {value: HTMLQuoteElement},
    HTMLBRElement: {value: HTMLBRElement},
    HTMLBodyElement: {value: HTMLBodyElement},
    HTMLButtonElement: {value: HTMLButtonElement},
    HTMLCanvasElement: {value: HTMLCanvasElement},
    HTMLTableCaptionElement: {value: HTMLTableCaptionElement},
    HTMLTableColElement: {value: HTMLTableColElement},
    HTMLDataElement: {value: HTMLDataElement},
    HTMLDataListElement: {value: HTMLDataListElement},
    HTMLModElement: {value: HTMLModElement},
    HTMLDetailsElement: {value: HTMLDetailsElement},
    HTMLDialogElement: {value: HTMLDialogElement},
    HTMLDivElement: {value: HTMLDivElement},
    HTMLDListElement: {value: HTMLDListElement},
    HTMLEmbedElement: {value: HTMLEmbedElement},
    HTMLFieldSetElement: {value: HTMLFieldSetElement},
    HTMLFormElement: {value: HTMLFormElement},
    HTMLHeadElement: {value: HTMLHeadElement},
    HTMLHRElement: {value: HTMLHRElement},
    HTMLHtmlElement: {value: HTMLHtmlElement},
    HTMLIFrameElement: {value: HTMLIFrameElement},
    HTMLImageElement: {value: HTMLImageElement},
    HTMLLabelElement: {value: HTMLLabelElement},
    HTMLLegendElement: {value: HTMLLegendElement},
    HTMLLIElement: {value: HTMLLIElement},
    HTMLLinkElement: {value: HTMLLinkElement},
    HTMLMapElement: {value: HTMLMapElement},
    HTMLMenuElement: {value: HTMLMenuElement},
    HTMLMetaElement: {value: HTMLMetaElement},
    HTMLMeterElement: {value: HTMLMeterElement},
    HTMLObjectElement: {value: HTMLObjectElement},
    HTMLOListElement: {value: HTMLOListElement},
    HTMLOptGroupElement: {value: HTMLOptGroupElement},
    HTMLOptionElement: {value: HTMLOptionElement},
    HTMLOutputElement: {value: HTMLOutputElement},
    HTMLParagraphElement: {value: HTMLParagraphElement},
    HTMLPictureElement: {value: HTMLPictureElement},
    HTMLPreElement: {value: HTMLPreElement},
    HTMLProgressElement: {value: HTMLProgressElement},
    HTMLScriptElement: {value: HTMLScriptElement},
    HTMLSelectElement: {value: HTMLSelectElement},
    HTMLSlotElement: {value: HTMLSlotElement},
    HTMLSourceElement: {value: HTMLSourceElement},
    HTMLSpanElement: {value: HTMLSpanElement},
    HTMLStyleElement: {value: HTMLStyleElement},
    HTMLTableElement: {value: HTMLTableElement},
    HTMLTableSectionElement: {value: HTMLTableSectionElement},
    HTMLTableCellElement: {value: HTMLTableCellElement},
    HTMLTemplateElement: {value: HTMLTemplateElement},
    HTMLTextAreaElement: {value: HTMLTextAreaElement},
    HTMLTimeElement: {value: HTMLTimeElement},
    HTMLTitleElement: {value: HTMLTitleElement},
    HTMLTableRowElement: {value: HTMLTableRowElement},
    HTMLTrackElement: {value: HTMLTrackElement},
    HTMLUListElement: {value: HTMLUListElement},
    HTMLVideoElement: {value: HTMLVideoElement},
    HTMLDirectoryElement: {value: HTMLDirectoryElement},
    HTMLFontElement: {value: HTMLFontElement},
    HTMLFrameElement: {value: HTMLFrameElement},
    HTMLFrameSetElement: {value: HTMLFrameSetElement},
    HTMLMarqueeElement: {value: HTMLMarqueeElement},
    HTMLParamElement: {value: HTMLParamElement},
    HTMLUnknownElement: {value: HTMLUnknownElement},
  })
}

export {
  AllHtmlElements,
  mixinAllHtmlElements,
  HTMLCanvasElement,
  HTMLImageElement,
  HTMLScriptElement,
  HTMLMetaElement,
  HTMLAudioElement,
  HTMLVideoElement,
  createHTMLElement,
  CreateHTMLElementDocument,
  CreateHTMLElementDocumentNS,
  GetHTMLElementsByTagName,
  GetHTMLElementsByTagNameNS,
}
