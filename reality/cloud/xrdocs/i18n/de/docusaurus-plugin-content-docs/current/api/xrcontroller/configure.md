---
sidebar_label: configure()
---

# XR8.XrController.configure()

`XrController.configure({ disableWorldTracking, enableLighting, enableWorldPoints, enableVps, imageTargets: [], leftHandedAxes, mirroredDisplay, projectWayspots, scale })`

## Beschreibung {#description}

Konfiguriert die von `XrController` durchgeführte Verarbeitung (einige Einstellungen können Auswirkungen auf die Leistung haben).

## Parameter {#parameters}

| Parameter                       | Typ         | Standard     | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------- | ----------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disableWorldTracking [Optional] | `Boolesche` | `false`      | Wenn ja, schalten Sie die SLAM-Verfolgung aus Effizienzgründen aus. Dies muss getan werden **BEVOR** [`XR8.run()`](/api/xr8/run) aufgerufen wird.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| enableLighting [Optional]       | `Boolesche` | `false`      | Falls wahr, wird `Beleuchtung` von [`XR8.XrController.pipelineModule()`](pipelinemodule.md) als `processCpuResult.reality.lighting bereitgestellt`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| enableWorldPoints [Optional]    | `Boolesche` | `false`      | Wenn wahr, wird `worldPoints` von [`XR8.XrController.pipelineModule()`](pipelinemodule.md) als `processCpuResult.reality.worldPoints` bereitgestellt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| enableVps [Optional]            | `Boolesche` | `false`      | Wenn ja, suchen Sie nach Projektstandorten und einem Netz. Das zurückgegebene Netz hat keinen Bezug zu Projektstandorten und wird auch dann zurückgegeben, wenn keine Projektstandorte konfiguriert sind. Die Aktivierung von VPS setzt die Einstellungen für `scale` und `disableWorldTracking` außer Kraft.                                                                                                                                                                                                                                                                                                                                                          |
| imageTargets [Optional]         | `Array`     |              | Liste der Namen der zu erkennenden Bildziele. Kann während der Laufzeit geändert werden. Hinweis: Alle derzeit aktiven Bildziele werden durch die in dieser Liste angegebenen Ziele ersetzt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| leftHandedAxes [Optional]       | `Boolesche` | `false`      | Wenn wahr, verwenden Sie linkshändige Koordinaten.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| mirroredDisplay [Optional]      | `Boolesche` | `false`      | Wenn wahr, spiegeln Sie in der Ausgabe links und rechts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| projectWayspots [Optional]      | `Array`     | `[]`         | Teilmenge der Namen von Projektstandorten, für die ausschließlich eine Lokalisierung erfolgen soll. Wenn ein leeres Array übergeben wird, werden alle nahegelegenen Projektstandorte lokalisiert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| skala [Optional]                | `String`    | `responsive` | Entweder `responsive` oder `absolute`. `responsive` gibt Werte zurück, so dass sich die Kamera auf Bild 1 am Ursprung befindet, der über [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md) definiert wurde. `absolute` gibt die Kamera, Bildziele usw. in Metern zurück. Wenn Sie `absolut` verwenden, werden die x-Position, die z-Position und die Drehung der Ausgangspose die in [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md) festgelegten Parameter berücksichtigen, sobald die Skalierung geschätzt wurde. Die y-Position hängt von der physischen Höhe der Kamera über dem Boden ab. |

**WICHTIG:** `disableWorldTracking: true` muss gesetzt werden **BEVOR** sowohl [`XR8.XrController.pipelineModule()`](pipelinemodule.md) als auch [`XR8.run()`](/api/xr8/run) aufgerufen werden und kann nicht geändert werden, während die Engine läuft.

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.XrController.configure({enableLighting: true, disableWorldTracking: false, scale: 'absolute'})
```

## Beispiel - VPS aktivieren {#example---enable-vps}

```javascript
XR8.XrController.configure({enableVps: true})
```

## Beispiel - Weltverfolgung deaktivieren {#example---disable-world-tracking}

```javascript
// Deaktivieren Sie die Weltverfolgung (SLAM)
XR8.XrController.configure({disableWorldTracking: true})
// Öffnen Sie die Kamera und starten Sie die Kameralaufschleife
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Beispiel - Aktives Bildzielset ändern {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```
