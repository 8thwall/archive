# XR Development in Studio

To have XR interact with studio we have a threejs renderer handled in `reality/app/xr/js/src/cloudstudio-threejs-renderer.ts`. This will also handle any events thrown by XR and bring it over to studio.

## World Effects

World effects currently just supports SLAM.

Current world effects events getting thrown are:

 * `trackingstatus`

 * `projectwayspotscanning`

 * `projectwayspotfound`

 * `projectwayspotupdated`

 * `projectwayspotlost`

 * `meshfound`

 * `meshupdated`

 * `meshlost`

 * `imageloading`

 * `imagescanning`

 * `imagefound`

 * `imageupdated`

 * `imagelost`

### SLAM

SLAM camera tracking is supported by dispatching `cameraupdate` which contains the new camera rotation, position, and fov as an event from the respective camera ecs. This is then handled in `xr-manager` which will update the camera transform so that the tracking will also be shown in sync.

### Image Targets

Most functionalities for image targets remained the same, but with a few changes from editor.

We increased the active image target count to 32. Theoretically, this number can be much higher, however the time it took to load the images as well as round robin the imagines individually was rather long. The following table below is the results of experiments when increasing the amount of image targets loaded into the engine as well as how long it took for it to recognize any image target.

| Phone | Images loaded | FPS | Time for first image (ms) | Average image (ms) | World Tracking? | Notes |
|---------------|----------------|--------|----------------------------|---------------------|------------------|-----------------------------------------------------------|
| Galaxy S21 | 15 | 20-30 | 3309 | 1924 | no | |
| | 33 | 20-25 | 10023 | 3282.1 | no | |
| | 54 | 20-30 | 6743 | 3170.09 | no | |
| | 103 | 20-30 | 15344 | 3266.15 | | |
| | 132 | 20-30 | 17030 | 7013.04 | no | |
| | 202 | 20-30 | 7839.17 | 7839.167 | no | |
| iPhone 13 Pro | | | | | no | |
| | | | | | no | |
| | | | | | no | |
| | | | | | no | |
| Galaxy S21 | 15 | 14-15 | 3531 | 686.31 | yes | |
| | 33 | 18-20 | 6129 | 5242.73 | yes | Starts to hang sometimes; 3926 ms without a few outliers |
| | 132 | 13-20 | 6208 | 7063.14 | yes | |
| | 202 | 15-20 | 25390 | 7688.22 | yes | Considerable amount of time to load |
| iPhone 13 Pro | 15 | 50-60 | 2535 | 552.59 | yes | |
| | 33 | 50-60 | 4465 | 699.30 | yes | |
| | 132 | 50-60 | 6505 | 2187 | yes | |
| | 202 | 45-50 | 12080 | 2549.6 | yes | |

Additional work for image targets would be:

 * Gravity aligned image targets

 * Unlimited image targets (we currently only track maximum 4 at a time while searching for image targets one at a time)

 * Increase the efficiency of uploading/editing image targets (namely conical targets)

Additional information in testing image targets locally.

## Face Effects

Current face effects functions are `face-attachment` and `face-mesh` implemented as components in `c8/ecs/src/runtime/xr/xr-face-components.ts` to an added `face-entity` which will automatically have a `face-anchor` component to position the face entity with respect to the active camera.

Face effects events supported for studio are:

 * `faceloading`

 * `facescanning`

 * `facefound`

 * `faceupdated`

 * `facelost`

 * `mouthopened`

 * `mouthclosed`

 * `lefteyeopened`

 * `lefteyeclosed`

 * `righteyeopened`

 * `righteyeclosed`

 * `lefteyebrowraised`

 * `lefteyebrowlowered`

 * `righteyebrowraised`

 * `righteyebrowlowered`

 * `righteyewinked`

 * `lefteyewinked`

 * `blinked`

 * `interpupillarydistance`

 * `earpointfound`

 * `earpointlost`

Older ear events `earfound` and `earlost` (not using the ear detection model) are deprecated for studio.

Face attachments are done by clicking one of the attachment points (values are stored in `c8/ecs/src/shared/face-mesh-data.ts` ) - this is handled in `c8/ecs/src/runtime/entity.ts`

 * Things to note: we currently aren’t supporting being able to change the attachment once it’s set as we are uncertain how we want to handle the possible entity name changes. There is a custom configurator in `reality/cloud/xrhome/src/client/studio/configuration/component-configurator.tsx` as `XrAttachmentConfigurator` (labeled as such for future use cases like hand) to handle this.

## XR Chunk Loading

Currently XR chunks are managed by `manifest.json` as such:
```json
{
 "version": 1,
 "config": {
 "preloadChunks": ["slam", "face"],
 "deferXr8": true
 }
}
```

In which `preloadChunks` will specify which chunks will be preloaded in. If it is left blank, then all available chunks for studio will be loaded. This is currently specified in `reality/cloud/aws/lambda/studio-deploy/webpack-ecs.config.ts` as`["slam", "face"]` . To load no chunks, set this parameter to be an empty array. If a chunk is used without being preloaded, `xr-camera-pipeline` will automatically load whichever chunk is needed for the camera.

`deferXr8` (default false) will not load XR engine if it is specified to true. If any XR camera components are used, it will automatically load XR8 in `xr-camera-pipeline`.

### XR Debug Components

Custom components has been made to help debug the xr effects and camera feed. They are currently defined in `xr-debug.ts` under the `example-components` folder in the `cloud-studio-qa-build` project.

 * `world-effect-debug`

 * `face-effect-debug`

 * `xr-events-debug` \- handles camera status changes
