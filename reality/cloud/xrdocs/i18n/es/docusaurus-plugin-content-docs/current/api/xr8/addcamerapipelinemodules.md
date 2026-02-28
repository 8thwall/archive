---
sidebar_label: addCameraPipelineModules()
---

# XR8.addCameraPipelineModules()

`XR8.addCameraPipelineModules([ modules ])`

## Descripción {#description}

Añade varios módulos de canalización de cámara. Este es un método práctico que llama a [`XR8.addCameraPipelineModule()`](addcamerapipelinemodule.md) en orden en cada elemento de la matriz de entrada.

## Parámetros {#parameters}

| Parámetro | Tipo       | Descripción                                       |
| --------- | ---------- | ------------------------------------------------- |
| modules   | `[Objeto]` | Un conjunto de módulos de canalización de cámara. |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
const onxrloaded = () => {
  XR8.addCameraPipelineModules([ // Añade módulos de canalización de cámara.
    // Módulos de canalización existentes.
    XR8.GlTextureRenderer.pipelineModule(), // Dibuja la imagen de la cámara.
  ])

 // Solicita permisos para la cámara y ejecútala.
  XR8.run({canvas: document.getElementById('camerafeed')})
}

// Espera a que se haya cargado el javascript XR antes de hacer llamadas XR.
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
