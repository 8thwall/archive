---
sidebar_label: runPostRender()
---

# XR8.runPostRender()

`XR8.runPostRender()`

## Descripción {#description}

Ejecuta todas las actualizaciones del ciclo de vida que deben producirse después de la renderización.

**IMPORTANTE**: Asegúrese de que se ha llamado a [`onStart`](/legacy/api/camerapipelinemodule/onstart) antes de llamar a `XR8.runPreRender()` / `XR8.runPostRender()`.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
// Implementar el método tock() de los componentes A-Frame
function tock() {
  // Comprobar si XR está inicializado
  ...
  // Ejecutar los métodos del ciclo de vida de XR
  XR8.runPostRender()
}
```
