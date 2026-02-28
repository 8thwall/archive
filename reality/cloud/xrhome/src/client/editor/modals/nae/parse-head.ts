type ScriptDependency = {
  name: string
  version: string
}

// Parse the head html to extract dependencies from meta tags. Uses a real parser
const parseHead = async (headText: string): Promise<ScriptDependency[]> => {
  const {DOMParser} = await import('@xmldom/xmldom')
  const dependencies: ScriptDependency[] = []

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<template>${headText}</template>`, 'text/html')
  const metaTags = doc.getElementsByTagName('meta')

  for (let i = 0; i < metaTags.length; i++) {
    const metaTag = metaTags[i]
    const nameAttr = metaTag.getAttribute('name')
    if (nameAttr === '8thwall:package' || nameAttr === '8thwall:renderer') {
      const contentAttr = metaTag.getAttribute('content')
      if (contentAttr) {
        const [packageName, packageVersion] = contentAttr.split(':')
        dependencies.push({
          name: packageName,
          version: packageVersion || '',
        })
      }
    }
  }

  return dependencies
}

export {
  parseHead,
}

export type {
  ScriptDependency,
}
