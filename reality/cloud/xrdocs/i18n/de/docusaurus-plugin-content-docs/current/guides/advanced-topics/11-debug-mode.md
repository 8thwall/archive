---
id: debug-mode
---

# Debug-Modus

Der Debug-Modus ist eine erweiterte Funktion des Cloud Editors, die Protokollierung, Leistungsinformationen und erweiterte Visualisierungen direkt auf Ihrem Gerät bietet.

Hinweis: Der Debug-Modus wird derzeit bei der Vorschau von Erlebnissen auf kopfgetragenen Geräten nicht angezeigt.

#### So aktivieren Sie den Debug-Modus {#to-activate-debug-mode}

1. Klicken Sie oben im Fenster Cloud Editor auf die Schaltfläche **Vorschau** .
2. Schalten Sie unterhalb des QR-Codes **den Debug-Modus** ein.
3. Scannen Sie den QR-Code, um eine Vorschau Ihres WebAR-Projekts mit über der Seite eingeblendeten Debug-Informationen anzuzeigen:

![debug1](/images/debug-mode-preview.jpg)

Wenn Sie bereits ein Gerät in der Cloud Editor-Konsole angeschlossen haben, können Sie den Debug-Modus jederzeit aktivieren/deaktivieren, indem Sie auf den Schalter "Debug-Modus" drücken, wenn Sie die Registerkarte "Gerät" ausgewählt haben.

![debug2](/images/debug-mode-console.jpg)

Debug-Modus-Statistiken:

Je nachdem, welchen Renderer Ihr Projekt verwendet, werden im Debug-Modus einige der folgenden Informationen angezeigt:

![debug3](/images/debug-mode-stats.jpg)

<u>Statistik-Panel</u> (zum Minimieren antippen)

* fps - Bilder pro Sekunde, Framerate.
* Tris - Anzahl der gerenderten Dreiecke pro Frame.\*
* Zeichnungsaufrufe - Anzahl der Zeichnungsaufrufe pro Frame. Ein Zeichenaufruf ist ein Aufruf an die Grafik-API, um Objekte zu zeichnen (z.B. ein Dreieck zu zeichnen).\*
* Texturen - Anzahl der Texturen in der Szene.\*
* Tex(max) - die maximale Dimension der größten Textur in der Szene.\*
* Shader - Anzahl der GLSL-Shader in der Szene.\*
* Geometries - Anzahl der Geometrien in der Szene.\*
* Punkte - Anzahl der Punkte in der Szene. Wird nur angezeigt, wenn die Szene mehr als 0,\* hat
* Entitäten - Anzahl der A-Frame-Entitäten in der Szene.\*
* ImgTargets - Anzahl der aktiven 8th Wall Bildziele in der Szene.
* Modelle - Gesamtgröße in MB aller `` (nur vorinstallierte 3D-Modelle) in ``.\*

<u>Version Panel</u>

* Engine Version - Version der 8th Wall AR-Engine, die das Erlebnis verwendet.
* Renderer Version - Version des Renderers, mit dem das Erlebnis ausgeführt wird.\*

<u>Tools-Panel</u>

* Konsole - zeigt Live-Konsolenprotokolle an.
* Aktionen - Optionen zum Zurücksetzen der XR-Kamera (XR8.recenter()), zum Anzeigen der erkannten Oberfläche\* und zum Anzeigen des A-Frame-Inspektors\*.
* Kamera - zeigt die Position und Drehung der XR-Kamera an.
* Minimieren - minimiert die Werkzeugleiste.

[*] verfügbar in Cloud Editor-Projekten mit A-Frame
