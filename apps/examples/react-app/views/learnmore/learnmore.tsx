import {Page} from '../../lib/material-ui-components'

declare let React: any
declare let ReactRouterDOM: any

const {withRouter} = ReactRouterDOM

const LearnMore = withRouter(() => (
  <Page title='Learn More'>
    <h3>About 8th Wall Web:</h3>
    <p>
      8th Wall’s custom SLAM engine powers interactive augmented reality on the web. Develop WebAR
      projects using our fully featured Editor and collaborate with team members in real time.
      Launch rich, interactive AR experiences that can be viewed directly in a mobile browser. No
      apps required. Learn more and sign up for an account
      on <a href='https://8thwall.com'>8thwall.com</a>.
    </p>
    <h3>Resources:</h3>
    <p>
      Join our <a href='https://www.8thwall.com/slack/'>Slack channel</a> for realtime tips and
      support from the 8th Wall team and users. Download sample projects and view step-by-step
      setup guides on our <a href='https://github.com/8thwall/web'>GitHub</a>. Get help and discuss
      solutions with other 8th Wall users by using
      the <a href='https://stackoverflow.com/questions/tagged/8thwall-web'>8thwall-web</a> tag
      on Stack Overflow. Looking for even more example projects? Be sure to check out
      our <a href='https://glitch.com/@8thWall'>Glitch</a>.
    </p>
    <p>
      Still have questions? Email <a href='mailto:support@8thwall.com'>support@8thwall.com</a>
      and we will respond within 24 hours.
    </p>
  </Page>
))

export {LearnMore}
