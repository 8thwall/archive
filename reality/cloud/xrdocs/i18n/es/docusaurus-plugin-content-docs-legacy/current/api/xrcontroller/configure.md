---
sidebar_label: configurar()
---

# XR8.XrController.configure()

XrController.configure({ disableWorldTracking, enableLighting, enableWorldPoints, enableVps, imageTargets: [], leftHandedAxes, mirroredDisplay, projectWayspots, scale })\`.

## Descripción {#description}

Configura el procesamiento realizado por `XrController` (algunos ajustes pueden tener implicaciones de rendimiento).

## Parámetros {#parameters}

| Parámetro                                                                           | Tipo     | Por defecto  | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------- | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disableWorldTracking [Opcional] | Booleano | `false`      | Si es true, desactiva el seguimiento SLAM por eficiencia. Esto debe hacerse **ANTES** de llamar a [`XR8.run()`](/legacy/api/xr8/run).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| enableLighting [Opcional]       | Booleano | `false`      | Si es true, `lighting` será proporcionado por [`XR8.XrController.pipelineModule()`](pipelinemodule.md) como `processCpuResult.reality.lighting`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| enableWorldPoints [Opcional]    | Booleano | `false`      | Si es verdadero, `worldPoints` será proporcionado por [`XR8.XrController.pipelineModule()`](pipelinemodule.md) como `processCpuResult.reality.worldPoints`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| enableVps [Opcional]            | Booleano | `false`      | Si es cierto, busque Ubicaciones de proyecto y una malla. La malla que se devuelve no tiene relación con las Ubicaciones del Proyecto y se devolverá incluso si no hay ninguna Ubicación del Proyecto configurada. Activar VPS anula la configuración de `scale` y `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                                                                  |
| imageTargets [Opcional]         | `Array`  |              | Lista de nombres del objetivo de imagen a detectar. Puede modificarse en tiempo de ejecución. Nota: Todos los objetivos de imagen actualmente activos serán sustituidos por los especificados en esta lista.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| leftHandedAxes [Opcional]       | Booleano | `false`      | Si es true, usa coordenadas a la izquierda.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| mirroredDisplay [Opcional]      | Booleano | `false`      | Si es true, voltea a izquierda y derecha en la salida.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| projectWayspots [Opcional]      | `Array`  | `[]`         | Subconjunto de nombres de ubicaciones de proyectos contra los que localizar exclusivamente. Si se pasa una matriz vacía, localizaremos todas las ubicaciones de proyecto cercanas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| escala [Opcional]               | Cadena   | `responsive` | O bien `responsivo` o bien `absoluto`. `responsive` devolverá valores para que la cámara en el fotograma 1 esté en el origen definido mediante [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md). `absolute` devolverá la cámara, objetivos de imagen, etc en metros. Cuando se utiliza `absolute` la posición x, la posición z y la rotación de la pose inicial respetarán los parámetros establecidos en [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md) una vez que se ha estimado la escala. La posición y dependerá de la altura física de la cámara desde el plano del suelo. |

**IMPORTANTE:** `disableWorldTracking: true` tiene que ser configurado **ANTES** de que [`XR8.XrController.pipelineModule()`](pipelinemodule.md) y [`XR8.run()`](/legacy/api/xr8/run) sean llamados y no pueden ser modificados mientras el motor está funcionando.

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.XrController.configure({enableLighting: true, disableWorldTracking: false, scale: 'absolute'})
```

## Ejemplo - Habilitar VPS {#example---enable-vps}

```javascript
XR8.XrController.configure({enableVps: true})
```

## Ejemplo - Desactivar el seguimiento mundial {#example---disable-world-tracking}

```javascript
// Desactiva el seguimiento del mundo (SLAM)
XR8.XrController.configure({disableWorldTracking: true})
// Abre la cámara y comienza a ejecutar el bucle de ejecución de cámara
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Ejemplo - Cambiar el conjunto de destino de imagen activo {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['imagen-objetivo1', 'imagen-objetivo2', 'imagen-objetivo3']})
```
