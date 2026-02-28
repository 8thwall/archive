# Testing In-App Experiences

# Developing in WKWebViews

Some WKWebViews (i.e. the web browser in Instagram) will not allow localhost connections so you can't host an engine locally and use it there. To work around this you can run: `./apps/client/public/web/cdn/engine/build-engine.js`. This will build and upload your local engine to the CDN (Amazon S3: 8w-us-west-2-webweb/test/engine/). You can then set the URL as your Custom engine location under Local version 0.0.0.0. An example URL is This URL is a hash of your hostname and username so will not change between builds. This should let you change code, run build-engine.js, and then refresh the app. You'll need to update your WKWebView's token using .

# App Specific Testing

## Instagram

 * You'll first need a token. Go to your profile. Click "Edit Profile". Change your "Website" section to Scan your project's QR code

 * Switch your profile's website to the project you want to test.

iPhone 8 | iOS 14.3
User Agent:
`Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 169.0.0.21.133 (iPhone10,1; iOS 14_3; en_US; en-US; scale=2.00; 750x1334; 261791898)`
Device Estimate:
`{"locale":"en-us","os":"iOS","osVersion":"14.3","manufacturer":"Apple","model":"iPhone 6/6s/7/8","browser":{"name":"WebKit","version":"605.1.15","majorVersion":605,"inAppBrowser":"Instagram"}}`

## Snapchat

 * Message yourself the links

iPhone 8 | iOS 14.3
User Agent:
`Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Snapchat/11.8.0.33 (like Safari/604.1)`
Device Estimate:
`{"locale":"en-us","os":"iOS","osVersion":"13.0","manufacturer":"Apple","model":"iPad","browser":{"name":"Safari","version":"14.0.2","majorVersion":14,"inAppBrowser":"Snapchat"}}`

## LinkedIn

 * Message and the app link to a coworker like Rigel or Nathan. They'll understand.

iPhone 8 | iOS 14.3
User Agent:
`Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]`
Device Estimate:
`{"locale":"en-us","os":"iOS","osVersion":"14.3","manufacturer":"Apple","model":"iPhone 6/6s/7/8","browser":{"name":"WebKit","version":"605.1.15","majorVersion":605,"inAppBrowser":"LinkedIn"}}`

## Chrome on iOS

 * Simply use and then go to your app like normal.

iPhone 8 | iOS 14.3
User Agent:
`Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Snapchat/11.8.0.33 (like Safari/604.1)`
Device Estimate:
`{"locale":"en-us","os":"iOS","osVersion":"13.0","manufacturer":"Apple","model":"iPad","browser":{"name":"Safari","version":"14.0.2","majorVersion":14,"inAppBrowser":"Snapchat"}}`

## Facebook

TODO - someone besides Nathan.

## Twitter

 * Put both links in your bio.

iPhone 8 | iOS 14.3
User Agent:
`Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1`
Device Estimate:
`{"locale":"en-us","os":"iOS","osVersion":"14.3","manufacturer":"Apple","model":"iPhone 6/6s/7/8","browser":{"name":"Mobile Safari","version":"14.0.2","majorVersion":14}}`

## Messenger

 * Send the and app link to yourself in Messenger

iPhone 8 | iOS 14.3
User Agent:
`Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 LightSpeed [FBAN/MessengerLiteForiOS;FBAV/293.0.0.42.224;FBBV/260970420;FBDV/iPhone10,1;FBMD/iPhone;FBSN/iOS;FBSV/14.3;FBSS/2;FBCR/;FBID/phone;FBLC/en;FBOP/0]`
Device Estimate:
`{"locale":"en-us","os":"iOS","osVersion":"14.3","manufacturer":"Apple","model":"iPhone 6/6s/7/8","browser":{"name":"Facebook","version":"293.0.0.42.224","majorVersion":293}}`
