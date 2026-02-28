import * as React from 'react'
import {Message} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'

import {useFileContent} from '../file-browsing'
import {ASSET_FOLDER_PREFIX} from '../../common/editor-files'
import AssetPreview from '../../editor/asset-preview'
import CodeHighlight, {filenameToLanguage} from '../code-highlight'
import {gray3} from '../../static/styles/settings'
import {getMarkdownContent} from '../../editor/get-markdown-content'
import {useScopedGit} from '../../git/hooks/use-current-git'
import {FreeformMarkdownPreview} from '../../widgets/freeform-markdown-preview'
import FileBrowseContext from '../file-browse-context'

const useStyles = createUseStyles({
  readme: {
    'padding': '0.75em',
    'border': `1px solid ${gray3}`,
    'borderRadius': '0.25em',
    'overflowX': 'auto',
    'userSelect': 'text',
    '& > p > img': {
      maxWidth: '100%',
    },
  },
})

interface IFileContent {
  path: string
}

const FileContent: React.FC<IFileContent> = ({path}) => {
  const classes = useStyles()
  const {appOrModuleUuid, repoId, branch} = React.useContext(FileBrowseContext)
  const content = useFileContent(appOrModuleUuid, branch, path)
  const gitFiles = useScopedGit(repoId, git => git.filesByPath)

  if (!content && content !== '') {
    return <Message error>This file does not exist</Message>
  }

  // Markdown
  if (path.endsWith('.md')) {
    const markdownContent = getMarkdownContent(gitFiles || {}, content)
    return (
      <div className={classes.readme}>
        <FreeformMarkdownPreview>
          {markdownContent}
        </FreeformMarkdownPreview>
      </div>
    )
  }

  // Asset Preview
  const assetPath = path.slice(1)
  if (assetPath.startsWith(ASSET_FOLDER_PREFIX)) {
    return <AssetPreview assetPath={assetPath} assetContent={content} isPublicView />
  }

  // Ace Editor for code
  const language = filenameToLanguage(path)
  return <CodeHighlight content={content} language={language} />
}

const FileContentMemoized = React.memo(FileContent)

export default FileContentMemoized
