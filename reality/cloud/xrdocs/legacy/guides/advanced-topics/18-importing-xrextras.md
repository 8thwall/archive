---
id: importing-xrextras-into-cloud-editor
---
# Importing XRExtras into Cloud Editor

This section of the documentation is intended for advanced users who are using the 8th Wall Cloud
Editor and need to create a completely customized version of XRExtras. This process involves:

* Cloning the XRExtras code from GitHub
* Importing files into your Cloud Editor project
* Disabling type-checking in A-Frame component files
* Updating your code to use your local, custom copy of XRExtras instead of pulling our default from CDN (via meta tag)

If you only need to make basic customizations of the XRExtras loading screen, please refer to
[this section](/legacy/guides/advanced-topics/load-screen) instead.

Note: By importing a copy of XRExtras into your Cloud Editor project, you will no longer receive the
latest XRExtras updates and functionality available in from CDN. Make sure to always pull the latest
version of XRExtras code from GitHub as you start new projects.

Instructions:

1. Create a `myxrextras` folder within your Cloud Editor project

2. Clone <https://github.com/8thwall/web>

3. Add contents of the `xrextras/src/` directory (<https://github.com/8thwall/web/tree/master/xrextras/src>)
to your project, with the **exception** of index.js

4. Your project contents will look something like this:

![xrextras files](/images/xrextras-import-files.jpg)

5. For **each** file in the `aframe/components` folder, remove the `import` statement and replace it with `// @ts-nocheck`

![xrextras disable type-checking](/images/xrextras-disable-type-checking.jpg)

6. In head.html, remove or comment out the `<meta>` tag for @8thwall.xrextras so it’s no longer pulled in from our CDN:

![xrextras head](/images/xrextras-import-head.jpg)

7. In app.js, import your local xrextras library:

![xrextras appjs](/images/xrextras-import-appjs.jpg)

#### Changing/Adding image assets {#changingadding-image-assets}

First, drag & drop new images into assets/ to upload them to your project:

![xrextras asset](/images/xrextras-import-asset.jpg)

In **​html** files​ with `src` params, refer to the image asset using a relative path:

`<img src="​../../assets/​my-logo.png" id="loadImage" class="spin" />`

In **javascript** files​, use a relative path and ​`require()​` to reference assets:

`img.src = ​require​('​../../assets/​my-logo.png')`
