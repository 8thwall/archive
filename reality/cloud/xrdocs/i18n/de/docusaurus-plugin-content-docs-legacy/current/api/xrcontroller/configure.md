---
sidebar_label: konfigurieren()
---

# XR8.XrController.configure()

`XrController.configure({ disableWorldTracking, enableLighting, enableWorldPoints, enableVps, imageTargets: [], leftHandedAxes, mirroredDisplay, projectWayspots, scale })`

## Beschreibung {#description}

Konfiguriert die von `XrController` durchgeführte Verarbeitung (einige Einstellungen können Auswirkungen auf die Leistung haben).

## Parameter {#parameters}

| Parameter                                                                           | Typ       | Standard         | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------- | --------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disableWorldTracking [Optional] | `Boolean` | false            | Wenn ja, wird das SLAM-Tracking aus Effizienzgründen deaktiviert. Dies muss **VOR** dem Aufruf von [`XR8.run()`](/legacy/api/xr8/run) geschehen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| enableLighting [Optional]       | `Boolean` | false            | Bei "true" wird die "Beleuchtung" von [XR8.XrController.pipelineModule()](pipelinemodule.md) als "processCpuResult.reality.lighting" bereitgestellt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| enableWorldPoints [Optional]    | `Boolean` | false            | Wenn true, werden `worldPoints` von [`XR8.XrController.pipelineModule()`](pipelinemodule.md) als `processCpuResult.reality.worldPoints` bereitgestellt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| enableVps [Optional]            | `Boolean` | false            | Wenn ja, suchen Sie nach Projektstandorten und einem Netz. Das zurückgegebene Netz hat keinen Bezug zu Projektstandorten und wird auch dann zurückgegeben, wenn keine Projektstandorte konfiguriert sind. Die Aktivierung von VPS überschreibt die Einstellungen für `Scale` und `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| imageTargets [Optional]         | Array     |                  | Liste der Namen der zu erkennenden Bildziele. Kann zur Laufzeit geändert werden. Hinweis: Alle derzeit aktiven Bildziele werden durch die in dieser Liste angegebenen Ziele ersetzt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| leftHandedAxes [Optional]       | `Boolean` | false            | Wenn true, werden linkshändige Koordinaten verwendet.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| mirroredDisplay [Optional]      | `Boolean` | false            | Wenn true, wird in der Ausgabe nach links und rechts gespiegelt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| projectWayspots [Optional]      | Array     | `[]`             | Teilmenge der Namen von Projektstandorten, für die ausschließlich eine Lokalisierung erfolgen soll. Wenn ein leeres Array übergeben wird, werden alle nahegelegenen Projektstandorte lokalisiert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Skala [fakultativ]              | `String`  | reaktionsschnell | Entweder `reagierend` oder `absolut`. `responsive` gibt Werte zurück, so dass sich die Kamera auf Bild 1 am Ursprung befindet, der mit [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md) definiert wurde. Absolute" gibt die Kamera, die Bildziele usw. in Metern zurück. Bei der Verwendung von "absolut" werden die x-Position, die z-Position und die Drehung der Ausgangspose die in [XR8.XrController.updateCameraProjectionMatrix()] (updatecameraprojectionmatrix.md) festgelegten Parameter einhalten, sobald der Maßstab geschätzt wurde. Die y-Position hängt von der physischen Höhe der Kamera über der Bodenebene ab. |

**WICHTIG:** `disableWorldTracking: true` muss gesetzt werden **BEVOR** sowohl [`XR8.XrController.pipelineModule()`](pipelinemodule.md) als auch [`XR8.run()`](/legacy/api/xr8/run) aufgerufen werden und kann nicht geändert werden, während die Engine läuft.

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.XrController.configure({enableLighting: true, disableWorldTracking: false, scale: 'absolute'})
```

## Beispiel - VPS einschalten {#example---enable-vps}

```javascript
XR8.XrController.configure({enableVps: true})
```

## Beispiel - Deaktivieren der Weltverfolgung {#example---disable-world-tracking}

```javascript
// Deaktivieren Sie die Weltverfolgung (SLAM)
XR8.XrController.configure({disableWorldTracking: true})
// Öffnen Sie die Kamera und starten Sie die Kameraablaufschleife
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Beispiel - Ändern des aktiven Bildzielsatzes {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```
