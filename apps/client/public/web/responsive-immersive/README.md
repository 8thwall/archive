# Responsive Immersive

The script can be built from this repository by running

To test, first run a local server. Open a second console tab (you'll want to do this so you can
easily re-run `npm run build`). Then run

```bash
bazel run :serve
```

Next, find your local ip by running something like

```bash
ifconfig -a | grep 10\.8
```

Then go to a cloud editor project and add this line to `head.html`:

```
<script src="https://localhost:8888/apps/client/public/web/responsive-immersive/responsive-immersive.js"></script>
```

Next, navigate to `https://10.8.8.[your-ip]:8888/responsive-immersive.js` in the browser on your phone to accept
https certificates.

Finally, save and build your project from the cloud editor and open it on your phone.
