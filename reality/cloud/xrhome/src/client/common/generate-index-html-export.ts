type ScriptInfo = {
  src: string
  attributes?: Record<string, string>
}

type StudioHtmlTemplateInput = {
  title: string
  description: string
  scripts: (string | ScriptInfo)[]
  headContent?: string
  bodyContent?: string
}

const validateBodyContent = (bodyContent: string): void => {
  const scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  if (scriptTagRegex.test(bodyContent)) {
    throw new Error(
      'bodyContent: Body content must not contain script tags; add external scripts to ' +
      'the scripts array or include them in your main bundle.'
    )
  }
}

const generateIndexHtml = async (data: StudioHtmlTemplateInput): Promise<string> => {
  const Handlebars = (await import('handlebars')).default

  if (data.bodyContent) {
    validateBodyContent(data.bodyContent)
  }

  const processedData = {
    ...data,
    bodyContent: data.bodyContent ? JSON.stringify(data.bodyContent) : undefined,
  }

  /* eslint-disable local-rules/hardcoded-copy, max-len */
  const htmlTemplate = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>{{title}}</title>
  <meta itemprop="name" content="{{title}}">
  <meta name="twitter:title" content="{{title}}">
  <meta property="og:title" content="{{title}}">
  <meta property="og:site_name" content="{{title}}">
  <meta name="description" content="{{description}}">
  <meta itemprop="description" content="{{description}}">
  <meta property="og:description" content="{{description}}">
  <meta name="twitter:description" content="{{description}}">
  {{#each scripts}}
  {{#if this.attributes}}
  <script crossorigin="anonymous" src="{{this.src}}"{{#each this.attributes}} {{@key}}="{{this}}"{{/each}}>
  </script>
  {{else}}
  <script crossorigin="anonymous" src="{{this}}"></script>
  {{/if}}
  {{/each}}

  {{#if headContent}}
{{{headContent}}}
  {{/if}}
</head>

<body>
{{#if bodyContent}}
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const bodyHtml = {{{bodyContent}}}
    document.body.insertAdjacentHTML('beforeend', bodyHtml)
  })
</script>
{{/if}}
</body>

</html>`
  /* eslint-enable local-rules/hardcoded-copy, max-len */
  const compiledTemplate = Handlebars.compile(htmlTemplate)
  return compiledTemplate(processedData)
}

export {
  generateIndexHtml,
}
export type {
  ScriptInfo,
}
