import * as React from 'react'
import {Popup, Button} from 'semantic-ui-react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {
  TwitterShareButton, FacebookShareButton, LinkedinShareButton,
  RedditShareButton, EmailShareButton,
} from 'react-share'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import type {IBrowseAccount, IBrowseApp} from '../common/types/models'
import {getDisplayNameForApp} from '../../shared/app-utils'
import shareIcon from '../static/shareIcon.png'
import deleteIcon from '../static/deleteIcon.png'
import twitterIcon from '../static/twitterIcon.png'
import facebookIcon from '../static/facebookIcon.png'
import linkedinIcon from '../static/linkedinIcon.png'
import redditIcon from '../static/redditIcon.png'
import emailIcon from '../static/emailIcon.png'
import {gray1} from '../static/styles/settings'
import {combine} from '../common/styles'

const useStyles = createUseStyles({
  popupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  button: {
    margin: '0.5em',
    padding: 0,
    backgroundColor: 'transparent',
  },
  closeButton: {
    height: '1em',
    alignSelf: 'flex-end',
  },
  optContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'space-around',
    justifyContent: 'space-evenly',
  },
  optImage: {
    height: '3em',
  },
  urlCopyContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  urlText: {
    display: 'block',
    background: gray1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    borderRadius: '0.5em 0 0 0.5em',
    padding: '0.5em',
    maxWidth: '15em',
  },
  urlCopyButton: {
    boxShadow: 'none !important',
    width: 'max-content',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
})

interface IProjectShare {
  app: IBrowseApp
  account: IBrowseAccount
  url: string
  className?: string
  trigger?: React.ReactNode
  a8?: string
}

const ProjectShare: React.FunctionComponent<IProjectShare> =
  ({app, account, url, className = '', trigger, ...rest}) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isCopied, setIsCopied] = React.useState(false)
    const classes = useStyles()
    const {t} = useTranslation(['public-featured-pages', 'common'])

    const onOpen = () => setIsOpen(true)

    const onClose = () => {
      setIsOpen(false)
      setIsCopied(false)
    }

    const onCopy = () => {
      setIsCopied(true)
    }

    const appTitle = getDisplayNameForApp(app)
    const {name: accountTitle, twitterHandle} = account

    const title =
      `Check out the ${appTitle} experience created by ${accountTitle} and powered by 8th Wall.`
    const twitterTitle =
      `Check out the ${appTitle} experience created by ` +
      `${twitterHandle ? `@${twitterHandle}` : accountTitle} and powered by @the8thWall.`
    const emailSubject = `Check out the ${appTitle} experience`
    const emailBody = `Hi There!

Check out the ${appTitle} experience created by ${accountTitle} and powered by 8th Wall:`

    return (
      <Popup
        trigger={trigger || (
          <span className={combine('share', className)} {...rest}>
            <img className='share-image' src={shareIcon} alt='Share' />
            &nbsp;{t('button.share_project', {ns: 'common'})}
          </span>
        )}
        on='click'
        open={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        position='bottom center'
      >
        <div className={classes.popupContainer}>
          <input
            type='image'
            className={classes.closeButton}
            src={deleteIcon}
            alt='Close'
            onClick={onClose}
          />
          <div className={classes.optContainer}>
            <TwitterShareButton
              className={classes.button}
              url={url}
              title={twitterTitle}
            >
              <img className={classes.optImage} alt='Twitter' src={twitterIcon} />
            </TwitterShareButton>
            <FacebookShareButton
              className={classes.button}
              url={url}
              quote={title}
            >
              <img className={classes.optImage} alt='Facebook' src={facebookIcon} />
            </FacebookShareButton>
            <LinkedinShareButton
              className={classes.button}
              url={url}
              title={title}
              source='https://www.linkedin.com/company/8thwall/'
            >
              <img className={classes.optImage} alt='LinkedIn' src={linkedinIcon} />
            </LinkedinShareButton>
            <RedditShareButton
              className={classes.button}
              url={url}
              title={title}
            >
              <img className={classes.optImage} alt='Reddit' src={redditIcon} />
            </RedditShareButton>
            <EmailShareButton
              className={classes.button}
              url={url}
              subject={emailSubject}
              body={emailBody}
              onClick={e => e.preventDefault()}
              openShareDialogOnClick
            >
              <img className={classes.optImage} alt='Email' src={emailIcon} />
            </EmailShareButton>
          </div>
          <div className={classes.urlCopyContainer}>
            <span className={classes.urlText}>{url}</span>
            <CopyToClipboard text={url} onCopy={onCopy}>
              {/* TODO(Brandon): Create custom component to replace Button here */}
              <Button className={classes.urlCopyButton} attached='right' size='small' primary>
                {isCopied
                  ? <b>{t('button.copied', {ns: 'common'})}</b>
                  : <>{t('featured_app_page.project_share.button.copy_url')}</>
              }
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      </Popup>
    )
  }

export default ProjectShare
