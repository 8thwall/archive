---
sidebar_label: addCameraPipelineModules()
---

# XR8.addCameraPipelineModules()

`XR8.addCameraPipelineModules([ modules ])`

## Descripción {#description}

Añadir varios módulos de canalización de cámara. Este es un método conveniente que llama a [`XR8.addCameraPipelineModule()`](addcamerapipelinemodule.md) en orden en cada elemento de la matriz de entrada.

## Parámetros {#parameters}

| Parámetro | Tipo       | Descripción                                                       |
| --------- | ---------- | ----------------------------------------------------------------- |
| módulos   | `[Objeto]` | Un conjunto de módulos de canalización de cámara. |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
const onxrloaded = () => {
  XR8.addCameraPipelineModules([ // Añadir módulos de canalización de cámara.
    // Módulos existentes.
    XR8.GlTextureRenderer.pipelineModule(), // Dibuja el feed de la cámara.
  ])

  // Solicita permisos de cámara y ejecuta la cámara.
  XR8.run({canvas: document.getElementById('camerafeed')})
}

// Espera a que el javascript XR se haya cargado antes de hacer llamadas XR.
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
