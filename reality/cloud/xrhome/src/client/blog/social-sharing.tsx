import React from 'react'
import {Grid} from 'semantic-ui-react'
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
} from 'react-share'

import {tinyViewOverride} from '../static/styles/settings'
import {createCustomUseStyles} from '../common/create-custom-use-styles'
import {Icon} from '../ui/components/icon'
import {createThemedStyles} from '../ui/theme'

const useStyles = createCustomUseStyles<{tinyCenter: boolean}>()({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    gap: '32px',

    [tinyViewOverride]: {
      alignItems: ({tinyCenter}) => (tinyCenter ? 'center' : 'baseline'),
      justifyContent: ({tinyCenter}) => (tinyCenter ? 'center' : 'flex-end'),
      gap: '16px',
    },
  },
})

const useThemedStyles = createThemedStyles(theme => ({
  button: {
    'fontSize': '24px',
    'height': '24px',
    'lineHeight': '24px',
    'width': '24px',
    'padding': 0,
    'backgroundColor': theme.fgMuted,
    'border': 'none',
    'borderRadius': '0.125em',
    'cursor': 'pointer',

    '&:hover': {
      'color': theme.fgMain,
    },

    [tinyViewOverride]: {
      'fontSize': '18px',
      'height': '18px',
      'lineHeight': '18px',
      'width': '18px',
    },
  },
}))

const SocialSharing = ({url, title, tinyCenter = false, ...rest}) => {
  const styles = useStyles({tinyCenter})
  const themedStyles = useThemedStyles()

  return (
    <Grid.Column verticalAlign='middle' textAlign='right' {...rest}>
      <div className={styles.wrapper}>
        <TwitterShareButton
          className={themedStyles.button}
          resetButtonStyle={false}
          url={url}
          title={title}
          hashtags={['WebAR']}
          via='the8thwall'
        >
          <Icon stroke='socialX' color='white' />
        </TwitterShareButton>
        <FacebookShareButton
          className={themedStyles.button}
          resetButtonStyle={false}
          url={url}
          quote={title}
          hashtag='#WebAR'
        >
          <Icon stroke='socialFacebook' color='white' />
        </FacebookShareButton>
        <LinkedinShareButton
          className={themedStyles.button}
          resetButtonStyle={false}
          url={url}
          title={title}
          summary={`${title} ${url}`}
          source='https://8thwall.com'
        >
          <Icon stroke='socialLinkedIn' color='white' />
        </LinkedinShareButton>
      </div>
    </Grid.Column>
  )
}

export default SocialSharing
