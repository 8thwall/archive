# Studio Desktop

Run the electron desktop app

## Node v22

**Electron now requires node v22! Upgrade your local node version with nvm first before continuing!**

```
nvm install 22
nvm alias desktop 22
nvm use desktop
```

## Testing Electron In Dev Mode

Make sure you followed `xrhome/` readme first and have these three commands running in `xrhome/`:

```
npm run dev:hot
npm run start
npm run apps (if you want to test simulator in electron)
```

On top of the regular `xrhome/` set up, you also need to run a xrhome desktop build, open another terminal tab and run:

```bash
npm run dev:desktop:hot
```

Within `studiohub`, run the following command to start the electron app:

```bash
npm install
npm run app:start
```

If you want to test an electron build pointing to www-cd, you can also do:

```
npm run app:start:cd-prod
```

Make sure you hit the `[ALL_QA]` button on sign in page first for google auth before you actually sign in to 8th Wall.

## Testing Desktop Packaged App with Production Build

### Get a XRHome Desktop Build

Get a production build of `xrhome/` first. Make sure you have killed the previous `npm run dev:desktop:hot` command and run:

```
BUILDIF_FLAG_LEVEL=launch npm run dist:desktop
```

### Disable Code Signing

Navigate back to `studiohub/`. If you are only testing the packaged app on your own machine, you can ignore code signing. To do so, in `studiohub/builder.config.js`, comment out `electronFuses` and add `identity: null` to mac section.

See the Set up Apple Developer Credentials section below if you are building for distribution.

### Package The App

In `studiohub/`:
```
npm run make:prod
```

Once that completes, you should see the app under `studiohub/out/mac-arm64`


## Packaging Electron For Distribution + Deploying

### Doing it via Jenkins

