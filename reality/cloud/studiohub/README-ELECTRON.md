@@ -1,46 +0,0 @@
# StudioHub Electron

Exploration around Electron Signing to prepare for Studio Desktop

## References

https://www.electronforge.io/core-concepts/build-lifecycle

https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging

https://www.electronforge.io/guides/code-signing

## Running locally

`npm run make`, `npm run package` (can only run on your own machine)

## How we got a Developer ID Application Certificate

1. `open /System/Library/CoreServices/Applications/`
2. Clicked Keychain
3. In the top left dock clicked Keychain Access -> Certificate Assistant -> Request a certificate from a CA
4. Filled out some info and saved to disk
5. Sent the certificateRequest file to Erik since he’s the account owner
6. Erik uploaded that to Apple on https://developer.apple.com/account/resources/certificates/add (Developer ID)
7. Erik downloaded the certificate and sent it to me
8. I double clicked it which opened it in keychain
9. I downloaded "Developer ID G2" from https://www.apple.com/certificateauthority/
10. I double clicked that
11. Confirmed working with `security find-identity -p codesigning -v`


## How to set up yourself

Get the cert from Erik/Christoph and follow steps 8-11 from above

## Packaging for Distribution

Sign in with your apple account and go to https://account.apple.com/account/manage to create an app specific password.

```
export APPLE_ID=<name>@8thwall.com
export APPLE_PASSWORD=<your-app-specific-password>
export APPLE_TEAM_ID=<REMOVED_BEFORE_OPEN_SOURCING>
```

`npm run make`
