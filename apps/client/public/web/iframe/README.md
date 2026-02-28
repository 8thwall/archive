# IFrame

Starting with iOS 9.2, Safari blocked deviceorientation and devicemotion event access from cross-origin iframes. This prevents 8th Wall Web (if running inside the iframe) from receiving necessary deviceorientation and devicemotion data required for proper tracking. The result is that the orientation of your digital content will appear to be wrong, and the content will "jump" all over the place when you move the phone.

If you have access to the parent window, it's possible to add a script on the parent page that will send custom messages containing deviceorientation and devicemotion data to 8th Wall Web inside the iframe via JavaScript's postMessage() method.

This script, when embedded on a page, sends customer messages containing deviceorientation and devicemotion data to 8th Wall Web inside the iframe.

The script is served at
[//cdn.8thwall.com/web/iframe/iframe.js](https://cdn.8thwall.com/web/iframe/iframe.js), or
can be built from this repository by running

```bash
$ npm install
$ npm run build
```

## Quick Reference:

```html
  <script src="//cdn.8thwall.com/web/iframe/iframe.js?id=my-iframe"></script>
  ...
  <body>
    <iframe
      id="my-iframe"
      style="border: 0; width: 100%; height: 100%"
      allow="camera;microphone;gyroscope;accelerometer;"
      src="https://apps.8thwall.com/8w/tonytest">
    </iframe>
  </body>
```

### Local Development

To test changes in a project, you can run `npm run dev`. Then add `iframe.js` and `iframe-inner.js` to your project:
  * `<script src="https://10.0.0.101:9001/iframe.js"></script>`
  * `<script src="https://10.0.0.101:9001/iframe-inner.js"></script>`

Make sure to visit these sites directly on your device and give permissions to visit the page.

You can also build and serve these files with `npm run build && bazel run //apps/server/https-static ~/repo/code8/apps/client/public/web/iframe/dist`, though they won't have hot reload and will be available on a different port.

### Releasing

Once ready to deploy changes, you can:
* Go to a clean `code8` client.
* Run `npm run build`.
* Copy files from `apps/client/public/web/iframe/dist/` into `prod8`.
* Make a PR with these changes.
* Jenkins will then upload these files to `cdn-dev` and comment on your PR. Test with these files before landing. They can be used by putting them in a `<script>` tag:
  * `<script src="//cdn-dev.8thwall.com/pr/foo/XXXXXXXX/web/iframe/iframe-0.0.X.js"></script>`
  * `<script src="//cdn-dev.8thwall.com/pr/foo/XXXXXXXX/web/iframe/iframe-inner-0.0.X.js"></script>`
