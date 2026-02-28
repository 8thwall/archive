// @rule(js_cli)
// @attr(target = "node")
// @attr(esnext = 1)
// @package(npm-rendering)

// @dep(//c8/cli:args)
// @dep(//c8/dom:staging-access)
// @dep(//bzl/js:fetch)

// This script fetches the version number set in the application code for "Into The Scaniverse."
// At the moment, there isn't a generic semver system in studio projects that can be fetcehd.
// This is intended to keep the native build version in sync with the web build version.
// This script expects studio to have a script tag with a particular layout that can be fetched.
// The script tag should have a tuple with a way to construct the app script url.
// When the app script is fetched, the version number is extracted from the script.
// The version number is regexed (match appVersion:x.x.x) from script and printed to the console.

// See the following URL for an example of the script that sets the version number:
// https://www.8thwall.com/tigerteam/external/niantic/intothescaniverse/studio?file=app-version.js

import * as htmlparser2 from 'htmlparser2'

import type {fetch} from 'undici-types'

import {checkArgs} from '@nia/c8/cli/args'
import {getStagingCookie} from '@nia/c8/dom/staging-access'

const builtInFetch = (globalThis as any).fetch as typeof fetch

const parseTuple = (t: string): any[] => JSON.parse(`${t.replace(/\(/g, '[').replace(/\)/g, ']')}`)

const tryGetCookie = async (url: string, passcode: string): Promise<string> => {
  let cookie = ''
  if (url.includes('.staging.8thwall.')) {
    cookie = await getStagingCookie(passcode, url)
  }

  return cookie
}

const fetchAndProcessScript = async (htmlUrl: string, scriptContent: string, passcode: string) => {
  try {
    // Get the cookie for authentication
    const cookie = await tryGetCookie(htmlUrl, passcode)

    // Fetch the HTML file
    const response = await builtInFetch(htmlUrl, {headers: {cookie}})
    const htmlText = await response.text()

    let scriptFound = false
    let scriptUrl = ''

    // Parse the HTML
    const parser = new htmlparser2.Parser({
      onopentag(name, attribs) {
        if (name === 'script' && attribs.type === 'text/javascript') {
          scriptFound = true
        }
      },
      ontext(text) {
        /*
         * Very, very specific code for getting the data from Into The Scaniverse
         * 1. Initial HTML doesn't have the version number directly.
         * 2. Fetch the script that processes the version number and adds the html.
         *  2.1 The script tag looks like:
         *  <script type="text/javascript">app8("","none","",false,"/intothescaniverse/",
         *    "dist_92d9db2dad2860c0cefb2b98fad189cf2f59efed-aa3a9bc50a9de2ce36a50e3e6b1b1f35_")
         *  </script>
         *  3. Parse tuple, append "bundle.js" to the script basename.
         */
        if (scriptFound && text.includes(scriptContent)) {
          const strippedText = text.replace(scriptContent, '')
          const scriptTuple = parseTuple(strippedText)

          scriptUrl = `${new URL(htmlUrl).origin}${scriptTuple[4]}${scriptTuple[5]}bundle.js`
        }
      },
      onclosetag() {
        scriptFound = false
      },
    })

    parser.write(htmlText)
    parser.end()

    if (!scriptUrl) {
      // eslint-disable-next-line no-console
      console.log('[fetch-version]: Script URL not found in HTML.')
      return
    }

    // Fetch the script and process it
    const scriptResponse = await builtInFetch(scriptUrl)
    const scriptText = await scriptResponse.text()

    // Again, very specific code for Into The Scaniverse
    // This can break if the script changes
    // TODO: Make app versions a generic parameter for studio projects in the future
    const regex = /appVersion:"(\d+\.\d+\.\d+)"/
    const versionMatch = scriptText.match(regex)?.[1]

    // Print the output to be captured by the shell script
    // Somewhat brittle, but the value needs to be a bash variable for other CI jobs
    // eslint-disable-next-line no-console
    console.log(versionMatch)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetch-version]: Error fetching and processing script:', error)
  }
}

const args = checkArgs({
  minOrdered: 2,
  maxOrdered: 3,
})._ordered

// Get command-line arguments
const htmlUrl = args[0]
const scriptContent = args[1]
const passcode = args[2]

// Example usage with command-line arguments
if (htmlUrl && scriptContent) {
  fetchAndProcessScript(htmlUrl, scriptContent, passcode)
} else {
  // eslint-disable-next-line no-console
  console.error(
    '[fetch-version] Please provide both htmlUrl and scriptContent as command-line arguments.'
  )
}
