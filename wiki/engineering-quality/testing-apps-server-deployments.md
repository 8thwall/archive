# Testing Apps Server Deployments

What to test before pushing to Apps-prod. Note: A lot of the complexities of this logic has now been reflected in unit tests, so we don’t have to be as exhaustive as we were before we had that set up.

<server> is the new name, but <server> is an alias of that. These both operate on production data.

With third party cookies being killed early 2025, you would want to do these tests in an incognito window which has third party cookies disabled.

# **<server>

## _**1\. Serving hosted apps**_

 1. Normal serving

 * Make sure you don’t have a dev token

 * Using jellyfish as an example because it doesn’t have allowed origins:

 * Load

 * Should serve the app and start

 2. Staging serving

 * Make sure you don’t have a dev token

 * Visit _

 * You should see “Production”

 * Set a dev token for the 8w workspace from _

 * Visit _

 * You should see “Staging”

 3. Case insensitivity

 * Load (Capital “W” in “8W”)

## _**2\. Serving xrweb.js and verifying**_

### **Setup**

 * Set, or make sure the following apps are ready:

 * App A:

 * Hosted on (Legacy Hosting)

 * Loads xrweb from

 * No allowed origins

 * No custom domains

 * Example:

 * Console link: _

 * App B:

 * Hosted on 8thwall.app (Different validation rules apply to 8thwall.app origins)

 * Manually edited on S3 to load xrweb from (might have already been done)

 * No allowed origins

 * No custom domains

 * Example:

 * Console link: _

 * App C:

 * Hosted on a non-8th Wall domain, or on local

 * Loads xrweb from

 * No allowed origins

 * No custom domains

 * Example: [_https://hmncl.us/raw/staging-test_](<https://hmncl.us/raw/staging-test>)

 * Console link: _

 * Make sure your device has no dev tokens

 * Connect your device to dev tools so you can verify that the requests are going to

 1. Hosted

 * Open App A

 * Should load and verify with apps-rc

 * window._XR8.sampleRatio should be 1 (or similarly low number)

 2. Studio project

 * Open App B

 * Should load and verify with apps-rc

 3. Rejects without valid authorization

 * Open App C

 * Should throw an error and not load

 4. With allowed origin

 * Add an allowed origin for App C’s domain.  So, for example in the staging-test project, you would add [hmncl.us](<http://hmncl.us>) to the Setup Domains popup.

 * Open App C

 * Should load and verify

 * Delete the allowed origin

 5. Custom domain

 * Create a custom domain in the console for App C’s domain

 * You don’t have to actually add the DNS records

 * Open App C

 * Should load and verify

 * Delete the custom domain (refresh verification in order to see the delete button)

 6. With dev token

 * Set a dev token on your device for App C

 * Open App C

 * Should load and verify

 * window._XR8.sampleRatio should be 1

## _**3\. App resources**_

 1. Dynamic image targets

 * Load

 * At the beginning, only about 3 image targets will be loaded.  Start with page-0 on the targets page and then incrementally move through the image targets and make sure text appears over them.  It will load the other image targets and you progress through the pages in ascending order. More than 10 image targets should be requested and loaded as progress is made through the book.

 * _

 2. Includes cover image and shortlink 

 * Build a change at without previewing. ( might already be set up, make sure it verifies with <server> in the network tab

 * Otherwise:

 * Go to _ &tab=overview_

 * Download the index.html for your changeset and edit it to load xrweb from <server> then reupload it

 * Preview the app

 * Record a video

 * The cover photo and shortlink for the app should show up in the end card

## _**4\. Caching**_

 1. Repeated loads of the same version of xr.js should be shown in the network inspector as coming from cache. We should see that successive loads show (memory cache) or (disk cache), indicating that we didn’t have to download them again.

## _**5\. Managing dev tokens**_

 1. should show a page displaying your dev token status

 2. Remove button should work

 3. is8 accounts should see all 5 channels in the drop down, non is8 accounts should see just release and beta.  You can test the non is8 experience by going to a workspace that is not 8w/ or 8thwall/.  Reach out to Tony or Christoph to be added to a non 8thwall workspace.

 4. is8 accounts should see the list of account shortnames, non is8 accounts should see the account name 

## _**6\. Image Target Tokens**_

 1. Image Target Tester

 1. Make sure you have a dev token for the 8w workspace

 2. Go to _ and select an image target

 3. Take the the preview link and switch the domain to “<server> preserving the path and query params. The way this was set up is creating a build, then overriding the xrweb domain to “<server> on S3.

 4. You should see that the /xrweb request went to <server> and the image target you selected is detected.

## _**7\. Engine URL override**_

 1. Correct engine override URL

 1. Go to an app that has is8 access like _

 2. Give yourself a token for local engine version. If the URL isn’t an actual xr.js URL it’s fine

 3. Go to

 4. You should see that the custom URL is loaded.

# **<server>

## _**8\. Handles dev tokens**_

 1. Set token with redirect

 1. From , open Device Authorization and click “Authorize this device” (Remove authorization first if needed)

 2. The new window should open and end up on <server> with the correct token

 3. Visiting _ should then show the token containing the list of shortnames that the device is authorized to view

 2. Token dump

 1. _ should respond with an array of shortnames that the device is authorized to view

 3. Remove token with redirect

 1. From _ with a dev token, click Remove Dev Token

 2. It will first navigate to _ to remove its tokens, then redirect to _ to remove tokens from the other domain

 3. If everything worked correctly, you should see a blank screen if you go to: _

# **Testing Global Deployment**

**NOTE: In order to reach endpoints in other regions, a proxy is necessary.**

**This check ensures that production endpoints are reachable, functionality is tested on staging**

## _**1\. Ensuring server is reachable on all domains**_

The Infrastructure for testing global site availability is documented here

`<REMOVED_BEFORE_OPEN_SOURCING>` (Google Doc)

 1. **For each region**

 * Start a session as described in the above site availability doc

 2. Send requests to the server on various domain names

 * We are checking to make sure that certificates work and the server responds with a non-error code

 * `curl -v

 * `curl -v

 * TODO(pawel) automate this with a job

# **Testing SIMD Builds**

Browsers that support SIMD Wasm instructions should use the SIMD version of our build for speed improvements.  We only have SIMD builds for engine version 17.1.0 and later.Current versions of Chrome and Firefox should support SIMD builds on Android.  iOS does not currently support SIMD builds.

If you put in a custom engine location, it should always choose that url and ignore simd vs non-simd.

The current way to check that your phone is using the correct build is by checking the network tab when the phone is connected to my laptop.  For non-simd builds, it will be xr-<build#>.js.  For simd builds, it will be xr-simd-<build#>.js.

## _**1\. Confirm Chromium browsers on Android load the -simd version of release**_

 1. Connect your Android device to your laptop using chrome://inspect/#devices

 2. Get the release token on your Android.

 3. Load an AR app.

 4. Make sure that you are loading xr-simd-<build#> from the network tab and that the build# matches the build for the release token.

## _**2\. Confirm iOS load the non-simd version of release**_

As of 2024/06/08, all devices load SIMD versions. You would need a device without SIMD. A typical iOS device will still load xr-simd-<build#>. It’s ok to skip this test.

 1. Connect your iPhone to your laptop using Safari debugger.

 2. Get the release token on your iPhone.

 3. Load an AR app.

 4. Make sure that you are loading xr-<build#> from the network tab and that the build# matches the build for the release token.

## _**3\. Confirm loading a custom engine url**_

 1. Connect your phone to your laptop using chrome://inspect/#devices

 2. Specify a custom engine url path

 3. Load an AR app.

 4. Make sure that you are loading the specified url.  The simd version should not matter, it should simply load the url you provided no matter what.

# **DNS and Certificates**

**NOTE: This is necessary when changing/adding domains under which apps server is reachable;** this configuration is expected to change only in rare instances.

## _**1\. Ensuring Route53 records and ACM certificates**_

 1. Ensure Route53 records are set

 1. `go 53` to enter Router 53 Management on AWS

 2. Find the hosted zone for the domain, e.g. 8thwall.app.

 3. For each production region we need a **latency** based record. Above shows that there is an **A** record for the domain _for each region_

 4. Each of these records is an **Alias** to the **apps-prod** elastic beanstalk instance for _a particular region_

 5. Routing policy is **Latency** , and _species the region of the particular apps server instance the alias is for_

 6. _**Each of these records points to a different apps-prod instance!**_

 7. _Below is an example for `ap-northeast-1`_

 1. Ensure SSL Certificates for each instance contains all domains we expect apps server to be reachable on.

 * Expected domains can be found on the apps server documentation page _

 * Elastic beanstalk configurations live in `<https://github.com/8thwall/8thwall/tree/master/reality/cloud/xrhome/.elasticbeanstalk> `

 * Each region has a configuration file.

 * Each instance has an elastic load balancer to handle SSL connections

 * The configuration file specifies the ACM certificate in use

 * [_https://github.com/8thwall/8thwall/blob/14a43ffdaff5f3863dcf46ea8b629339ed4af594/reality/cloud/xrhome/.elasticbeanstalk/Apps-prod-ap-northeast-1.cfg.yml#L40_](<https://github.com/8thwall/8thwall/blob/14a43ffdaff5f3863dcf46ea8b629339ed4af594/reality/cloud/xrhome/.elasticbeanstalk/Apps-prod-ap-northeast-1.cfg.yml#L40>)

 * **Each region has its own ACM certificates!**

 * _When adding domains to a certificate you must make sure**each** certificate has all the domains apps server is expected to be reachable under_

 * _`go acm` and navigate to the region you are checking_

 * _You can find the certificate referenced in the configuration file and verify that it has all the domains we expect_

 2. Ensuring that the load balancer is serving the correct certificate can be verified with the steps in the next section titled `testing global deployment`