1. Run the Jenkins job http://jenkins.8thwall.com:8080/view/all/job/studiohub-release/
2. Test the build by downloading the rc build s3://<REMOVED_BEFORE_OPEN_SOURCING>
/web/desktop/rc/. You can visit AWS console for this https://us-west-2.console.aws.amazon.com/s3/buckets/<REMOVED_BEFORE_OPEN_SOURCING>
?region=us-west-2&bucketType=general&prefix=web/desktop/rc/mac/&showversions=false
3. Once tested, you can publish this rc version to everyone `aws s3 sync s3://<REMOVED_BEFORE_OPEN_SOURCING>
/web/desktop/rc/ s3://<REMOVED_BEFORE_OPEN_SOURCING>
/web/desktop/latest/`
4. [Update our 8th.io links](https://ac.8thwall.com/links) for download on our website to the latest versions

For example, here is where they were pointing
* https://8th.io/mac-arm64-latest to https://cdn.8thwall.com/web/desktop/latest/mac/arm64/8th+Wall-0.0.202509171641-arm64.dmg
* https://8th.io/mac-intel-latest to https://cdn.8thwall.com/web/desktop/latest/mac/x64/8th+Wall-0.0.202509171641.dmg

### Doing it by hand (deprecated)

If you want to publish the app or test it on someone else's computer, the app must be code signed. See `reality/cloud/studiohub/README-ELECTRON.md` to make sure you have the correct certificate and Apple ID set up before continuing. Make sure you have these env vars set on your machine:

```
export APPLE_ID="<your-name>@8thwall.com"
export APPLE_TEAM_ID="<REMOVED_BEFORE_OPEN_SOURCING>"
export APPLE_APP_SPECIFIC_PASSWORD="<app-password>"
```

You can skip the last export above. Instead, you can read the app password so the password only live
in memory and not on disk in your history.

```
read -rs APPLE_APP_SPECIFIC_PASSWORD
<paste the password from your clipboard or type it. Hit Enter>
export APPLE_APP_SPECIFIC_PASSWORD
```

If your system is ready for code-signing, you would get something like this when you run `security
find-identity -p codesigning -v`

```
1) 4EA48768CA1051D53E749AFFEC4A52A9FCD29F07 "Developer ID Application: 8th Wall, Inc. (<REMOVED_BEFORE_OPEN_SOURCING>)"
   1 valid identities found
```

Then in `xrhome/`, run:
```
BUILDIF_FLAG_LEVEL=launch npm run dist:desktop
```

And in `studiohub/`, run:

```
npm run make:prod
```

This will take much longer since it's doing code signing.

### Configure Code Signing for Windows

**You don't need to sign a Windows exe if you want someone else to test your Windows build!**

Each Windows build invoke code signing [8 times](https://github.com/electron-userland/electron-builder/issues/3995). We only have 1000 signatures in total, so we don't want to invoke any Windows code signing unless it's a release build on jenkins. This section is only for documenting the set up process.

#### Set up DigiCert ONE account

Make sure you can access DigiCert ONE. This is where you are getting secret API key, client authentication certificate, and their client tools. Reach out to Tony or Cindy for access.

#### Create a folder on your computer at location of your choice

You are going to download a couple different files and tools in this process, so putting them somewhere together will probably make your life easier.

Also export the folder path to your `$PATH` variable, for example:

```
export DIGI_CERT_TOOL="/Users/cindy/digicert"
export PATH="$DIGI_CERT_TOOL:$PATH"
```

#### Set up your credentials

After logging in to your DigiCert ONE, go to `Get Started` on section on the top right corner. Follow the set up wizard to set up your API key and download the client authentication certificate. SAVE YOUR API KEY AND CERTIFICATE PASSWORD!

Once you get a `.p12` file, double click that to open it in your keychain.

You can also follow [this guide](https://docs.digicert.com/en/digicert-keylocker/get-started/signer-guide.html) in case you missed something on the wizard.

#### Set up macOS client tool

Follow [this guide](https://docs.digicert.com/en/digicert-keylocker/client-tools/tool-packages/macos-clients.html) to download the client tools. Follow both `SMCTL` and `PKCS11` set up.

Under `SMCTL` configuration, you want to store your credential in keychain. Run:
```
./smctl-mac-x64 credentials save <API Key> <Client certificate password>
```

After you store your credential, run:

```
export SM_HOST=https://clientauth.one.digicert.com
export SM_CLIENT_CERT_FILE=<path to your .p12 file>
```

You should also set `smctl` to alias `./smctl-mac-x64`. In your digicert folder, run:

```
sudo mv ./smctl-mac-x64 /usr/local/bin/smctl
sudo chmod +x /usr/local/bin/smctl
```

Verify it's working by:
```
smctl --help
```

#### Set up JSign

`jsign` is the third party signing tool we are using. You can either follow [this guide](https://docs.digicert.com/en/software-trust-manager/client-tools/signing-tools/third-party-signing-tool-integrations/jsign.html), or :

```
brew install jsign

export JSIGN_ROOT="/opt/homebrew/bin/jsign"
export PATH="$JSIGN_ROOT:$PATH"
```
#### Set up env variables for build

The Windows signing script expect these env vars to be set:
```
process.env.DIGICERT_KEYPAIR_ALIAS
process.env.DIGICERT_CERTIFICATE_PATH
process.env.PKCS11_CONFIG
```
Let's get the certificate first, run:

```
smctl certificate download --keypair-alias key_1371131033
```

And you should see a `.pem` file downloaded to your digicert folder. (key_1371131033 is our keypair alias)

Finally, run:

```
export DIGICERT_KEYPAIR_ALIAS="key_1371131033"
export DIGICERT_CERTIFICATE_PATH=<path to your .pem file>
export PKCS11_CONFIG=<path to your pkcs11properties.cfg file>
```

#### Health Check

You can run `smctl healthcheck` to check the credentials have been set up properly. It's fine if the signing tools section is empty. We will manually specify `--tool` flag in the command.

You can also test signing on a exe file:

```
smctl sign --keypair-alias $DIGICERT_KEYPAIR_ALIAS --certificate $DIGICERT_CERTIFICATE_PATH --config-file PKCS11_CONFIG --input <path to exe file> --tool jsign
```

Congratulations! You're finally done with the setup!
