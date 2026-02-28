# onAppResourcesLoaded()

`onAppResourcesLoaded: ({ framework, imageTargets, version })`

## Descripción {#description}

Se llama a `onAppResourcesLoaded()` cuando hemos recibido del servidor los recursos adjuntos a una aplicación.

## Parámetros {#parameters}

| Parámetro                                                                   | Descripción                                                                                  |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| marco                                                                       | Los enlaces de este módulo para el envío de eventos.                         |
| imageTargets [Opcional] | Una matriz de objetivos de imagen con los campos {imagePath, metadata, name}                 |
| versión                                                                     | La versión del motor, por ejemplo 14.0.8.949 |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name = 'myPipelineModule',
  onAppResourcesLoaded = ({ framework, version, imageTargets }) => {
    //...
  },
})
```
