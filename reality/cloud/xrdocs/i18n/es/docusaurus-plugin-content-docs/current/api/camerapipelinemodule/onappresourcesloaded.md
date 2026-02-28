# onAppResourcesLoaded()

`onAppResourcesLoaded: ({ framework, imageTargets, version })`

## Descripción {#description}

`onAppResourcesLoaded()` se llama cuando hemos recibido del servidor los recursos adjuntos a una app.

## Parámetros {#parameters}

| Parámetro               | Descripción                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| framework               | Los enlaces del marco de este módulo para enviar eventos.                    |
| imageTargets [Opcional] | Una matriz de objetivos de imagen con los campos {imagePath, metadata, name} |
| version                 | La versión del motor, por ejemplo 14.0.8.949                                 |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name = 'myPipelineModule',
  onAppResourcesLoaded = ({ framework, version, imageTargets }) => {
    //...
  },
})
```
