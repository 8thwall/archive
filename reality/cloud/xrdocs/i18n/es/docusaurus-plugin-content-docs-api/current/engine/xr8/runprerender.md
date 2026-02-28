---
sidebar_label: runPreRender()
---

# XR8.runPreRender()

`XR8.runPreRender( timestamp )`

## Descripción {#description}

Ejecuta todas las actualizaciones del ciclo de vida que deben producirse antes de la renderización.

**IMPORTANTE**: Asegúrese de que se ha llamado a [`onStart`](/api/engine/camerapipelinemodule/onstart) antes de llamar a `XR8.runPreRender()` / `XR8.runPostRender()`.

## Parámetros {#parameters}

| Parámetro       | Tipo     | Descripción                                      |
| --------------- | -------- | ------------------------------------------------ |
| marca de tiempo | `Número` | La hora actual, en milisegundos. |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
// Implementar el método tick() de los componentes A-Frame
function tick() {
  // Comprobar la compatibilidad del dispositivo y ejecutar las actualizaciones necesarias de la geometría de la vista y dibujar la imagen de la cámara.
  ...
  // Ejecutar los métodos del ciclo de vida XR
  XR8.runPreRender(Date.now())
}
```
