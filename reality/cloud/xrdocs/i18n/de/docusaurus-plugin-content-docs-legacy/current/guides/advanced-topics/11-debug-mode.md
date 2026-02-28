---
id: debug-mode
---

# Debug-Modus

Der Debug-Modus ist eine erweiterte Cloud-Editor-Funktion, die Protokollierung, Leistungsinformationen und
erweiterte Visualisierungen direkt auf Ihrem Gerät bereitstellt.

Hinweis: Der Debug-Modus wird derzeit bei der Vorschau von Erlebnissen auf kopfgetragenen Geräten nicht angezeigt.

#### So aktivieren Sie den Debug-Modus {#to-activate-debug-mode}

1. Klicken Sie oben im Fenster des Cloud-Editors auf die Schaltfläche **Vorschau**.
2. Unterhalb des QR-Codes schalten Sie den **Debug-Modus** ein.
3. Scannen Sie den QR-Code, um eine Vorschau Ihres WebAR-Projekts mit über der Seite eingeblendeten Debug-Informationen anzuzeigen:

![debug1](/images/debug-mode-preview.jpg)

Wenn Sie bereits ein Gerät mit der Cloud Editor-Konsole verbunden haben, können Sie den Debug-Modus
jederzeit aktivieren/deaktivieren, indem Sie auf den Schalter "Debug-Modus" drücken, wenn Sie die Registerkarte "Gerät" ausgewählt haben.

![debug2](/images/debug-mode-console.jpg)

Debug-Modus-Statistiken:

Je nachdem, welchen Renderer Ihr Projekt verwendet, werden im Debug-Modus einige der folgenden Informationen angezeigt:

![debug3](/images/debug-mode-stats.jpg)

<u>Statistik-Panel</u> (zum Minimieren antippen)

- fps - Bilder pro Sekunde, Framerate.
- Tris - Anzahl der pro Frame gerenderten Dreiecke.\*
- Zeichnungsaufrufe - Anzahl der Zeichnungsaufrufe pro Frame. Ein Zeichenaufruf ist ein Aufruf an die Grafik-API zum Zeichnen von Objekten (z. B. Zeichnen eines Dreiecks).\*
- Texturen - Anzahl der Texturen in der Szene.\*
- Tex(max) - die maximale Dimension der größten Textur in der Szene.\*
- Shader - Anzahl der GLSL-Shader in der Szene.\*
- Geometries - Anzahl der Geometrien in der Szene.\*
- Punkte - Anzahl der Punkte in der Szene. Wird nur angezeigt, wenn die Szene mehr als 0,\* hat.
- Entitäten - Anzahl der A-Frame-Entitäten in der Szene.\*
- ImgTargets - Anzahl der aktiven 8th Wall Bildziele in der Szene.
- Modelle - Gesamtgröße in MB aller "<a-asset-items>" (nur vorinstallierte 3D-Modelle) in "<a-assets>".\*

<u>Version Panel</u>

- Engine Version - Version der 8th Wall AR-Engine, mit der das Erlebnis durchgeführt wird.
- Renderer-Version - Version des Renderers, mit dem das Erlebnis ausgeführt wird.

<u>Tools-Panel</u>

- Konsole - zeigt Live-Konsolenprotokolle an.
- Aktionen - Optionen zum Zurücksetzen der XR-Kamera (XR8.recenter()), zum Anzeigen der erkannten Oberfläche\* und zum Anzeigen der A-Frame-Inspektion\*.
- Kamera - zeigt die Position und Drehung der XR-Kamera an.
- Minimieren - minimiert die Werkzeugleiste.

[\*] verfügbar in Cloud Editor-Projekten mit A-Frame
