### Your Exported Project
This zip contains your project source code, assets, and image targets.

### Project Overview
- `src/`: Contains all your original project code and assets.
    - Your scene graph is in `src/.expanse.json`. If you are on Mac and don't see this, press `Cmd + Shift + .` to show hidden files.
    - References to asset bundles will need to be updated. Asset bundles are now plain folders. For example,
      - GLTF bundles need to be updated to the `.gltf` file in the folder, i.e., if your model is at `assets/mymodel.gltf/`, update your code to reference `assets/mymodel.gltf/mymodel_file.gltf`.
      - Custom `.font8` fonts need to be updated to the `.font8` file in the folder, i.e., if your font is at `assets/myfont.font8/`, update your code to reference `assets/myfont.font8/myfont_file.font8`.
- `image-targets/`: Contains your project's image targets (if any).
  - The image target with the `_luminance` suffix is the image target loaded by the engine. The others are used for various display purposes, but are exported for your convenience.

### Final Notes
Please reach out to support@8thwall.com with any questions not yet answered in the docs. Thank you for being part of 8th Wall's story!