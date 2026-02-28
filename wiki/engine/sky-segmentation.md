# Sky Segmentation

## Source Code

Environment Map Rendering - //reality/engine/semantics/semantics-cubemap-renderer.*

Controller - //reality/app/xr/js/layers-controller.cc & //reality/app/xr/js/src/layers-controller.ts

Omniscope - //apps/client/internalqa/omniscope/native/views/semantics/semantics-cubemap-view.cc

## Pipeline Overview

# Semantic Cubemap View

This is an omniscope view that helps us determine the following information

 1. The camera pose should be correct with respect to the ground plane. i.e. if the camera is looking up, the camera feed should be for looking up.

 2. The Semantic Output from the camera feed should make sense. If you see sky areas in the Camera Feed, they should be white color pixels in the Semantic Output.

 3. The Cubemap render (right most) should be close to the Semantic Output. As we update the cubemap, the rendering result will get better over time. In Omniscope, this is done on the same frame so the two visualization should look similar. On a real device, there will be a delay from the Semantic Output view to the Cubemap render view.

 4. Camera looking at the Cubemap: should point to the correct part of the cubemap sky.

# Rendering Pipeline of semantics-cubemap-renderer.*

Update `srcTex_` from Model Output

 * controller function - `updateCubemap` in `layers-controller.ts`

 * texture data - `{s, s, s, 1.0}` as RGBA where `s` is the sky semantics result

 * texture update call `SemanticsCubemapRenderer::updateSrcTexture`
