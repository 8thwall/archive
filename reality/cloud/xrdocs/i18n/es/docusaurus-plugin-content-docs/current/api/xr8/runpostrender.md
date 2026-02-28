---
sidebar_label: runPostRender()
---

# XR8.runPostRender()

`XR8.runPostRender()`

## Descripción {#description}

Ejecuta todas las actualizaciones del ciclo de vida que deben producirse después de la renderización.

**IMPORTANTE**: Asegúrate de que se ha llamado a [`onStart`](/api/camerapipelinemodule/onstart) antes de llamar a `XR8.runPreRender()` / `XR8.runPostRender()`.

## Parámetros {#parameters}

Ninguno

## Vuelta {#returns}

Ninguno

## Ejemplo {#example}

```javascript
// Implementa el método tock() de los componentes A-Frame
function tock() {
 // Comprueba si XR está inicializado
  ...
  // Ejecuta los métodos del ciclo de vida de XR
  XR8.runPostRender()
}
```
