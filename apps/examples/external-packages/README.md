# External Libraries

This project demonstrates how to load external libraries in the cloud editor. It demonstrates:

1. Accessing a library with a CDN URL.
2. Accessing a library without a CDN URL.

-------

Accessing a library with a CDN URL:

The easiest way to load external libraries in the cloud editor is to use a script tag to load the package CDN URL in `head.html`.

You can often find a package CDN URL with something like unpkg or jsdeliver. Once you locate the browser files on a CDN find and reference the main file in the script src.

As an example, Flickity has official browser files and can be loaded to the window in `head.html` with one line:
```
<script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js"></script>
```

Which I can then access through the window variable in my custom script `carousel`:
```
console.log(window.Flickity)
```

-------

Accessing a library without a CDN URL:

While there are lots of CDNs that re-host what they find on NPM, some of them do not support packages with dependencies. Our strong reccomendation is to build the package locally and upload the build/dist file as an asset bundle in the cloud editor and reference the main file with a relative path in `head.html`.

Another option is to use a CDN that is preoptimized for browser use. Skypack is arguably the best in terms of dependency management. You can add a `<script type="module">` to import specific variables/functions from skypack and load them to the window to access them in custom scripts.

As an example, gltf-transform is a library for optimizing 3D model textures and *does not* have official browser files/CDN URL. Instead, specific variables/functions can be loaded to the window using a tool like skypack:
```
<script type="module">
  import {Document, WebIO} from 'https://cdn.skypack.dev/@gltf-transform/core'
  import {KHRONOS_EXTENSIONS} from 'https://cdn.skypack.dev/@gltf-transform/extensions'
  import {textureResize} from 'https://cdn.skypack.dev/@gltf-transform/functions'
  window.CoreDocument = Document
  window.CoreWebIO = WebIO
  window.KHRONOS_EXTENSIONS = KHRONOS_EXTENSIONS
  window.textureResize = textureResize
</script>
```

Then, access the imported variables/functions in an A-Frame component/custom script:

`optimize.js`
```
const {CoreWebIO, KHRONOS_EXTENSIONS, textureResize} = window
```

Ideally you'd want to use "pinned" URLs with Skypack: https://docs.skypack.dev/skypack-cdn/api-reference/pinned-urls-optimized
A good alternative may be https://esm.sh/