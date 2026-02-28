# XR8.CanvasScreenshot

## Beschreibung {#description}

Stellt ein Kamera-Pipeline-Modul zur Verfügung, das Screenshots der aktuellen Szene erstellen kann.

## Funktionen {#functions}

| Funktion                                      | Beschreibung                                                                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)                     | Legt das erwartete Ergebnis von Canvas-Screenshots fest.                                                                                                                           |
| [pipelineModule](pipelinemodule.md)           | Erstellt ein Kamera-Pipeline-Modul, das, wenn es installiert ist, Rückrufe empfängt, wenn die Kamera gestartet wurde und wenn sich die Leinwandgröße geändert hat.                 |
| [setForegroundCanvas](setforegroundcanvas.md) | Legt eine Vordergrundleinwand fest, die über der Kameraleinwand angezeigt wird. Diese muss die gleichen Abmessungen haben wie die Leinwand der Kamera.             |
| [takeScreenshot](takescreenshot.md)           | Gibt ein Promise zurück, das, wenn es aufgelöst wird, einen Puffer mit dem JPEG-komprimierten Bild bereitstellt. Bei Ablehnung wird eine Fehlermeldung ausgegeben. |
