---
sidebar_label: configure()
---
# VpsCoachingOverlay.configure()

`VpsCoachingOverlay.configure({ wayspotName, hintImage, animationColor, animationDuration, textColor, promptPrefix, promptSuffix, statusText, disablePrompt })`

## Description {#description}

Configures behavior and look of the Lightship VPS Coaching Overlay.

## Parameters (All Optional) {#parameters-all-optional}

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
wayspotName | `String` | | The name of the Location which the Coaching Overlay is guiding the user to localize at. If no Location name is specified, it will use the nearest Project Location. If the project does not have any Project Locations, then it will use the nearest Location.
hintImage | `String` | | Image displayed to the user to guide them to the real-world location. If no hint-image is specified, it will use the default image for the Location. If the Location does not have a default image, no image will be shown.
animationColor | `String` | `'#ffffff'` | Color of the Coaching Overlay animation. This parameter accepts valid CSS color arguments.
animationDuration | `Number` | `5000` | Total time the hint image is displayed before shrinking (in milliseconds).
textColor | `String` | `'#ffffff'` | Color of all the Coaching Overlay text. This parameter accepts valid CSS color arguments.
promptPrefix | `String` | `'Point your camera at'` | Sets the text string for advised user action above the name of the Location.
promptSuffix | `String` | `'and move around'` | Sets the text string for advised user action below the name of the Location.
statusText | `String` | `'Scanning...'` | Sets the text string that is displayed below the hint-image when it is in the shrunken state.
disablePrompt | `Boolean` | `false` | Set to true to hide default Coaching Overlay in order to use Coaching Overlay events for a custom overlay.

## Returns {#returns}

None

## Example - Code {#example---code}

```javascript
VpsCoachingOverlay.configure({
    textColor: '#0000FF',
    promptPrefix: 'Go look for',
})
```
