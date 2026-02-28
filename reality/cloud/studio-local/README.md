# Studio Local Dev

## `playground-editor/` and `playground-studio/` explained

`playground-editor/` and `playground-studio/` are for testing buildable code exports, and should work offline.

Before running any npm commands, download and place the external dependencies under `external/` first.

For `playground-studio/external/`, download the following:
- `external/runtime/`: [Studio Runtime on CDN](https://cdn.8thwall.com/web/ecs/resources/bundle-mip0jlx4.zip)

Other external dependencies are in progress of de-clouding.

## `ecs-build/` and `playground/` explained

`ecs-build/` contains all webpack source code we need to pack and publish `@8thwall/build`. To get a `8thwall-build-0.1.0.tgz` for testing, run:

```sh
cd ~/repo/code8/reality/cloud/studio-local/ecs-build
./tools/build.sh
./tools/bundle.sh
```

Then you should see `ecs-build/8thwall-build-0.1.0.tgz` that you can copy to any local studio project folder and run `npm install 8thwall-build-0.1.0.tgz` to install as a dependency.

`playground/` contains a sample local studio project for testing `ecs-build/`. `bootstrap.sh` script will generate a new tgz file and reinstall `@8thwall/build`. See the next section for testing.

## Testing Local Studio Project Builds

If you would like to build and serve a studio project locally, you can do:

```sh
cd ~/repo/code8/reality/cloud/studio-local/playground
npm run local:serve
```
And you can view your local studio project build on https://localhost:9002/. File changes will be automatically handled and updated by webpack dev server.

`npm run local:build` and `npm run local:serve` will always repack and update `@8thwall/build`. If you want to skip that, simply run `npm run build` or `npm run serve`.

#### Device Not Authorized Warning

Currently, `build/index.html` is hard coded with `cloud-studio-qa-build` app key. If you don't need world/face camera for your project, you can comment out this line in `index.html`:

```html
  <script src="https://apps.8thwall.com/xrweb?appKey=<REMOVED_BEFORE_OPEN_SOURCING>&s=1"></script>
```

If you have access to `cloud-studio-qa-build` under Lightship Team (`argeo`) workspace, you can build and preview the project in a new tab, and the warning should go away. You can also swap the app key with other prod project.

## Downloading and Testing Your Own Studio Project

We currently have a minimal version of download flow under `reality/cloud/studiohub`, and you can enable `STUDIO_LOCAL_20250306` flag in xrhome buildif to see project checkout button. However, this flow is still under developing and will be change a lot in the future, so it's better to manually download files from studio for now. You can replace the files under `src/` with your own files.

#### Special File Type

* `.expanse.json`: This is your scene graph. `.expanse.json` is hidden on Studio File Browser. If you have access to `www-cd.8thwall.com`, you can copy your scene graph from Scene Json Editor.
* `app.js`: This is the entry point for webpack build. If you add new component files, you need to import them here.
* `assets/`: Assets must be under `assets/` folder, and you will need the raw asset files.
* Asset Bundles: Any folder that is under `assets/` and has a dot in the name will be treated as an asset bundle. Asset bundle folder must have a `.main` file that specify the main file in the bundle. `.main` can be left empty for bundles like cubemap. Importing individual files under an asset bundle is not allowed.

#### Modules

Each module is represented as a json under `.dependencies/`. Webpack assumes that `index.html` has the right meta tag and script tags and that `build/type/` has type definition file for each module. If you want to include modules in your local build, you will need to add the tags and type files in addition to  dependency jsons.

## Project Structure

###  `build/`
This folder holds all files necessary for running webpack dev servers. You should not need to modify any files here for running a local studio project build, except `index.html` for project name, app key, module tags, etc..

### `src/`
This folder will hold all studio project files.
