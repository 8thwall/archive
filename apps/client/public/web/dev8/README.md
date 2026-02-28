# Developer Connection
This script is bundled into studio development builds so it can communicate with the editor and
reload when new builds are triggered.

## Development version build
Run a webpack dev server that auto rebuild your dev8.js on save.

```bash
npm install
npm run serve
```

## Production version build
The script can be built from this repository by running

```bash
npm install
npm run build
```

To test, first run a local server. Open a second console tab (you'll want to do this so you can
easily re-run `npm run build`). Then run

```bash
bazel run //bzl/httpfileserver/impl:http-file-server -- ${HOME}/repo/niantic/apps/client/public/web/dev8/dist
```

## Using this locally hosted version on a project

Next, find your local ip by running something like

```bash
ifconfig en0
```

Then go to a cloud editor project and add this line to `head.html`:

```html
<meta name="8thwall:internal" content="dev8:https://10.8.8.[your-ip]:8888/dev8.js">
```

Next, navigate to `https://10.8.8.[your-ip]:8888/dev8.js` in the browser on your phone to accept
https certificates.

Finally, save and build your project from the cloud editor and open it on your phone.


## Release process

Since dev8 has been bundled into runtime, please refer to `c8/ecs/README.md` for the latest instructions.

### DEPRECATED

dev8 builds are deployed via prod8 but needs studio-deploy to pick up the new URL.

* npm run build to build a new dist version.
* npm run copy to copy from repo/niantic into prod8.
* Open a PR on prod8 to land this new version of dev8.
* Update the URL in studio-deploy with the new URL. This change is at reality/cloud/aws/lambda/studio-deploy/constants.js.
