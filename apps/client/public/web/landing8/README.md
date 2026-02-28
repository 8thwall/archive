# Landing Page

Read the docs here: https://www.8thwall.com/docs/web/#landing-pages

`LandingPage` is a cross-platform "proto-module", meaning it's:
- Not part of XR8 and the user has to add it to their project with `<meta name="8thwall:package" content="@8thwall.landing-page">`
- Is not available on XRExtras because we don't want other companies to take our code.

Check it in action at https://8thwall.8thwall.app/configurator-aframe/

## Developing

- Add your IP address to `webpack.config.js`'s `devServer.host` field.
- Start a local server with `npm run-script watch`
- Try out the test project at `https://x.x.x.x:9003/test`
- In order to use your local version in a cloud editor project, add `<script crossorigin="anonymous" src="https://x.x.x.x:9002/landing8.js"></script>`
