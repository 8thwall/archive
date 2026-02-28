---
sidebar_label: configure()
---

# XR8.XrController.configure()

`XrController.configure({ disableWorldTracking, enableLighting, enableWorldPoints, enableVps, imageTargets: [], leftHandedAxes, mirroredDisplay, projectWayspots, scale })`

## Descripción {#description}

Configura el procesamiento realizado por `XrController` (algunos ajustes pueden tener implicaciones en el rendimiento).

## Parámetros {#parameters}

| Parámetro                       | Tipo       | Por defecto  | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------- | ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disableWorldTracking [Opcional] | `Booleano` | `false`      | Si es verdadero, desactive el seguimiento SLAM por eficiencia. Esto debe hacerse **ANTES** de llamar a [`XR8.run()`](/api/xr8/run).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| enableLighting [Opcional]       | `Booleano` | `false`      | Si es verdadero, la `iluminación` será proporcionada por [`XR8.XrController.pipelineModule()`](pipelinemodule.md) como `processCpuResult.reality.lighting`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| enableWorldPoints [Opcional]    | `Booleano` | `false`      | Si es verdadero, `worldPoints` serán proporcionados por [`XR8.XrController.pipelineModule()`](pipelinemodule.md) como `processCpuResult.reality.worldPoints`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| enableVps [Opcional]            | `Booleano` | `false`      | Si es cierto, busque Ubicaciones de proyecto y una malla. La malla que se devuelve no tiene relación con las Ubicaciones del Proyecto y se devolverá incluso si no hay ninguna Ubicación del Proyecto configurada. Activar VPS anula los ajustes de `scale` y `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                          |
| imageTargets [Opcional]         | `Matriz`   |              | Lista de nombres del objetivo de imagen a detectar. Puede modificarse en tiempo de ejecución. Nota: Todos los objetivos de imagen actualmente activos serán sustituidos por los especificados en esta lista.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| leftHandedAxes [Opcional]       | `Booleano` | `false`      | Si es verdadero, utiliza coordenadas zurdas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| mirroredDisplay [Opcional]      | `Booleano` | `false`      | Si es verdadero, voltea a izquierda y derecha en la salida.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| projectWayspots [Opcional]      | `Matriz`   | `[]`         | Subconjunto de nombres de ubicaciones de proyectos contra los que localizar exclusivamente. Si se pasa una matriz vacía, localizaremos todas las ubicaciones de proyecto cercanas.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| scale [Opcional]                | `Cadena`   | `responsive` | O bien `receptivo` o `absoluto`. `responsive` devolverá valores para que la cámara del fotograma 1 esté en el origen definido mediante [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md). `absoluto` devolverá la cámara, los objetivos de imagen, etc. en metros. Cuando se utiliza `absoluto` la posición x, la posición z y la rotación de la pose inicial respetarán los parámetros establecidos en [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md) una vez estimada la escala. La posición y dependerá de la altura física de la cámara desde el plano del suelo. |

**IMPORTANTE:** `disableWorldTracking: true` debe establecerse **ANTES** de tanto [`XR8.XrController.pipelineModule()`](pipelinemodule.md) como [`XR8.run()`](/api/xr8/run) se llamen y no puedan modificarse mientras el motor esté en marcha.

## Vuelta {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.XrController.configure({enableLighting: true, disableWorldTracking: false, scale: 'absolute'})
```

## Ejemplo - Activar VPS {#example---enable-vps}

```javascript
XR8.XrController.configure({enableVps: true})
```

## Ejemplo - Desactivar el seguimiento del mundo {#example---disable-world-tracking}

```javascript
// Desactiva el seguimiento del mundo (SLAM)
XR8.XrController.configure({disableWorldTracking: true})
// Abre la cámara y comienza a ejecutar el bucle de ejecución de la cámara
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Ejemplo - Cambiar la configuración del objetivo de imagen activo {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```
