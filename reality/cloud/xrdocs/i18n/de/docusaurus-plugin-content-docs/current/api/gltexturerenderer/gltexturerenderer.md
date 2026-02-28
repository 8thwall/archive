# XR8.GlTextureRenderer

## Beschreibung {#description}

Stellt ein Kamera-Pipeline-Modul bereit, das den Kamera-Feed auf eine Leinwand zeichnet, sowie zusätzliche Dienstprogramme für GL-Zeichenoperationen.

## Funktionen {#functions}

| Funktion                                                        | Beschreibung                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)                                       | Konfiguriert das Pipeline-Modul, das den Kamerafeed auf die Leinwand zeichnet.                                                                                                                                                                                       |
| [erstellen](create.md)                                          | Erzeugt ein Objekt zum Rendern von einer Textur auf eine Leinwand oder eine andere Textur.                                                                                                                                                                           |
| [fillTextureViewport](filltextureviewport.md)                   | Komfortable Methode, um eine Ansichtsfenster-Struktur zu erhalten, die eine Textur oder Leinwand aus einer Quelle ohne Verzerrung füllt. Dies wird an die Render-Methode des Objekts übergeben, das von [`XR8.GlTextureRenderer.create() erstellt wurde`](create.md) |
| [getGLctxParameter](getglctxparameters.md)                      | Ruft den aktuellen Satz von WebGL-Bindungen ab, so dass diese später wiederhergestellt werden können.                                                                                                                                                                |
| [pipelineModule](pipelinemodule.md)                             | Erzeugt ein Pipeline-Modul, das den Kamerafeed auf die Leinwand zeichnet.                                                                                                                                                                                            |
| [setGLctxParameter](setglctxparameters.md)                      | Stellt die WebGL-Bindungen wieder her, die mit [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md) gespeichert wurden.                                                                                                                             |
| [setTextureProvider](settextureprovider.md)                     | Legt einen Anbieter fest, der die zu zeichnende Textur übergibt.                                                                                                                                                                                                     |
| [setForegroundTextureProvider](setforegroundtextureprovider.md) | Legt einen Anbieter fest, der eine Liste von Vordergrundtexturen und Alphamasken zum Zeichnen übergibt.                                                                                                                                                              |
