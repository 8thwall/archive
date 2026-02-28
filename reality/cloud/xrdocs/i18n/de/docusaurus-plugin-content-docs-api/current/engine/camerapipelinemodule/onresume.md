# onResume()

Bei Lebenslauf: ()\`

## Beschreibung {#description}

`onResume()` wird aufgerufen, wenn [`XR8.resume()`](/api/engine/xr8/resume) aufgerufen wird.

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onResume: () => {
    console.log('resuming application')
  },
})
```
