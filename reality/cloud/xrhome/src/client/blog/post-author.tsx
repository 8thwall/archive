import React from 'react'

import {mobileViewOverride, tinyViewOverride} from '../static/styles/settings'
import {useSelector} from '../hooks'
import {createThemedStyles} from '../ui/theme'

const makeImportant = style => `${style} !important`

const useStyles = createThemedStyles(theme => ({
  imageWrapper: {
    padding: '0',
    margin: 'auto',
  },
  contentGroup: {
    'position': 'relative',
    'padding': '0 12em',
    'display': 'flex',
    'flexDirection': 'row',
    'gap': '.5em',
    [mobileViewOverride]: {
      padding: '0 8em',
    },
    [tinyViewOverride]: {
      gap: '0',
      padding: '0',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  authorBio: {
    fontSize: '1em',
    color: makeImportant(theme.fgMain),
    fontFamily: makeImportant(theme.bodyFontFamily),
  },
  authorName: {
    fontSize: makeImportant('1em'),
    fontWeight: makeImportant('700'),
    color: makeImportant(theme.fgMain),
    fontFamily: makeImportant(theme.headingFontFamily),
  },
  wrapper: {
    borderTop: `1px solid ${theme.subtleBorder}`,
    borderBottom: `1px solid ${theme.subtleBorder}`,
    padding: '3em 0',

  },
}))

const PostAuthorFooter = ({authorId}) => {
  const authors = useSelector(state => state.cms.authors)
  const styles = useStyles()
  const author = authors[authorId]

  return author && (
    <div className={styles.wrapper}>
      <div className={styles.contentGroup}>
        <div className={styles.imageWrapper}>
          {
            (author.avatar || author.gravatar_url) &&
              <img
                width='56'
                height='56'
                src={author.avatar || author.gravatar_url}
                alt={author.slug}
              />
          }
        </div>
        <div>
          <p className={styles.authorName}>
            Written by {author.fullName}
          </p>
          <p className={styles.authorBio}>
            {author.bio}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PostAuthorFooter
