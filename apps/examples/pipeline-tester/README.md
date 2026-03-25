## Testing
### Markdown

This document is a markdown. It should have the following codeblock highlighted

```typescript
interface SomeInterface {
  itemA: number
  itemB: string
  itemC: any
}
```

## Curvy Image Targets
### Testing Curvy Targets
This project has been set up to enable easy testing of curvy targets. To test them, open up the AFrame or Three.JS Curvy demos on a phone (or computer). 
Separately you should open the Curvy Targets Scene, which contains a simulated scene to test against.

### Adding New Curvy Targets
1) Create the image target.

2) Add the image target to `targets.json`. We only know the name now, so you can just add something like:

```json
  {
    "name": "8_cylinder_portrait",
  },
```

3) Now we need the geometry for the target so we can construct it in the `Curvy Targets Scene`. Two steps here:
  - Uncomment the `console.log(detail)` line in `generate-targets-component.js`. Run `pipeline-tester` and start `curvy-targets-scene` (it's called "Curvy (AFRAME)"). You will get back an `imagescanning` callback that has the geometry you need. Copy it into `targets.json`.
  - Go to Admin Console. For cylindrical targets get the URL for "geom" (for cylindrical targets you can also use "original").
  and click on the texted titled "original". This will give you the original image label. 
  Copy the URL and put it into `targets.json`. Also add "isRotated" as a field.

## Warnings
We only support 10 image targets at a time, so if we exceed that this project will need to be updated.
It should be simple to add a button and swap out image targets in the app during runtime.
