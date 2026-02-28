# Develop XRExtras

# What is XRExtras

XRExtras contains support components so our customers (developers) can easily use 8th Wall products in their engine: ThreeJS, A-frame.

# Using XRExtras with Editor projects

In 8th Wall Editor, you can easily include XRExtras using a `meta` tag. For us to develop improvements to XRExtras, we want a new `xrextras.js` to be rebuilt every time we make some code change locally. We also want the Editor project to use this `xrextras.js` file.

## TL;DR

 1. `cd apps/client/public/web/xrextras`

 2. `npm i`

 3. `npm run dev`

 4. Use your xrextras in your editor project.

## Set up a locally hosted xrextras.js

### Method 1 - Using node

In `8thwall`, go to `apps/client/public/web/xrextras`, then run `npm run dev`. This should auto-build and host your current 8thwall version of xrextras at port 9000.

You should see an output similar to
```
> xrextras@0.0.26 dev /Users/dat/repo/8thwall/apps/client/public/web/xrextras
> webpack-dev-server

ℹ ｢wds｣: Project is running at <https://0.0.0.0:9000/>
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from /Users/dat/repo/8thwall/apps/client/public/web/xrextras/dist
ℹ ｢wdm｣: Hash: f66550f1d0ca30cf94f0
```

Find your IP on your local network with `ipconfig getifaddr en0`: e.g. `192.168.0.101`

### Method 2 - Using Bazel

in Niantic Repo go to `apps/client/public/web/xrextras`, then run `npm run build`. This should auto-build your xrextras into a deployable package.

Then run
```bash
bazel run //bzl/httpfileserver/impl:http-file-server -- ${HOME}/repo/niantic/apps/client/public/web/xrextras/dist/
```

You should see an output similar to this:
```
INFO: Invocation ID: 2108c204-6443-49a6-95d5-329d20d0afbd
INFO: Analyzed target //bzl/httpfileserver/impl:http-file-server (0 packages loaded, 0 targets configured).
INFO: Found 1 target...
Target //bzl/httpfileserver/impl:http-file-server up-to-date:
 bazel-bin/bzl/httpfileserver/impl/http-file-server
INFO: Elapsed time: 0.840s, Critical Path: 0.00s
INFO: 1 process: 1 internal.
INFO: Build completed successfully, 1 total action
INFO: Build completed successfully, 1 total action
Serving directory /Users/trichu/repo/niantic/apps/client/public/web/xrextras/dist with https - accepting CORS requests without restrictions
Serving static files on https://10.8.8.56:8888
=========================
Files:
https://10.8.8.56:8888/index.d.ts
https://10.8.8.56:8888/src/aframe/aframe.d.ts
https://10.8.8.56:8888/src/aframe/components/asset-components.d.ts
https://10.8.8.56:8888/src/aframe/components/debug-components.d.ts
https://10.8.8.56:8888/src/aframe/components/face-components.d.ts
https://10.8.8.56:8888/src/aframe/components/gestures-components.d.ts
https://10.8.8.56:8888/src/aframe/components/hand-components.d.ts
https://10.8.8.56:8888/src/aframe/components/lifecycle-components.d.ts
https://10.8.8.56:8888/src/aframe/components/recorder-components.d.ts
https://10.8.8.56:8888/src/aframe/components/session-reconfigure-components.d.ts
```

Your package should then be available at that printed out URL.

**NOTE:** This method will start an HTTP server that can be used to hosted any static files at the path indicated i.e. `${HOME}/repo/niantic/apps/client/public/web/xrextras/dist/` in the example above. You can change that path or put any static files you want into that path to be hosted along side your code (pretty useful when you want to host things like modified 8frame or three.js)

## Manually browse to the locally hosted xrextras.js on your Phone

Before using a locally hosted xrextras.js in a cloud editor project, you first must **manually browse to the URL**.

Example: `<https://192.168.0.101:9000/xrextras.js`>

The browser will display an SSL warning to the effect of "This Connection Is Not Private", "This Connection is Untrusted", etc.

These screens vary depending on browser but will look something like this:

Tell your phone to use a locally hosted xrextras.js

Update `head.html` in your Editor project to

Remove or comment out 8th Wall built-in xrextras support and add your cross-origin xrextras
```html
< !-- < meta name="8thwall:package" content="@8thwall.xrextras"> -- >
<script crossorigin="anonymous" src="<https://192.168.0.101:9000/xrextras.js"></script>
```

Don't forget to use your IP and that your phone is on a network that can access your laptop via that IP.

## Make changes

You can now make changes to your xrextras code locally and refresh to see such change on your phone. You may first need to navigate to `<https://192.168.0.101:9000/xrextras.js`> from your phone's browser to confirm it's safe to proceed to this site.

# Deploying XRExtras

To deploy a new version of XRExtras, you do the following steps:

 1. Test your code inside 8thwall. Create a PR with those changes and get it approved

 2. Create an XRExtras build inside 8thwall by running `npm run build`. The code will be put in the `dist` folder.
If you get an error that webpack isn't installed cd to `8thwall/apps/client/public/web/xrextras` and run `npm i`.

 3. Copy your build over to `prod8/tree/master/cdn/web/xrextras/` and rename that file to a new incremented version `xrextras-x.x.x.js`.
`cp ./apps/client/public/web/cdn/xrextras/rc/xrextras-xxxxx.js ../prod8/cdn/web/xrextras/xrextras-x.x.x.js`
The general flow is you'd have a PR for a version, and then a pr to copy a version to beta, and then a pr to copy beta to xrextras.

 4. While the PR is on-going, our webhook will upload the xrextras to cdn-dev which would give you a link to use to test further prior to landing.

 5. Once the PR for that one file change is merged, it is automatically deployed via a git webhook that goes to prod8-cdn-update. You can check out the lambda logs there to make sure there aren't any errors. Go test the incremented version by updating your `head.html` file with `< meta name="8thwall:package" content="@8thwall.xrextras:x.x.x" >`

 6. When that is looking good, create a new PR by overwriting xrextras-beta.js with your incremented build.

 7. When that is looking good, create a new PR by overwriting xrextras.js with xrextras-beta.js.

 8. Once you've merged your PR, let everyone know on #release-active the new version number of the xrextras release.

 9. Test the new production XRExtras and keep your eyes on 8thwalldevs slack channel.

 10. You can now create the PR for any documentation changes necessary in `docbox8`. Once that is reviewed, Tony will deploy the changes using `docbox8/deploy-beanstalk.sh`

 11. Copy over your changes manually to <https://github.com/8thwall/web/tree/master/xrextras/src.>

# Editing the engine for use in WKWebViews

If you need to debug the engine in a WKWebView (i.e. you're getting things working in Instagram), see `Developing on WKWebViews` on
