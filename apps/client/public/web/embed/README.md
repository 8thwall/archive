# Embed8

This script, when embedded on a page, populates specially crafted links with behaviors to optimize the flow of users to see the AR on their mobile devices. It uses QR codes served from 8th.io/qr/xxxx

The script is served at
[//cdn.8thwall.com/web/embed8/embed8.js](https://cdn.8thwall.com/web/embed8/embed8.js), or
can be built from this repository by running

```bash
$ npm install
$ npm run build
```

## Developing

Run ```npm run serve``` and go to ```https://localhost:9000``` to view testing html showing Embed8 links.

## Quick Reference:

```html
  <a class="embed8-link" data-short-name="jini"></a>
  // This script is optimally put in head but otherwise can be in body
  <script src="https://cdn.8thwall.com/web/embed8/embed8.js"></script>
```

