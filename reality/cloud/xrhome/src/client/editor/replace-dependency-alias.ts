// TODO/NOTE (Johnny): This regex will ignore imports/require with comments between the
// tokens. As a result it is an incomplete regex for this task. Examples:
// require('bad-regex' /* This is a buggy file */)
// import hi /* happy import */ from 'happy-module'
// import // hi
// sad from 'sad-module'

/*
RegExp Grouping for require:
require   (     'xxxxxx'               )   ;
[  initalGroup  ].     .[   afterGroup ]
[               fullGroup              ]
*/
/*
RegExp Grouping for import:
import {  aaa, bbb, ccc  } from ( 'xxxxxxx'    )      ;
[            initalGroup         ].       .[afterGroup]
[               fullGroup                             ]
*/

const replaceAliasWithRegex = (regexString: string, content: string, newAlias: string) => {
  const regex = new RegExp(regexString, 'g')
  const builder: string[] = []
  let contentIndex = 0
  let match = regex.exec(content)

  while (match) {
    const [fullGroup, initialGroup, afterGroup] = match
    const quoteType = fullGroup[initialGroup.length]

    builder.push(content.substring(contentIndex, match.index))
    builder.push(initialGroup, quoteType, newAlias, quoteType, afterGroup)
    contentIndex = match.index + fullGroup.length
    match = regex.exec(content)
  }

  builder.push(content.substring(contentIndex))
  return builder.join('')
}

const replaceAlias = (content: string, oldAlias: string, newAlias: string) => {
  const escSpec = oldAlias.replace(/\W/g, c => `\\${c}`)

  const iRegexString =
  `(import\\s+?(?:(?:(?:[\\w*\\s{},]*)\\s+from\\s+?)|))\
(?:(?:"${escSpec}")|(?:'${escSpec}'))\
([\\s]*?(?:;|$|\n|//|/\\*))`

  const rRegexString =
  `(require\\s*\\(\\s*)\
(?:(?:"${escSpec}")|(?:'${escSpec}'))\
(\\s*\\))`

  // Replace alias in import/require statements.
  const newContent = replaceAliasWithRegex(iRegexString, content, newAlias)
  return replaceAliasWithRegex(rRegexString, newContent, newAlias)
}

export {
  replaceAlias,
}
