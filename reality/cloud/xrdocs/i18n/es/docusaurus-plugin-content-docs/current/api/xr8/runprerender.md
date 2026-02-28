---
sidebar_label: runPreRender()
---

# XR8.runPreRender()

`XR8.runPreRender( timestamp )`

## Descripción {#description}

Ejecuta todas las actualizaciones del ciclo de vida que deben producirse antes de la renderización.

**IMPORTANTE**: Asegúrate de que se ha llamado a [`onStart`](/api/camerapipelinemodule/onstart) antes de llamar a `XR8.runPreRender()` / `XR8.runPostRender()`.

## Parámetros {#parameters}

| Parámetro | Tipo     | Descripción                      |
| --------- | -------- | -------------------------------- |
| timestamp | `Number` | La hora actual, en milisegundos. |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
// Implementa el método tick() de los componentes A-Frame
function tick() {
 // Comprueba la compatibilidad del dispositivo y ejecuta las actualizaciones necesarias de la geometría de la vista y dibuja el canal de la cámara.
  ...
  // Ejecuta los métodos del ciclo de vida de XR
  XR8.runPreRender(Date.now())
 }
```
