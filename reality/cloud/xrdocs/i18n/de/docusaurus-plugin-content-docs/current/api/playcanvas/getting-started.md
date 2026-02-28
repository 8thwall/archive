# Erste Schritte mit PlayCanvas

Um loszulegen, besuchen Sie <https://playcanvas.com/user/the8thwall> und forken Sie ein Beispielprojekt:

* Starter Kit Beispielprojekte
  * [Image Tracking Starter Kit](https://playcanvas.com/project/631721/overview/8th-wall-ar-image-targets): Eine Anwendung, mit der Sie schnell mit der Erstellung von Bildverfolgungsanwendungen in PlayCanvas beginnen können.
  * [World Tracking Starter Kit](https://playcanvas.com/project/631719/overview/8th-wall-ar-world-tracking): Eine Anwendung, mit der Sie schnell mit der Erstellung von World-Tracking-Anwendungen in PlayCanvas beginnen können.
  * [Face Effects Starter Kit](https://playcanvas.com/project/687674/overview/8th-wall-ar-face-effects): Eine Anwendung, mit der Sie schnell Face Effects-Anwendungen in PlayCanvas erstellen können.
  * [Himmelseffekte Starter Kit](https://playcanvas.com/project/1055775/overview/8th-wall-sky-effects): Eine Anwendung, mit der Sie schnell Himmelseffekte-Anwendungen in PlayCanvas erstellen können.
  * [Handverfolgung Starter Kit](https://playcanvas.com/project/1115012/overview/8th-wall-ar-hand-tracking): Eine Anwendung, mit der Sie schnell Handverfolgung-Anwendungen in PlayCanvas erstellen können.
  * [Ear Tracking Starter Kit](https://playcanvas.com/project/1158433/overview/8th-wall-ears): Eine Anwendung, mit der Sie schnell Ohrverfolgung-Anwendungen in PlayCanvas erstellen können.


* Zusätzliche Beispielprojekte
  * [World Tracking und Gesichtseffekte](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera): Ein Beispiel, das zeigt, wie Sie in einem einzigen Projekt zwischen World Tracking und Gesichtseffekten wechseln können.
  * [Color Swap](https://playcanvas.com/project/783654/overview/8th-wall-ar-color-swap): Eine Anwendung, mit der Sie schnell AR-World-Tracking-Anwendungen erstellen können, die eine einfache Benutzeroberfläche und Farbwechsel beinhalten.
  * [Swap Scenes](https://playcanvas.com/project/781435/overview/8th-wall-ar-swap-scenes): Eine Anwendung, mit der Sie schnell AR World Tracking-Anwendungen erstellen können, die die Szenen wechseln.
  * [Kamera tauschen](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera): Eine Anwendung, die Ihnen zeigt, wie Sie zwischen Face Effects der Frontkamera und World Tracking der Rückkamera wechseln können.

## Fügen Sie Ihren App-Schlüssel hinzu {#add-your-app-key}

Gehen Sie zu Einstellungen -> Externe Skripte

Die folgenden beiden Skripte sollten hinzugefügt werden:

* `https://cdn.8thwall.com/web/xrextras/xrextras.js`
* `https://apps.8thwall.com/xrweb?appKey=XXXXXX`

Ersetzen Sie dann `XXXXXX` durch Ihren eigenen, einzigartigen App-Schlüssel, den Sie von der 8th Wall Console erhalten haben.

## Aktivieren Sie "Transparente Leinwand" {#enable-transparent-canvas}

1. Gehen Sie zu Einstellungen -> Rendering.
2. Vergewissern Sie sich, dass "Transparente Leinwand" **markiert ist**.

## Deaktivieren Sie "WebGL 2.0 bevorzugen" {#disable-prefer-webgl-20}

1. Gehen Sie zu Einstellungen -> Rendering.
2. Vergewissern Sie sich, dass "WebGL 2.0 bevorzugen" **nicht markiert ist**.

## Xrcontroller.js hinzufügen {#add-xrcontroller}
Die 8th Wall PlayCanvas-Beispielprojekte werden mit einem XRController-Spielobjekt bestückt. Wenn Sie mit einem leeren Projekt beginnen, laden Sie `xrcontroller.js` von <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> herunter und fügen Sie es an eine Entität in Ihrer Szene an.

**HINWEIS**: Nur für SLAM und/oder Image Target Projekte. `xrcontroller.js` und `facecontroller.js` oder `layerscontroller.js` können nicht gleichzeitig verwendet werden.

| Option               | Beschreibung                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disableWorldTracking | Wenn ja, schalten Sie die SLAM-Verfolgung aus Effizienzgründen aus.                                                                                                                                      |
| shadowmaterial       | Material, das Sie als transparenten Schattenempfänger verwenden möchten (z.B. für Bodenschatten). Normalerweise wird dieses Material auf einer "Boden"-Ebene verwendet, die bei (0,0,0) positioniert ist |

## Layerscontroller.js hinzufügen {#add-layerscontroller}
Die 8th Wall Beispiel-PlayCanvas-Projekte sind mit einem FaceController-Spielobjekt bestückt. Wenn Sie mit einem leeren Projekt beginnen, laden Sie `layerscontroller.js` von <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> herunter und fügen Sie es an eine Entität in Ihrer Szene an.

**HINWEIS**: Nur für Himmelseffekte-Projekte. `layerscontroller.js` und `facecontroller.js` oder `xrcontroller.js` können nicht gleichzeitig verwendet werden.

## Facecontroller.js hinzufügen {#add-facecontroller}
Die 8th Wall Beispiel-PlayCanvas-Projekte sind mit einem FaceController-Spielobjekt bestückt. Wenn Sie mit einem leeren Projekt beginnen, laden Sie `facecontroller.js` von <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> herunter und fügen Sie es an eine Entität in Ihrer Szene an.

**HINWEIS**: Nur für Face Effects-Projekte. `facecontroller.js` und `xrcontroller.js` oder `layerscontroller.js` oder `handcontroller.js` können nicht gleichzeitig verwendet werden.

| Option     | Beschreibung                                                                 |
| ---------- | ---------------------------------------------------------------------------- |
| headAnchor | Die Entität, die an der Wurzel des Kopfes im Weltraum verankert werden soll. |

## Handcontroller.js hinzufügen {#add-handcontroller}
Die 8th Wall Beispiel-PlayCanvas-Projekte sind mit einem HandController-Spielobjekt bestückt. Wenn Sie mit einem leeren Projekt beginnen, laden Sie `handcontroller.js` von <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> herunter und fügen Sie es an eine Entität in Ihrer Szene an.

**HINWEIS**: Nur für Handverfolgung Projekte. `handcontroller.js` und `xrcontroller.js` oder `layerscontroller.js` oder `facecontroller.js` können nicht gleichzeitig verwendet werden.

| Option    | Beschreibung                                                        |
| --------- | ------------------------------------------------------------------- |
| handAnker | Die Entität, die an der Wurzel der Hand im Weltraum verankert wird. |
