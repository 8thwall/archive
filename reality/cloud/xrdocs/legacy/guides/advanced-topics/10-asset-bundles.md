---
id: asset-bundles
---
# Asset Bundles

The Asset bundle feature of 8th Wall's Cloud Editor allows for the use of multi-file assets.  These assets typically involve files that reference each other internally using relative paths. ".glTF", ".hcap", ".msdf" and cubemap assets are a few common examples.

In the case of .hcap files, you load the asset via the "main" file, e.g. "my-hologram.hcap".  Inside this file are many references to other dependent resources, such as .mp4 and .bin files.  These filenames are referenced and loaded by the main file as URLs with paths relative to the .hcap file.

![AssetBundleGif](https://media.giphy.com/media/dB0va3gWqncbgPYxxJ/giphy.gif)

## Create Asset Bundle {#create-asset-bundle}

#### 1. Prepare your files {#1-prepare-your-files}

Use one of the following methods to prepare your files before upload:

* Multi-select the individual files from your local filesystem
* Create a ZIP file.
* Locate the directory containing all of the files needed by your asset (Note: Directory upload not supported on all browsers!)

#### 2. Create New Asset Bundle {#2-create-new-asset-bundle}

##### Option 1 {#option-1}

In the Cloud Editor, click the **"+"** to the right of **ASSETS** and select "New asset bundle".  Next, select asset type.  If you aren't uploading a glTF or HCAP asset, select "Other".

![NewAssetBundle](/images/new-asset-bundle.jpg)

##### Option 2 {#option-2}

Alternatively, you can drag the assets or ZIP directly into the ASSETS pane at the bottom-right of the Cloud Editor.

![NewAssetBundleDrag](/images/new-asset-bundle-drag.jpg)

#### 3. Preview Asset Bundle {#3-preview-asset-bundle}

After the files have been uploaded, you'll be able to preview the assets before adding it to your project.  Select individual files in the left pane to preview them on the right.

![NewAssetBundlePreview](/images/new-asset-bundle-preview.jpg)

#### 4. Select "main" file {#4-select-main-file}

If your asset type requires you reference a file, set this file as your "main file". If your asset type requires you reference a folder (cubemaps, etc), set "none" as your "main file".

Note: This step is not required for glTF or HCAP assets.  The main file is set automatically for these asset types.

The main file cannot be changed later.  If you select the wrong file, you'll have to re-upload the asset bundle.

#### 5. Set Asset bundle name {#5-set-asset-bundle-name}

Give the asset bundle a name. This is the filename by which you'll access the asset bundle within your project.

#### 6. lick "Create Bundle" {#6-lick-create-bundle}

The upload of your asset bundle will be completed and it will be added to your Cloud Editor project.

## Preview Asset Bundle {#preview-asset-bundle}

Assets can be previewed directly within the Cloud Editor.  Select an asset on the left to preview on the right.  You can preview a specific asset inside the bundle by expanding the "Show contents" menu on the right and selecting an asset inside.

![AssetBundlePreview](/images/asset-bundle-preview.jpg)

## Rename Asset Bundle {#rename-asset-bundle}

To rename an asset, click the "down arrow" icon to the right of your asset and choose **Rename**.  Edit the name of the asset and hit Enter to save.  Important: if you rename an assset, you'll need to go through your project and make sure all references point to the updated asset name.

## Delete Asset Bundle {#delete-asset-bundle}

To delete an asset, click the "down arrow" icon to the right of your asset and choose **Delete**.

## Referencing Asset Bundle {#referencing-asset-bundle}

To reference the asset bundle from an **html** file in your project (e.g. body.html), simply provide the appropriate path to the **src=** or **gltf-model=** parameter.

To reference the asset bundle from **javascript**, use **require()**

#### Example - HTML {#example---html}

```html
<!-- Example 1 -->
<a-assets>
  <a-asset-item id="myModel" src="assets/sand-castle.gltf"></a-asset-item>
</a-assets>
<a-entity 
  id="model"
  gltf-model="#myModel"
  class="cantap"
  scale="3 3 3"
  shadow="receive: false">
</a-entity>


<!-- Example 2 -->
<holo-cap 
  id="holo" 
  src="./assets/my-hologram.hcap"
  holo-scale="6"
  holo-touch-target="1.65 0.35"
  xrextras-hold-drag
  xrextras-two-finger-rotate 
  xrextras-pinch-scale="scale: 6">
</holo-cap>
```

#### Example - javascript {#example---javascript}

```javascript
const modelFile = require('./assets/my-model.gltf')
```
