---
sidebar_label: removeCameraPipelineModules()
---

# XR8.removeCameraPipelineModules()

`XR8.removeCameraPipelineModules([ moduleNames ])`

## Descripción {#description}

Eliminar varios módulos de canalización de cámara. Se trata de un método práctico que llama a
[`XR8.removeCameraPipelineModule()`](removecamerapipelinemodule.md) en orden en cada elemento de la matriz de entrada
.

## Parámetros {#parameters}

| Parámetro   | Tipo                  | Descripción                                                                                     |
| ----------- | --------------------- | ----------------------------------------------------------------------------------------------- |
| moduleNames | `[Cadena] u [Objeto]` | Un array de objetos con una propiedad name, o una cadena de nombres de módulos. |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.removeCameraPipelineModules(['threejsrenderer', 'reality'])
```
